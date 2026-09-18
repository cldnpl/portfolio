import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { publicAsset } from "@/lib/assets";
import type { DeviceConfig, DeviceStage } from "../three/DeviceStage";
import { CONTACT_EMAIL, homeCopy } from "../copy";

const DEVICES: DeviceConfig[] = [
  {
    key: "visionos",
    url: publicAsset("models/vision-pro.glb"),
    height: 3.5,
    // Turned towards its front glass: the strap reads as a product shot, the
    // lens reads as a platform.
    rest: [0.1, -0.95, 0.03],
  },
  {
    key: "android",
    url: publicAsset("models/galaxy-s21-ultra.glb"),
    height: 2.95,
    // Rest angles are relative to "screen facing the camera" — DeviceStage
    // measures each model's own orientation and corrects for it on load.
    rest: [0.07, -0.36, 0.03],
    screenMesh: "Screen_Screen_0",
    screenInset: 0.012,
    screenVariant: "android",
    wallpaper: publicAsset("lockscreens/android.jpg"),
  },
  {
    key: "ios",
    url: publicAsset("models/iphone-16-pro-max.glb"),
    height: 3.35,
    rest: [0.05, -0.24, 0.01],
    screenMesh: "Cube.014_screen.001_0",
    screenInset: 0.02,
    screenVariant: "ios",
    wallpaper: publicAsset("lockscreens/ios.jpg"),
    // The buttons live on the iPhone and nowhere else.
    interactive: true,
    approach: true,
  },
];

/**
 * Extra scroll past the last chapter, in chapter units. The closing device
 * spends it coming towards the reader rather than sliding away.
 */
const OUTRO = 0.62;

/** Where each on-screen button goes. */
const DESTINATIONS = ["/projects", "/about", `mailto:${CONTACT_EMAIL}`];

