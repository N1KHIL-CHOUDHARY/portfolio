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
  tags: string[]
  specs: { label: string; value: string }[]
  configSnippet?: {
    filename: string
    code: string
  }
  links?: { label: string; url: string }[]
}

export const PROJECTS_DATA: ProjectData[] = [
  {
    slug: 'universal-app-opener',
    title: 'Universal App Opener',
    subtitle: 'Cross-platform URL routing engine for mobile deep linking',
    role: 'Creator & Lead Architect',
    timeline: 'Nov 2025 – Present',
    description: 'Converts web URLs into deep links for 40+ mobile apps across iOS and Android with automatic fallback routing.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Mobile DeepLinks'],
    githubUrl: 'https://github.com/mdsaban/universal-app-opener',
    liveUrl: 'https://universalappopener.com',
    stars: 256,
    forks: 42,
    architecture: [
      'Client-side Intent Router executing custom scheme detection with latency fallback timers.',
      'Edge Middleware evaluating User-Agent headers to rewrite web links into deep universal links.',
      'Headless analytics pipeline recording link conversion rates without user tracking cookies.'
    ],
    coreProblem: 'Standard web links open mobile websites inside in-app webviews instead of native applications, resulting in poor user conversion and fragmented authentication states.',
    highlights: [
      'Zero-dependency intent detection scheme supporting 40+ native applications.',
      'Sub-50ms fallback redirects when target native app is not installed on client device.',
      'Integrated open-graph parser generating dynamic preview cards for social link sharing.'
    ],
    codeSnippet: {
      filename: 'deepLinkRouter.ts',
      code: `export function resolveDeepLink(url: string, platform: 'ios' | 'android'): string {
  const scheme = SCHEME_MAP[getAppDomain(url)];
  if (!scheme) return url;
  
  if (platform === 'ios') {
    return \`\${scheme.ios}://open?url=\${encodeURIComponent(url)}\`;
  }
  return \`intent://open?url=\${encodeURIComponent(url)}#Intent;scheme=\${scheme.android};package=\${scheme.package};end\`;
}`
    }
  },
  {
    slug: 'cursor-code-indexer',
    title: 'Cursor Code Indexer',
    subtitle: 'AST vector search indexer built for LLM context retrieval',
    role: 'Core Maintainer',
    timeline: 'Sep 2025 – Dec 2025',
    description: 'High-performance vector search indexer designed to index repository AST structures for AI pair programmers.',
    tags: ['TypeScript', 'Node.js', 'Tree-Sitter', 'Vector Index'],
    githubUrl: 'https://github.com',
    stars: 184,
    forks: 21,
    architecture: [
      'Tree-sitter parser generating semantic AST syntax blocks across TypeScript, Go, and Python.',
      'In-memory HNSW vector index performing cosine similarity matching over function embeddings.',
      'Incremental file watcher updating vector index only when file SHA-256 hashes change.'
    ],
    coreProblem: 'Large codebases exceed LLM context windows, requiring intelligent, semantic retrieval of relevant functions and interfaces instead of naive text grep search.',
    highlights: [
      'Parses over 50,000 lines of source code in under 1.2 seconds.',
      'Supports hybrid search combining BM25 keyword matching with dense vector embeddings.',
      'Low RAM footprint consuming less than 120MB heap memory during continuous repository indexing.'
    ],
    codeSnippet: {
      filename: 'astIndexer.ts',
      code: `export async function indexFileAST(filepath: string, content: string) {
  const tree = parser.parse(content);
  const symbols = extractSymbolNodes(tree.rootNode);
  const embeddings = await generateBatchEmbeddings(symbols.map(s => s.text));
  return vectorStore.upsert(symbols.map((sym, i) => ({
    id: \`\${filepath}#\${sym.name}\`,
    vector: embeddings[i],
    metadata: { filepath, line: sym.startLine }
  })));
}`
    }
  },
  {
    slug: 'devpulse-telemetry-dashboard',
    title: 'DevPulse Telemetry Dashboard',
    subtitle: 'Ultra-fast monochrome metric monitor for distributed microservices',
    role: 'Full Stack Engineer',
    timeline: 'Jul 2025 – Sep 2025',
    description: 'Ultra-fast monochrome metrics dashboard monitoring API latencies, worker threads, and memory heap usages.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://devpulse.io',
    stars: 94,
    forks: 12,
    architecture: [
      'WebSocket event stream streaming system telemetry at 60 FPS directly to Canvas graphics layers.',
      'Redis TimeSeries database storing sliding 24-hour metric aggregations.',
      'Lightweight React component tree with virtualized rows for high-density log rendering.'
    ],
    coreProblem: 'Traditional telemetry dashboards suffer from bloated UI rendering and heavy asset loads, degrading performance when monitoring high-throughput microservices.',
    highlights: [
      'Sub-10ms UI render latency with custom Canvas-based sparkline visualizations.',
      'Monochrome, high-contrast dark theme optimized for multi-monitor developer setups.',
      'Configurable alert triggers notifying Slack and PagerDuty endpoints.'
    ],
    codeSnippet: {
      filename: 'telemetryStream.ts',
      code: `const ws = new WebSocket(TELEMETRY_ENDPOINT);
ws.onmessage = (event) => {
  const metricBatch = JSON.parse(event.data);
  batchUpdateCanvas(metricBatch);
  updateMemoryHeapGauge(metricBatch.heapUsed);
};`
    }
  },
  {
    slug: 'fastcache-redis-client',
    title: 'FastCache Redis Client',
    subtitle: 'Zero-allocation in-memory caching layer with multi-region cluster failover',
    role: 'Backend Architect',
    timeline: 'May 2025 – Jun 2025',
    description: 'Zero-allocation in-memory caching layer with multi-region cluster failover and automatic retry policies.',
    tags: ['Go', 'Redis', 'Docker', 'gRPC'],
    githubUrl: 'https://github.com',
    stars: 120,
    forks: 18,
    architecture: [
      'Lock-free ring buffer managing asynchronous cache writes and eviction policies.',
      'RESP3 protocol parser compiled natively without interface allocations.',
      'Automated health check probes managing regional read-replica failover.'
    ],
    coreProblem: 'Standard Redis drivers produce high GC pressure in high-concurrency Go services during spike traffic loads.',
    highlights: [
      'Zero GC memory allocations under 100,000 requests per second workload.',
      'Built-in circuit breaker preventing cache stampede on expired key requests.',
      'Comprehensive Prometheus exporter for cache hit/miss ratio tracking.'
    ],
    codeSnippet: {
      filename: 'client.go',
      code: `func (c *Client) Get(ctx context.Context, key string) ([]byte, error) {
	if val, ok := c.localRing.Get(key); ok {
		return val, nil
	}
	return c.redisPool.Do(ctx, "GET", key)
}`
    }
  }
]

