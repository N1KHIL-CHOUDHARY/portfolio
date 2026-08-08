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

export interface GearItem {
  id?: string
  title: string
  subtitle: string
  category: string
  link: string
  tags: string[]
  specs?: { label: string; value: string }[]
  description?: string
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

export const GEARS_ITEMS: GearItem[] = [
  {
    title: 'MacBook Pro 16" M3 Max',
    subtitle: 'Workstation & Primary Laptop',
    category: 'Computer',
    link: 'https://www.apple.com/macbook-pro/',
    tags: ['Apple Silicon', '36GB RAM', '1TB NVMe', '120Hz Liquid Retina XDR'],
    specs: [
      { label: 'Processor', value: 'Apple M3 Max (14-Core CPU, 30-Core GPU)' },
      { label: 'Unified Memory', value: '36GB Unified Architecture' },
      { label: 'Storage', value: '1TB PCIe Gen 4 NVMe Solid State Drive' },
      { label: 'Display Panel', value: '16.2-inch Liquid Retina XDR (3456 x 2234, 1600 nits)' }
    ],
    description: 'Blazing fast compilation times, zero thermal throttling, and multi-day battery life for heavy full-stack development.'
  },
  {
    title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    subtitle: '4K IPS Black Primary Display',
    category: 'Monitor',
    link: 'https://www.dell.com/en-us/shop/dell-ultrasharp-27-4k-usb-c-hub-monitor-u2723qe/apd/210-bdpf/monitors-monitor-accessories',
    tags: ['4K UHD', 'IPS Black', '90W USB-C', '98% DCI-P3'],
    specs: [
      { label: 'Resolution', value: '3840 x 2160 at 60 Hz UHD' },
      { label: 'Contrast Ratio', value: '2000:1 Deep Contrast (IPS Black)' },
      { label: 'Color Accuracy', value: '100% sRGB, 98% DCI-P3' },
      { label: 'Connectivity', value: 'USB-C (90W PD), DisplayPort 1.4, HDMI 2.0, RJ45 LAN' }
    ],
    description: 'Crisp font rendering, true deep blacks, and integrated KVM hub that connects all desk peripherals over a single wire.'
  },
  {
    title: 'Keychron K2 Wireless Mechanical Keyboard',
    subtitle: '75% Compact Wireless Keyboard',
    category: 'Keyboard',
    link: 'https://www.keychron.com/products/keychron-k2-wireless-mechanical-keyboard',
    tags: ['Gateron Brown', 'Wireless Bluetooth', 'Type-C', 'Mac Layout'],
    specs: [
      { label: 'Switches', value: 'Gateron G Pro Brown (Tactile 55g)' },
      { label: 'Layout', value: '75% (84 keys) ANSI with dedicated Mac keys' },
      { label: 'Keycaps', value: 'Double-shot PBT OEM Profile' },
      { label: 'Battery Capacity', value: '4000mAh rechargeable Li-polymer' }
    ],
    description: 'Satisfying tactile feedback for long typing and coding sessions with native Mac function key mapping.'
  },
  {
    title: 'Logitech MX Master 3S Wireless Mouse',
    subtitle: 'Ergonomic Precision Mouse',
    category: 'Mouse',
    link: 'https://www.logitech.com/en-us/products/mice/mx-master-3s.html',
    tags: ['8000 DPI', 'MagSpeed Scroll', 'Quiet Click', 'USB-C Fast Charge'],
    specs: [
      { label: 'Sensor Technology', value: 'Darkfield High Precision (200 - 8000 DPI)' },
      { label: 'Scroll Mechanism', value: 'MagSpeed SmartShift Auto-Switching' },
      { label: 'Battery Life', value: '500mAh (Up to 70 days on a single charge)' },
      { label: 'Connectivity', value: 'Bluetooth Low Energy & Logi Bolt USB' }
    ],
    description: 'Unmatched ergonomic thumb support, horizontal scroll wheel for code timelines, and whisper-quiet click switches.'
  },
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    subtitle: 'Active Noise Canceling Headphones',
    category: 'Audio',
    link: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
    tags: ['Active ANC', '30hr Battery', 'LDAC Hi-Res', 'Multipoint Bluetooth'],
    specs: [
      { label: 'Noise Canceling', value: 'Dual Processor (V1 + HD QN1) with 8 Microphones' },
      { label: 'Driver Unit', value: '30mm precision carbon fiber composite dome' },
      { label: 'Frequency Response', value: '4 Hz - 40,000 Hz Hi-Res Audio' },
      { label: 'Battery Life', value: 'Up to 30 hours continuous playback with ANC' }
    ],
    description: 'Blocks ambient background noise completely to preserve deep focus and flow state during demanding engineering challenges.'
  },
  {
    title: 'CalDigit TS4 Thunderbolt 4 Dock',
    subtitle: '18-Port Workstation Hub',
    category: 'Dock',
    link: 'https://www.caldigit.com/thunderbolt-station-4/',
    tags: ['Thunderbolt 4', '98W PD', '2.5GbE Ethernet', '18 Ports'],
    specs: [
      { label: 'Thunderbolt Ports', value: '3x Thunderbolt 4 (40Gb/s high-speed)' },
      { label: 'USB Ports', value: '5x USB-A (10Gb/s), 3x USB-C (10Gb/s)' },
      { label: 'Network Adapter', value: '2.5 Gigabit Ethernet (RJ45)' },
      { label: 'Card Reader', value: 'UHS-II SD 4.0 & microSD 4.0 high-speed' }
    ],
    description: 'Central workstation hub that drives dual monitors, audio interfaces, and high-speed NVMe drives effortlessly.'
  },
  {
    title: 'BenQ ScreenBar Halo Monitor Light Bar',
    subtitle: 'Desk Lighting & Eye Protection',
    category: 'Lighting',
    link: 'https://www.benq.com/en-us/lighting/monitor-light/screenbar-halo.html',
    tags: ['Zero Glare', 'Wireless Dial', 'Auto-Dimming', 'Backlight Ambient'],
    specs: [
      { label: 'Illuminance', value: 'Center 800 Lux (height 45cm)' },
      { label: 'Color Temperature', value: '2700K - 6500K Adjustable' },
      { label: 'Color Rendering', value: 'Ra >= 95 Natural Spectrum' },
      { label: 'Controller', value: '2.4GHz Wireless Precision Rotary Dial' }
    ],
    description: 'Eliminates screen glare and eye fatigue during late-night coding sessions without cluttering desk surface.'
  },
  {
    title: 'Herman Miller Aeron Ergonomic Chair',
    subtitle: 'Ergonomic Workstation Seating',
    category: 'Chair',
    link: 'https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/',
    tags: ['Pellicle 8Z', 'PostureFit SL', 'Forward Tilt', 'Fully Adjustable'],
    specs: [
      { label: 'Suspension', value: '8Z Pellicle breathable elastomeric mesh' },
      { label: 'Lumbar Support', value: 'Dual-pad PostureFit SL sacral stabilizer' },
      { label: 'Tilt Mechanism', value: 'Harmonic 2 tilt with forward seat angle limit' },
      { label: 'Armrests', value: '3D adjustable (height, depth, pivot angle)' }
    ],
    description: 'Maintains neutral spinal posture and cooling airflow for comfortable, fatigue-free long engineering days.'
  }
]

