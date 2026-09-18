import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/language";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, homeCopy } from "../copy";
import { useReveal } from "../hooks/useReveal";
import SplitWords from "./SplitWords";

/**
 * Web3Forms relays the message to CONTACT_EMAIL without a backend of our own.
 * The key is public by design — it only authorises delivery to the one
 * address it was issued for — so it belongs in the client bundle. Without it
 * the form still works: it hands the reader a pre-filled mail draft instead of
 * silently pretending to have sent something.
 */
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "failed";

export default function Contact() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].contact;
  const [status, setStatus] = useState<Status>("idle");

  const head = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const form = useReveal<HTMLFormElement>({ threshold: 0.2 });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!ACCESS_KEY) {
      // No key configured: fall back to the reader's own mail client, with
      // everything they typed already in the draft.
      const subject = encodeURIComponent(`Portfolio — ${data.get("name") ?? ""}`);
      const body = encodeURIComponent(String(data.get("message") ?? ""));
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("sent");
      event.currentTarget.reset();
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
              <span className="a-label">Email</span>
              <a className="a-contact__link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <span className="a-label">LinkedIn</span>
              <a
                className="a-contact__link"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
              >
                claudia-napolitano
              </a>
            </li>
            <li>
              <span className="a-label">GitHub</span>
              <a className="a-contact__link" href={GITHUB_URL} target="_blank" rel="noreferrer">
                cldnpl
              </a>
            </li>
            <li>
              <span className="a-label">{copy.location}</span>
              <span className="a-contact__link a-contact__link--static">
                {copy.locationValue}
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
