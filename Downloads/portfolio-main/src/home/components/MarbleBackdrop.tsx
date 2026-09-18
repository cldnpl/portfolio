import { publicAsset } from "@/lib/assets";

/**
 * Fixed marble plate behind the whole page.
 *
 * It does not move. The stone is the surface the page is laid on, so it stays
 * put while the content travels over it — and a fixed layer that never
 * transforms is also the one thing the compositor never has to touch during a
 * scroll.
 *
 * The darkening, softening and desaturation are baked into the JPEG rather
 * than applied with filter(): running a filter on a full-viewport layer cost a
 * complete re-rasterisation every frame.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")";

export default function MarbleBackdrop() {
  return (
    <div className="a-backdrop" aria-hidden="true">
      <div
        className="a-backdrop__plate"
        style={{
          ["--marble" as string]: `url(${publicAsset("backgrounds/black-marble.jpg")})`,
          ["--marble-sm" as string]: `url(${publicAsset("backgrounds/black-marble-sm.jpg")})`,
        }}
      />
      <div className="a-backdrop__bloom" />
      <div className="a-backdrop__vignette" />
      <div className="a-backdrop__grain" style={{ ["--grain" as string]: GRAIN }} />
    </div>
  );
}
