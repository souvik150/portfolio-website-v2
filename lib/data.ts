// Single source of truth for site content. Sourced from Souvik's June 2026 resume.

export const profile = {
  name: "Souvik Mukherjee",
  role: "Quant & Low-Latency Systems Engineer",
  title: "Analyst Software Engineer",
  company: "Zanskar Research",
  companyUrl: "https://www.linkedin.com/company/zanskar-research/",
  location: "Bangalore, India",
  tagline:
    "I build the order management systems behind live Indian markets — order lifecycle, execution algos, and real-time risk, engineered for low latency.",
  summary:
    "Analyst at Zanskar Research, where I lead development of Sentinel OMS — the firm's order management system. My work spans the full order lifecycle: state-machine-driven order flows, parent–child workflows, execution algorithms, real-time risk (RMS) validation, and mark-to-market accounting for low-latency trading. SEBI NISM-certified in Equity, Common, and Commodity Derivatives.",
  email: "souvikmukherjee150@gmail.com",
  phone: "+91 7330787625",
  resume: "/Souvik_Mukherjee_Resume.pdf",
  socials: {
    github: "https://github.com/souvik150",
    linkedin: "https://linkedin.com/in/souvik150",
  },
  stackline: ["Go", "C++20", "Low-Latency", "Lock-free", "gRPC", "Trading Systems"],
};

export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
};

export const metrics: Metric[] = [
  { value: 6, suffix: "+", label: "Execution algos", sub: "bracket · OCO · trailing · iceberg" },
  { value: 10, suffix: "×", label: "Latency reduction", sub: "1000 ns → 100 ns per order" },
  { value: 15, suffix: "+", label: "Pre-trade checks", sub: "pluggable RMS compliance chain" },
  { value: 5, label: "Industry credentials", sub: "3× NISM · AWS SA · IEEE" },
];

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Analyst Software Engineer",
    company: "Zanskar Research",
    location: "Bangalore, India",
    period: "May 2025 — Present",
    current: true,
    points: [
      "Led end-to-end design and development of Sentinel OMS v2 in Go for a live securities brokerage — defined architecture, owned technical decisions, and mentored 2 interns on order-lifecycle internals.",
      "Architected a two-layer OMS separating user-facing parent orders from exchange-facing child orders; owned the lifecycle from gRPC ingestion through COLO bidirectional streaming, async NATS JetStream persistence, and real-time in-memory portfolio updates.",
      "Built the OMS-side algo engine: bracket orders, OCO multi-exit monitoring, trailing stops with live LTP ratcheting, conditional entries, lot-size-aware iceberg (LCM) slicing, AMO/GTD scheduling, and freeze-chunk splitting for exchange quantity limits.",
      "Designed a dual request-ID / response-ID replay protocol between OMS and COLO — on restart each side independently replays from its last-seen ID, guaranteeing exactly-once delivery and zero missed responses across pod restarts.",
      "Built a pre-trade compliance chain of 15+ pluggable checks (margin, MTM, banned/RBI-restricted, gross qty/turnover, EDIS, rate limiting) over deep-cloned portfolio snapshots; instrumented µs-precision Prometheus latency tracking and crash recovery.",
    ],
  },
  {
    role: "Backend Intern",
    company: "Zanskar Research",
    location: "Bangalore, India",
    period: "Dec 2024 — May 2025",
    points: [
      "Key contributor on the OMS team; developed limit, market, IOC, and iceberg order types with full lifecycle handling (new, modify, cancel) and exchange response integration.",
      "Lead developer of the RMS (Risk Management System) module — enforced bans, restrictions, and MTM checks for robust risk controls.",
      "Automated SPAN, VAR, and Refdata uploads to AWS S3 using Apache Airflow with calendar-aware scheduling based on NSE/BSE holidays.",
    ],
  },
];

export const education = {
  school: "Vellore Institute of Technology",
  degree: "B.Tech, Computer Science & Engineering",
  period: "2021 — 2025",
  detail: "CGPA 8.9 / 10 · Tamil Nadu, India",
};

