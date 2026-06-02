"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/data";
import { ArrowUpRight, Check, Github, Linkedin, Mail, Phone, Spinner } from "./icons";

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in every field.");
      return;
    }

    // No backend configured → fall back to the user's mail client.
    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
      return;
    }

    try {
      setStatus("sending");
      setError("");
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Email me directly instead.");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-surface/20 py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left: invitation + direct links */}
        <div>
          <span className="font-mono text-sm text-accent">06 / contact</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s build something
            <br />
            that has to be fast.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Open to conversations about trading infrastructure, low-latency systems,
            and quant engineering. The fastest way to reach me is below.
          </p>

          <div className="mt-8 space-y-2">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-3 rounded-lg border border-line bg-surface/60 px-4 py-3 transition-colors hover:border-accent"
            >
              <Mail className="h-5 w-5 text-accent" />
              <span className="font-mono text-sm text-ink">{profile.email}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-faint transition-colors group-hover:text-accent" />
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-3 rounded-lg border border-line bg-surface/60 px-4 py-3 transition-colors hover:border-accent"
            >
              <Phone className="h-5 w-5 text-accent" />
              <span className="font-mono text-sm text-ink">{profile.phone}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-faint transition-colors group-hover:text-accent" />
            </a>
            <div className="flex gap-2 pt-1">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-surface/60 px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <Github className="h-[18px] w-[18px]" /> GitHub
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-surface/60 px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <Linkedin className="h-[18px] w-[18px]" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="panel p-6 sm:p-8">
          {status === "sent" ? (
            <div className="flex h-full min-h-[18rem] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-bid/40 bg-bid/10 text-bid">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink">Message sent</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">
                {ENDPOINT
                  ? "Thanks — your message is on its way. I'll get back to you shortly."
                  : "Your mail client should have opened. If it didn't, email me directly at " +
                    profile.email + "."}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 font-mono text-xs uppercase tracking-wider text-accent hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field label="Name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  className={inputCls}
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@firm.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What are you building?"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {status === "error" && (
                <p role="alert" className="text-sm text-ask">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-base transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Spinner className="h-4 w-4" /> Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              <p className="text-center font-mono text-[11px] text-faint">
                {ENDPOINT
                  ? "Delivered securely · no tracking"
                  : "Opens your mail client · no data stored"}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-base/60 px-4 py-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mono-label mb-2 block text-faint">
        {label}
      </label>
      {children}
    </div>
  );
}
