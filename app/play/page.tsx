import type { Metadata } from "next";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import TradeGame from "@/components/play/TradeGame";

export const metadata: Metadata = {
  title: "Play — Market Game",
  description:
    "A free play-money market game: take leveraged long/short positions or predict the close on a simulated order flow, then check your P/L.",
};

export default function PlayPage() {
  return (
    <>
      <Background />
      <Cursor />

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <nav className="shell flex items-center justify-between rounded-xl border border-line bg-base/80 px-4 py-2.5 shadow-panel backdrop-blur-md">
          <a href="/" className="group flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-ink">
            <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back to site
          </a>
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-bid" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-bid shadow-glow-bid" />
            </span>
            <span className="font-mono text-sm font-medium tracking-tight text-ink">
              souvik<span className="text-faint">.play</span>
            </span>
          </span>
        </nav>
      </header>

      <main id="content" className="shell pb-24 pt-28 sm:pt-32">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-accent">// market game</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Can you read the tape?
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            A simulated instrument that never stops moving. Go long or short with leverage, or
            call exactly where the next candle closes. Every round settles live — then check your
            P/L. Pure play money, no sign-up.
          </p>
        </div>

        <TradeGame />
      </main>
    </>
  );
}