export type Project = {
  name: string;
  kind: string;
  blurb: string;
  highlights: string[];
  tags: string[];
  href?: string;
  proprietary?: boolean;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Sentinel OMS v2",
    kind: "Production · Zanskar Research",
    blurb:
      "A two-layer order management system in Go powering a live securities brokerage across Indian markets.",
    highlights: [
      "gRPC ingestion → COLO bidirectional streaming",
      "Async NATS JetStream persistence + in-memory portfolio",
      "Algo engine: bracket / OCO / trailing / iceberg / AMO-GTD",
      "Exactly-once replay protocol on pod restart",
    ],
    tags: ["Go", "gRPC", "NATS JetStream", "Prometheus", "State Machines"],
    proprietary: true,
    featured: true,
  },
  {
    name: "Order Matching Engine",
    kind: "C++20 · Low-Latency",
    blurb:
      "An exchange-grade matching engine that pairs orders and streams tick-by-tick market data in microseconds.",
    highlights: [
      "Custom index-based Red-Black Tree, strict price–time priority",
      "Branchless inlined fast-paths — no vtable stalls in <100 ns loops",
      "Multicast UDP order flow + epoll non-blocking ingestion",
      "Optimized ~1000 ns → ~100 ns per order",
    ],
    tags: ["C++20", "RB-Tree", "Multicast UDP", "epoll", "Lock-free"],
    href: "https://github.com/souvik150/SimEx",
    featured: true,
  },
  {
    name: "AI Trade Journaling",
    kind: "Codeathon — 1st Prize (₹1L)",
    blurb:
      "Hybrid deterministic + agentic system pairing FIFO-matched execution legs with OHLCV context for explainable per-trade insight.",
    highlights: [
      "CrewAI multi-agent reasoning, Pydantic-validated",
      "FIFO leg matching + session-level analytics",
      "MongoDB-cached, explainable trade narratives",
      "Awarded by the CEO, company-wide",
    ],
    tags: ["CrewAI", "Python", "MongoDB", "Pydantic"],
    href: "https://github.com/souvik150/trade_journal",
    featured: true,
  },
  {
    name: "NetProbe",
    kind: "C++ · Networking",
    blurb:
      "A low-latency TCP/UDP socket abstraction layer with non-blocking I/O and multicast membership control.",
    highlights: [
      "epoll event loop, connection pooling, adaptive batching",
      "TCP_NODELAY, SO_REUSEPORT, recvmsg/sendmsg tuning",
      "Unicast + broadcast transport, optional timestamping",
    ],
    tags: ["C++", "epoll", "TCP/UDP", "Multicast"],
    href: "https://github.com/souvik150/NetProbe",
  },
  {
    name: "CoreBlur",
    kind: "C++ · Parallel Compute",
    blurb:
      "A high-performance Gaussian blur engine using IPC and shared memory for zero-copy multi-process image processing.",
    highlights: [
      "Tile-based memory layout for cache efficiency",
      "Core pinning across P/E cores for predictable latency",
      "Modular I/O · tiling · IPC · kernel separation",
    ],
    tags: ["C++", "IPC", "SHM", "Core Pinning"],
    href: "https://github.com/souvik150/CoreBlur",
  },
  {
    name: "MiniGit",
    kind: "C++ · Systems",
    blurb:
      "A Git-like version control system in modern C++ with init, commit, branch, and merge.",
    highlights: [
      "Command / Factory / Strategy / Singleton patterns",
      "Hash-based content snapshots + custom serialization",
      "Multi-threaded commit indexing with in-memory caching",
    ],
    tags: ["C++", "STL", "Concurrency", "Design Patterns"],
    href: "https://github.com/souvik150/MiniGit",
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["Go", "C++20", "Python", "SQL"] },
  {
    label: "Low-Latency Systems",
    items: ["epoll", "Lock-free SPSC", "NUMA pinning", "Multicast UDP", "SHM / IPC", "Cache-line alignment", "Branchless hot paths"],
  },
  {
    label: "Trading Infrastructure",
    items: ["gRPC", "NATS JetStream", "Prometheus", "COLO streaming", "State machines", "RMS / pre-trade risk"],
  },
  {
    label: "Markets & Domain",
    items: ["Equity derivatives", "Commodity derivatives", "Currency & rates", "Order lifecycle", "MTM accounting"],
  },
  {
    label: "Cloud & Data",
    items: ["AWS (S3, multi-AZ)", "Apache Airflow", "MongoDB", "Docker"],
  },
  {
    label: "AI / Agents",
    items: ["CrewAI", "RAG", "Pydantic", "Graph databases"],
  },
];

export type Credential = { title: string; detail: string; tag: string; href?: string };

export const credentials: Credential[] = [
  { title: "NISM Series-VIII", detail: "Equity Derivatives Certification", tag: "SEBI" },
  {
    title: "NISM Series-XIII",
    detail: "Common Derivatives — Equity, Currency & Interest-Rate",
    tag: "SEBI",
    href: "https://drive.google.com/file/d/1WvLaGxnGbrSths494eIPr7RRJLM3aFVq/view",
  },
  {
    title: "NISM Series-XVI",
    detail: "Commodity Derivatives Certification",
    tag: "SEBI",
    href: "https://drive.google.com/file/d/1zmK-xMq0FW5lpC9WZsgdpAvrX8AYUXzb/view?usp=sharing",
  },
  {
    title: "AWS Solutions Architect",
    detail: "Multi-AZ, disaster-resilient cloud architectures",
    tag: "AWS",
    href: "https://www.credly.com/badges/c08ad308-478c-45d7-b195-32fda4381713/linked_in_profile",
  },
  {
    title: "IEEE Xplore Publication",
    detail: "RAG systems using AI models & graph databases",
    tag: "Research",
    href: "https://ieeexplore.ieee.org/document/10988015",
  },
  {
    title: "Codeathon — 1st Prize",
    detail: "₹1L, awarded by the CEO, company-wide",
    tag: "Award",
    href: "https://www.linkedin.com/posts/souvik150_crewai-aiagents-algotrading-share-7464726309286608896-enC8/",
  },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#systems", label: "Systems" },
  { href: "#contact", label: "Contact" },
];
