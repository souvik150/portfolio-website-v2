import { profile } from "@/lib/data";
import { Github, Linkedin, Mail } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-bid" />
          <span className="font-mono text-sm text-muted">
            {profile.name} · {profile.location}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:text-accent"
          >
            <Mail className="h-[18px] w-[18px]" />
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:text-accent"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:text-accent"
          >
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
        </div>

        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} · built with Next.js
        </p>
      </div>
    </footer>
  );
}