export default function PlatformStage() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang];
  const navigate = useNavigate();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<DeviceStage | null>(null);

  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  /** True once the reader is near the end of the pinned section, so the
   *  "keep scrolling" cue can retire instead of nagging. */
  const [nearEnd, setNearEnd] = useState(false);

  const chapters = copy.stage.chapters;

  const handleSelect = useCallback(
    (_key: string, index: number) => {
      const target = DESTINATIONS[index];
      if (!target) return;
      if (target.startsWith("mailto:")) window.location.href = target;
      else navigate(target);
    },
    [navigate]
  );

  // -- scene lifecycle ------------------------------------------------------
  //
  // three.js plus the loaders is ~600 kB — more than the rest of the page put
  // together. It is pulled in only once this section is within a couple of
  // screens, so the hero paints without waiting for a renderer it cannot use
  // yet.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let stage: DeviceStage | null = null;
    let cancelled = false;
    let starting = false;

    const onResize = () => stage?.resize();

    const boot = async () => {
      if (starting || cancelled) return;
      starting = true;

      const { DeviceStage: Stage } = await import("../three/DeviceStage");
      if (cancelled) return;

      stage = new Stage(canvas, {
        onProgress: (done, total) => setLoaded(done / total),
        onReady: () => setReady(true),
        onSelect: handleSelect,
      });
      stageRef.current = stage;
      // Handy when tuning poses from the console: window.__stage.
      if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__stage = stage;

      window.addEventListener("resize", onResize);

      await stage.load(DEVICES, copy.phone).catch((error) => {
        console.error("[stage] failed to load devices", error);
        setReady(true);
      });

      if (cancelled) return;
      // Pick up whatever the page has already scrolled past.
      window.dispatchEvent(new Event("scroll"));
    };

    const maybeBoot = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight) {
        window.removeEventListener("scroll", maybeBoot);
        void boot();
      }
    };

    window.addEventListener("scroll", maybeBoot, { passive: true });
    window.addEventListener("resize", maybeBoot);

    // Re-check on a couple of later ticks as well: on a reload deep in the
    // page the browser restores the scroll position *after* effects run, and
    // it does not always fire a scroll event doing so — without this the
    // section can sit on its loading bar until the reader scrolls.
    maybeBoot();
    const retries = [80, 400, 1200].map((delay) => window.setTimeout(maybeBoot, delay));

    return () => {
      cancelled = true;
      retries.forEach(window.clearTimeout);
      window.removeEventListener("scroll", maybeBoot);
      window.removeEventListener("resize", maybeBoot);
      window.removeEventListener("resize", onResize);
      stage?.dispose();
      stageRef.current = null;
    };
    // handleSelect is stable; copy.phone is re-applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw the phone screen when the language changes
  useEffect(() => {
    stageRef.current?.setScreenContent(copy.phone);
  }, [copy.phone]);

  // -- scroll driving -------------------------------------------------------
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const raw = Math.min(1, Math.max(0, -rect.top / total));

      // A little headroom past the last chapter, so the final device drifts
      // out of frame instead of being sliced off by the sticky boundary.
      const progress = raw * (DEVICES.length - 1 + OUTRO);

      const stage = stageRef.current;
      if (!stage) return;

      stage.setProgress(progress);
      setActive(Math.min(DEVICES.length - 1, Math.round(progress)));
      setNearEnd(raw > 0.9);

      // Render only while the section is near the viewport. Driving this from
      // the measurement we already have is more dependable than a second
      // IntersectionObserver, which can batch an enter and an exit into one
      // callback and leave the loop stopped on a visible section.
      const margin = window.innerHeight * 0.4;
      if (rect.top < window.innerHeight + margin && rect.bottom > -margin) stage.start();
      else stage.stop();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // -- pointer --------------------------------------------------------------
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    stageRef.current?.setPointer(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      true
    );
  };

  const onPointerLeave = () => stageRef.current?.setPointer(0, 0, false);

  const jumpTo = (index: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const total = wrapper.offsetHeight - window.innerHeight;
    const y = wrapper.offsetTop + (index / (DEVICES.length - 1 + OUTRO)) * total;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      className="a-stage"
      id="work"
      ref={wrapperRef}
      style={{
        ["--stage-units" as string]: Math.round((DEVICES.length - 1 + OUTRO) * 130 + 100),
      }}
    >
      <div
        className="a-stage__sticky"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={() => stageRef.current?.click()}
      >
        <canvas className="a-stage__canvas" ref={canvasRef} />

        <div className="a-stage__head">
          {chapters.map((chapter, i) => (
            <div
              key={chapter.key}
              className={`a-stage__chapter ${active === i ? "is-active" : ""}`}
              aria-hidden={active !== i}
            >
              <div className="a-stage__eyebrow">
                <span className="a-label a-label--gold">{chapter.index}</span>
                <span className="a-stage__eyebrow-rule" />
                <span className="a-label">{copy.stage.kicker}</span>
              </div>
              <h2 className="a-stage__title">{chapter.title}</h2>
              <span className="a-label a-stage__sub">{chapter.subtitle}</span>
            </div>
          ))}
        </div>

        <div className={`a-stage__loader ${ready ? "is-done" : ""}`}>
          <span className="a-label">{copy.stage.loading}</span>
          <span className="a-stage__loader-bar">
            <i style={{ transform: `scaleX(${loaded})` }} />
          </span>
        </div>

        <div className={`a-stage__hint ${ready && chapters[active]?.hint ? "is-visible" : ""}`}>
          <span className="a-label a-label--gold">{chapters[active]?.hint ?? ""}</span>
        </div>

        {/* The section is pinned for several screens: without a cue on the
            edge, a reader who sees a still device reads the page as stuck. */}
        <div
          className={`a-stage__scroll ${ready && !nearEnd ? "is-visible" : ""}`}
          aria-hidden="true"
        >
          <span className="a-label a-stage__scroll-word">{copy.stage.scroll}</span>
          <span className="a-stage__scroll-rail">
            <i />
          </span>
        </div>

        <div className="a-stage__progress">
          {chapters.map((chapter, i) => (
            <button
              key={chapter.key}
              className={`a-stage__dash ${active === i ? "is-active" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                jumpTo(i);
              }}
              aria-label={chapter.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
