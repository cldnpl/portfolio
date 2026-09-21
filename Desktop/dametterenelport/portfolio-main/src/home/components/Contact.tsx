import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/language";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, homeCopy } from "../copy";
import { useReveal } from "../hooks/useReveal";
import SplitWords from "./SplitWords";

/**
 * Web3Forms relays the message to CONTACT_EMAIL without a backend of our own.
 *
 * The key below is public by design — Web3Forms says so on the page that
 * issues it, and it authorises one thing only: delivery to the address it was
 * issued for. It cannot read anything back. So it belongs in the client
 * bundle, and committing it is the intended use, not a leak.
 *
 * To rotate it (say the address starts collecting spam), issue a new one at
 * https://web3forms.com and either replace it here or set
 * VITE_WEB3FORMS_KEY in Vercel → Settings → Environment Variables, which
 * wins over this value. Vite reads env vars at build time, so a change there
 * needs a redeploy to take effect.
 */
const PLACEHOLDER_KEY = "YOUR_ACCESS_KEY_HERE";
const FALLBACK_KEY = "31f5603a-2a63-4b0f-8664-0592d8171fd9";
const ACCESS_KEY = (
  (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || FALLBACK_KEY
).trim();
// Compared against the placeholder itself, not against the fallback: the
// fallback is now a real key, and testing ACCESS_KEY !== FALLBACK_KEY would
// have declared the form unconfigured exactly when it is configured.
const IS_CONFIGURED = ACCESS_KEY.length > 0 && ACCESS_KEY !== PLACEHOLDER_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Four marks drawn inline rather than pulled from an icon package: the whole
 * point of dropping `lucide-react` was to keep 1500 files out of the graph,
 * and these are the only icons on the page. One solid weight, one size, one
 * colour — at 14px a filled glyph reads as a mark, not as a button.
 */
const ICONS: Record<string, string> = {
  mail:
    "M3 5h18a1 1 0 0 1 1 1v.3l-9.49 5.6a1 1 0 0 1-1.02 0L2 6.3V6a1 1 0 0 1 1-1Z" +
    "M22 8.5V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.5l9.49 5.6a1 1 0 0 0 1.02 0L22 8.5Z",
  linkedin:
    "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z",
  github:
    "M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.01-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.41-1.31.75-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.36.81 1.1.81 2.22l-.01 3.29c0 .31.21.69.83.57A12 12 0 0 0 12 .3Z",
  pin:
    "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z",
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      className="a-contact__icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

export default function Contact() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].contact;
  const [status, setStatus] = useState<Status>("idle");

  const head = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const form = useReveal<HTMLFormElement>({ threshold: 0.2 });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Held onto here, not read later: React clears currentTarget as soon as
    // the handler yields, so reaching for it after the await hands back null —
    // and the reset would then throw on a message that had in fact been sent.
    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    if (!IS_CONFIGURED) {
      console.error("[contact] no Web3Forms key configured — see Contact.tsx");
      setStatus("failed");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio — ${data.get("name") ?? ""}`,
          from_name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      // Web3Forms answers 200 with { success: false } when it rejects a
      // submission, so the status code alone is not the answer.
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || result?.success === false) {
        throw new Error(`HTTP ${response.status} — ${JSON.stringify(result)}`);
      }

      setStatus("sent");
      // Only the successful path clears the fields: on a failure the reader
      // keeps every word they typed and can simply press send again.
      formEl.reset();
    } catch (error) {
      console.error("[contact] send failed", error);
      setStatus("failed");
    }
  };

  const footer = homeCopy[lang].footer;

  return (
    <>
      <section className="a-contact" id="contact">
      <div className="a-contact__head" ref={head.ref}>
        <span className={`a-label a-reveal ${head.className}`}>{copy.eyebrow}</span>
        <h2 className={`a-contact__title ${head.className}`} aria-label={copy.title}>
          <span aria-hidden="true">
            <SplitWords text={copy.title} stagger={48} delay={120} />
          </span>
        </h2>
      </div>

      <div className="a-contact__body">
        <div
          className={`a-contact__aside a-reveal ${head.className}`}
          style={{ ["--reveal-delay" as string]: "220ms" }}
        >
          <p className="a-body a-contact__intro">{copy.intro}</p>

          <ul className="a-contact__links">
            <li>
              <Icon name="mail" />
              <span className="a-contact__meta">
                <span className="a-label">Email</span>
                <a className="a-contact__link" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </span>
            </li>
            <li>
              <Icon name="linkedin" />
              <span className="a-contact__meta">
                <span className="a-label">LinkedIn</span>
                <a
                  className="a-contact__link"
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  claudia-napolitano
                </a>
              </span>
            </li>
            <li>
              <Icon name="github" />
              <span className="a-contact__meta">
                <span className="a-label">GitHub</span>
                <a className="a-contact__link" href={GITHUB_URL} target="_blank" rel="noreferrer">
                  cldnpl
                </a>
              </span>
            </li>
            <li>
              <Icon name="pin" />
              <span className="a-contact__meta">
                <span className="a-label">{copy.location}</span>
                <span className="a-contact__link a-contact__link--static">
                  {copy.locationValue}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <form
          className={`a-contact__form a-reveal ${form.className}`}
          style={{ ["--reveal-delay" as string]: "300ms" }}
          ref={form.ref}
          onSubmit={onSubmit}
        >
          <label className="a-field">
            <span className="a-label">{copy.name}</span>
            <input
              className="a-field__input"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={copy.namePlaceholder}
            />
          </label>

          <label className="a-field">
            <span className="a-label">{copy.email}</span>
            <input
              className="a-field__input"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
            />
          </label>

          <label className="a-field">
            <span className="a-label">{copy.message}</span>
            <textarea
              className="a-field__input a-field__input--area"
              name="message"
              rows={5}
              required
              placeholder={copy.messagePlaceholder}
            />
          </label>

          <button className="a-submit" type="submit" disabled={status === "sending"}>
            <span>{status === "sending" ? copy.sending : copy.send}</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="a-contact__status" role="status" aria-live="polite">
            {status === "sent" ? copy.sent : null}
            {status === "failed" ? (
              <>
                {copy.failed}{" "}
                <a className="a-contact__link" href={`mailto:${CONTACT_EMAIL}`}>
                  {copy.fallback}
                </a>
              </>
            ) : null}
          </p>
        </form>
      </div>
      </section>

      <footer className="a-footer">
        <span className="a-label">{footer.left}</span>
        <a className="a-label" href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="a-label">{footer.right}</span>
      </footer>
    </>
  );
}
