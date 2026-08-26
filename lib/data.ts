export interface ProjectData {
  slug: string
  title: string
  subtitle: string
  role: string
  timeline: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  stars?: number
  forks?: number
  architecture?: string[]
  coreProblem?: string
  highlights?: string[]
  codeSnippet?: {
    filename: string
    code: string
  }
}

export interface DevelopmentData {
  slug: string
  title: string
  subtitle: string
  category: string
  whyIUseIt: string
  content?: string
  link?: string
  description?: string
  tags: string[]
  specs: { label: string; value: string }[]
  configSnippet?: {
    filename: string
    code: string
  }
  links?: { label: string; url: string }[]
}

export interface GearItem {
  id?: string
  title: string
  link: string
  subtitle?: string
  category?: string
  order?: number
}

export interface DevToolItem {
  id?: string
  title: string
  subtitle: string
  category: string
  link: string
  tags: string[]
  specs?: { label: string; value: string }[]
  description?: string
  configSnippet?: {
    filename: string
    code: string
  }
}

export const PROJECTS_DATA: ProjectData[] = [
  {
    slug: 'devpulse-ai',
    title: 'DevPulse AI',
    subtitle: 'Autonomous Code Review & PR Assistant',
    role: 'Lead Engineer',
    timeline: '2024',
    description:
      'AI-powered GitHub bot that analyzes pull requests for security vulnerabilities, architectural anti-patterns, and performance bottlenecks in real-time.',
    tags: ['TypeScript', 'Next.js', 'OpenAI API', 'GitHub API', 'Tailwind CSS'],
    stars: 342,
    forks: 48,
    githubUrl: 'https://github.com',
    liveUrl: 'https://devpulse.ai',
    coreProblem:
      'Automating repetitive pull-request reviews without losing deep semantic awareness of multi-file changes and test coverage.',
    architecture: [
      'GitHub Webhook ingestion layer with edge runtime signature verification',
      'AST parsing and multi-file diff segmentation engine',
      'Vector embeddings context-window caching with Redis',
      'Structured JSON output validation with Zod schemas',
    ],
    highlights: [
      'Reduced average PR review turn-around time by 72%',
      'Integrated into 50+ open source repositories',
      'Sub-2s automated latency response with streaming commentary',
    ],
    codeSnippet: {
      filename: 'reviewEngine.ts',
      code: `export async function analyzePullRequestDiff(diff: string, context: RepoContext) {
  const chunks = parseDiffChunks(diff);
  const embeddings = await generateDiffEmbeddings(chunks);
  const analysis = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: REVIEW_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify({ diff, context }) }
    ]
  });
  return validateReviewResponse(analysis);
}`,
    },
  },
  {
    slug: 'kubelens-edge',
    title: 'KubeLens Edge',
    subtitle: 'Real-time Kubernetes Observability HUD',
    role: 'Systems Architect',
    timeline: '2024',
    description:
      'Lightweight web-based Kubernetes cluster telemetry visualizer with zero-config eBPF network packet tracing and CPU bottleneck heatmaps.',
    tags: ['Go', 'Rust', 'React', 'eBPF', 'WebSockets', 'Prometheus'],
    stars: 890,
    forks: 112,
    githubUrl: 'https://github.com',
    liveUrl: 'https://kubelens.dev',
    coreProblem:
      'Standard Kubernetes dashboards are bloated and resource-intensive on edge clusters; KubeLens provides sub-10MB memory footprint.',
    architecture: [
      'Rust eBPF probes running in Linux kernel space',
      'Go WebSocket aggregator streaming metrics at 60fps',
      'React canvas-accelerated heatmaps and cluster DAG visualization',
    ],
    highlights: [
      'Sub-10MB runtime memory footprint',
      'Zero overhead kernel packet tracing',
      'Instant cluster anomaly alerts',
    ],
    codeSnippet: {
      filename: 'clusterProbe.rs',
      code: `#[kprobe]
pub fn trace_socket_connect(ctx: ProbeContext) -> u32 {
    let pid = ctx.pid();
    let sock = ctx.sock();
    if let Ok(event) = parse_tcp_flow(sock) {
        EVENTS.output(&ctx, &event, 0);
    }
    0
}`,
    },
  },
  {
    slug: 'hypersync-db',
    title: 'HyperSync DB',
    subtitle: 'Distributed Conflict-Free Replicated Data Store',
    role: 'Core Maintainer',
    timeline: '2023 - 2024',
    description:
      'Local-first CRDT-backed real-time document synchronization engine designed for collaborative canvas apps and offline-first clients.',
    tags: ['TypeScript', 'CRDTs', 'WebRTC', 'IndexedDB', 'Node.js'],
    stars: 620,
    forks: 74,
    githubUrl: 'https://github.com',
    liveUrl: 'https://hypersync.dev',
    coreProblem:
      'Resolving multi-device collaborative state conflicts gracefully without central server bottlenecks or network partition lockups.',
    architecture: [
      'State-based Yjs CRDT differential sync protocol',
      'P2P WebRTC data mesh with fallback WebSocket relays',
      'Client-side IndexedDB persistence with AES-256 encryption',
    ],
    highlights: [
      'Zero-downtime offline edits with instant convergence',
      'Peer-to-peer latency under 15ms in LAN environments',
      'Cross-platform TypeScript SDK',
    ],
    codeSnippet: {
      filename: 'crdtSync.ts',
      code: `export class HyperDoc<T extends Record<string, any>> {
  private doc: Y.Doc = new Y.Doc();
  private provider: WebrtcProvider;

  constructor(room: string) {
    this.provider = new WebrtcProvider(room, this.doc);
    this.doc.on('update', (update) => this.persistToLocalDB(update));
  }

  mutate(fn: (draft: T) => void): void {
    this.doc.transact(() => fn(this.doc.getMap('state') as any));
  }
}`,
    },
  },
  {
    slug: 'omnisearch-cli',
    title: 'OmniSearch CLI',
    subtitle: 'Blazing Fast Local File & Code Indexer',
    role: 'Author',
    timeline: '2023',
    description:
      'High-performance fuzzy search engine and grep alternative built in Rust with multi-threaded file walking, SIMD string matching, and interactive TUI.',
    tags: ['Rust', 'SIMD', 'Ratatui', 'CLI', 'Cross-Platform'],
    stars: 1200,
    forks: 95,
    githubUrl: 'https://github.com',
    liveUrl: 'https://crates.io',
    coreProblem:
      'Instant search across massive 500k+ file monorepos without noticeable UI indexing lags.',
    architecture: [
      'Work-stealing threadpool with crossbeam-channel',
      'AVX-512 / NEON vector accelerated fuzzy matcher',
      'Zero-alloc terminal renderer via ratatui',
    ],
    highlights: [
      'Searches 1M+ LOC in under 45ms',
      'Interactive vim-keybindings modal navigator',
      'Downloaded 80k+ times on crates.io',
    ],
    codeSnippet: {
      filename: 'matcher.rs',
      code: `pub fn search_parallel(pattern: &str, paths: &[PathBuf]) -> Vec<MatchResult> {
    paths.par_iter()
        .filter_map(|path| {
            let mmap = unsafe { Mmap::map(&File::open(path).ok()?).ok()? };
            simd_fuzzy_match(pattern, &mmap).map(|score| MatchResult { path: path.clone(), score })
        })
        .collect()
}`,
    },
  },
]

export const DEVELOPMENT_DATA: DevelopmentData[] = []
export const GEARS_ITEMS: GearItem[] = []
export const DEV_SETUP_ITEMS: DevToolItem[] = []

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS_DATA.find((p) => p.slug === slug)
}

export function getDevelopmentBySlug(slug: string): DevelopmentData | undefined {
  return DEVELOPMENT_DATA.find((d) => d.slug === slug)
}