export const DEVELOPMENT_DATA: DevelopmentData[] = [
  {
    slug: 'gears',
    title: 'Gears & Hardware',
    subtitle: 'Physical setup and workstation hardware',
    category: 'Workstation Hardware',
    whyIUseIt: 'Designed for high-throughput software development, silent operation, and ergonomic typing over long coding sessions.',
    tags: ['MacBook Pro', 'Keychron', 'MX Master 3S', 'Dell UltraSharp'],
    specs: [
      { label: 'Primary Computer', value: 'MacBook Pro 16" M3 Max (36GB RAM, 1TB NVMe)' },
      { label: 'Display', value: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)' },
      { label: 'Keyboard', value: 'Keychron K2 Wireless Mechanical (Gateron Brown Switches)' },
      { label: 'Mouse', value: 'Logitech MX Master 3S Performance Wireless' },
      { label: 'Audio', value: 'Sony WH-1000XM5 Noise Canceling Headphones' }
    ],
    configSnippet: {
      filename: 'hardware-profile.json',
      code: `{
  "workstation": "MacBook Pro M3 Max",
  "memory": "36GB Unified",
  "peripherals": {
    "display": "Dell UltraSharp 27 4K",
    "audio": "Sony WH-1000XM5",
    "input": ["Keychron K2", "Logitech MX Master 3S"]
  }
}`
    },
    links: [
      { label: 'Keychron K2 Specs', url: 'https://keychron.com' },
      { label: 'Dell U2723QE Monitor', url: 'https://dell.com' }
    ]
  },
  {
    slug: 'setup',
    title: 'Development Setup',
    subtitle: 'IDE configuration, terminal environment, and editor themes',
    category: 'Editor & Terminal Config',
    whyIUseIt: 'Optimized for minimal visual distraction, rapid keyboard navigation, and seamless AI pair programming.',
    tags: ['Cursor AI', 'VS Code', 'Geist Mono', 'JetBrains Mono', 'Zsh'],
    specs: [
      { label: 'Primary IDE', value: 'Cursor AI / VS Code (Dark+ Theme)' },
      { label: 'Code Editor Font', value: 'Geist Mono & JetBrains Mono (Ligatures Enabled)' },
      { label: 'Terminal Emulator', value: 'Ghostty & Warp Terminal' },
      { label: 'Shell Configuration', value: 'Zsh with Starship Prompt & Fast Syntax Highlighting' },
      { label: 'Keybinding Preset', value: 'Custom Vim Keybindings with Leader Mapping' }
    ],
    configSnippet: {
      filename: 'settings.json',
      code: `{
  "editor.fontFamily": "Geist Mono, JetBrains Mono, monospace",
  "editor.fontSize": 13.5,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": true,
  "editor.minimap.enabled": false,
  "editor.cursorBlinking": "smooth",
  "workbench.colorTheme": "Dark+",
  "workbench.sideBar.location": "left"
}`
    },
    links: [
      { label: 'Cursor AI Editor', url: 'https://cursor.com' },
      { label: 'Geist Font Family', url: 'https://vercel.com/font' }
    ]
  },
  {
    slug: 'tech-stack',
    title: 'Tech Stack',
    subtitle: 'Core daily frameworks, languages, and runtime tools',
    category: 'Software Architecture',
    whyIUseIt: 'Selected for maximum type safety, high developer velocity, ultra-fast server response times, and production reliability.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Redis', 'PostgreSQL', 'Go'],
    specs: [
      { label: 'Frontend Frameworks', value: 'Next.js 16 (App Router), React 18, Tailwind CSS v3' },
      { label: 'Languages', value: 'TypeScript, JavaScript (ESNext), Go, SQL' },
      { label: 'State & Motion', value: 'Framer Motion, Zustand, React Query' },
      { label: 'Databases & Cache', value: 'PostgreSQL, Supabase, Redis, Prisma ORM' },
      { label: 'DevOps & Tooling', value: 'Vercel, Docker, Git, GitHub Actions, pnpm' }
    ],
    configSnippet: {
      filename: 'package.json',
      code: `{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.350.0"
  }
}`
    },
    links: [
      { label: 'Next.js Documentation', url: 'https://nextjs.org' },
      { label: 'TypeScript Specs', url: 'https://typescriptlang.org' }
    ]
  }
]

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS_DATA.find((p) => p.slug === slug)
}

export function getDevelopmentBySlug(slug: string): DevelopmentData | undefined {
  return DEVELOPMENT_DATA.find((d) => d.slug === slug)
}