export const DEV_SETUP_ITEMS: DevToolItem[] = [
  {
    title: 'Cursor AI & VS Code',
    subtitle: 'AI-Powered Code Editor & Primary IDE',
    category: 'Code Editor',
    link: 'https://www.cursor.com',
    tags: ['Claude 3.5 Sonnet', 'Codebase Indexing', 'Multi-file Edit', 'Vim Mode'],
    specs: [
      { label: 'Theme', value: 'Dark+ / Customized Minimal Dark' },
      { label: 'Font', value: 'Geist Mono / JetBrains Mono (13.5px, line-height 1.6)' },
      { label: 'Keybindings', value: 'Vim Extension with custom leader mappings' },
      { label: 'Key Extensions', value: 'Prisma, Tailwind CSS IntelliSense, ESLint, GitLens, Error Lens' }
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
  "editor.formatOnSave": true,
  "workbench.colorTheme": "Dark+"
}`
    },
    description: 'Deep AST codebase indexing with instant multi-file generation and instant syntax verification.'
  },
  {
    title: 'Ghostty & Warp Terminal',
    subtitle: 'GPU-Accelerated Native Terminal Emulator',
    category: 'Terminal',
    link: 'https://ghostty.org',
    tags: ['GPU Accelerated', 'Zig Runtime', 'Truecolor', 'Split Panes'],
    specs: [
      { label: 'Renderer', value: 'Metal / GPU-Accelerated Text Pipeline' },
      { label: 'Font Size', value: '14px Geist Mono with Nerd Font glyphs' },
      { label: 'Window Padding', value: '12px horizontal, 10px vertical' },
      { label: 'Cursor Style', value: 'Block with smooth pulse animation' }
    ],
    configSnippet: {
      filename: 'ghostty/config',
      code: `font-family = "GeistMono Nerd Font"
font-size = 14
theme = "dark:tokyonight,light:catppuccin-latte"
window-padding-x = 12
window-padding-y = 10
cursor-style = block`
    },
    description: 'Sub-millisecond input-to-render latency with crystal clear font anti-aliasing.'
  },
  {
    title: 'macOS Sequoia & Unix Core',
    subtitle: 'Primary Operating System & Darwin Core',
    category: 'Operating System',
    link: 'https://www.apple.com/macos/',
    tags: ['Unix Core', 'Homebrew', 'Raycast Workflow', 'Window Tiling'],
    specs: [
      { label: 'Kernel', value: 'Darwin / XNU 64-bit Unix Core' },
      { label: 'Package Manager', value: 'Homebrew (brew bundle automated)' },
      { label: 'Window Management', value: 'Raycast Window Tiling & Shortcuts' },
      { label: 'Shell Integration', value: 'Native LaunchAgents & CoreAudio' }
    ],
    description: 'Zero maintenance Unix stability with top-tier hardware acceleration and developer tool compatibility.'
  },
  {
    title: 'Geist Mono & JetBrains Mono',
    subtitle: 'Engineered Monospace Typography',
    category: 'Editor Fonts',
    link: 'https://vercel.com/font',
    tags: ['Open Source', 'Programming Ligatures', 'Tabular Numbers', 'Geometric Sans'],
    specs: [
      { label: 'Primary Font', value: 'Geist Mono by Vercel & Basement Studio' },
      { label: 'Fallback Font', value: 'JetBrains Mono by JetBrains' },
      { label: 'OpenType Features', value: 'calt, liga, zero, ss01, cv02' },
      { label: 'Font Weights', value: 'Regular (400), Medium (500), SemiBold (600)' }
    ],
    description: 'Designed specifically for reading dense source code with unambiguous glyph distinctions between 0, O, 1, l, and I.'
  },
  {
    title: 'Zsh with Starship Prompt',
    subtitle: 'Fast Asynchronous Shell Environment',
    category: 'Shell & Prompt',
    link: 'https://starship.rs',
    tags: ['Rust Prompt', 'Fast Syntax Highlighting', 'Zsh Autosuggestions', 'FZF'],
    specs: [
      { label: 'Prompt Engine', value: 'Starship (compiled natively in Rust)' },
      { label: 'Completion', value: 'zsh-autosuggestions & fast-syntax-highlighting' },
      { label: 'History Search', value: 'fzf (Fuzzy Finder reverse search)' },
      { label: 'Node Version', value: 'fnm (Fast Node Manager in Rust)' }
    ],
    configSnippet: {
      filename: 'starship.toml',
      code: `[character]
success_symbol = "[λ](bold green)"
error_symbol = "[λ](bold red)"

[git_branch]
symbol = "🌱 "
style = "bold purple"`
    },
    description: 'Instant prompt rendering with rich git branch status, node version, and command execution timer.'
  },
  {
    title: 'Raycast',
    subtitle: 'Command Launcher & Keyboard Productivity',
    category: 'Productivity',
    link: 'https://www.raycast.com',
    tags: ['Command Palette', 'Clipboard History', 'Window Manager', 'GitHub Extensions'],
    specs: [
      { label: 'Primary Hotkey', value: 'Cmd + Space' },
      { label: 'Core Tools', value: 'Clipboard History, Snippets, Calculator, Color Picker' },
      { label: 'Integrations', value: 'GitHub PRs, Linear Issues, Vercel Deployments' },
      { label: 'Quick Links', value: 'Localhost:3000, PostgreSQL database instances' }
    ],
    description: 'Replaces spotlight with instant navigation, clipboard history, quick conversions, and window tiling.'
  },
  {
    title: 'Docker & OrbStack',
    subtitle: 'Fast Container Engine & Local VMs',
    category: 'DevOps & Containers',
    link: 'https://orbstack.dev',
    tags: ['OrbStack', 'Docker Compose', 'Lightweight VM', 'Low CPU Overhead'],
    specs: [
      { label: 'Runtime Engine', value: 'OrbStack (Native macOS Hypervisor)' },
      { label: 'Start Time', value: 'Under 2 seconds cold boot' },
      { label: 'Memory Footprint', value: 'Dynamic memory ballooning (less than 200MB idle)' },
      { label: 'Protocols', value: 'Docker API, Docker Compose, Kubernetes' }
    ],
    description: 'Runs local Redis, PostgreSQL, and microservices with near-zero battery drain and instant domain resolution.'
  },
  {
    title: 'TablePlus',
    subtitle: 'Native Database GUI Client',
    category: 'Database GUI',
    link: 'https://tableplus.com',
    tags: ['PostgreSQL', 'Redis', 'Multi-tab Queries', 'SSH Tunneling'],
    specs: [
      { label: 'App Architecture', value: 'Native Swift/Cocoa frontend' },
      { label: 'Supported Engines', value: 'PostgreSQL, Redis, MySQL, SQLite, Cassandra' },
      { label: 'Security', value: 'End-to-end TLS & SSH Bastion Key Tunneling' },
      { label: 'Inline Editing', value: 'Instant cell edit with transactional commit review' }
    ],
    description: 'Native speed without Electron bloat for querying production schemas, inspecting Redis keys, and executing SQL migrations.'
  },
  {
    title: 'Bruno & Postman',
    subtitle: 'Open-Source Git-Friendly API Client',
    category: 'API Client',
    link: 'https://www.usebruno.com',
    tags: ['Git-Friendly', 'Bru Markup', 'Offline First', 'Fast Response'],
    specs: [
      { label: 'Collection Format', value: 'Plaintext Bru markup stored directly in git repo' },
      { label: 'Protocols', value: 'REST, GraphQL, gRPC, WebSocket' },
      { label: 'Environment', value: 'Local, Staging, Production variables with secrets encryption' },
      { label: 'Scripting', value: 'Pre-request and Post-response JavaScript runners' }
    ],
    description: 'Allows API collections to live alongside application code in version control without cloud locks or forced logins.'
  }
]

