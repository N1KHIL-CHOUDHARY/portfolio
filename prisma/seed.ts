import   {PrismaClient, ProjectStatus, EmploymentType, SkillCategory} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'Nikhil Choudhary',
      passwordHash,
      role: 'admin',
    },
  })
  console.log(`✅ Admin user seeded: ${admin.email}`)

  await prisma.heroSetting.upsert({
    where: { id: 'default-hero-setting' },
    update: {},
    create: {
      id: 'default-hero-setting',
      name: 'Nikhil Choudhary',
      headline: 'Full-Stack & Systems Architect',
      subtitle: 'Building high-throughput web architectures, deep link routers, and AST context indexers for LLMs.',
      location: 'India',
      availability: 'Available for high-impact roles & technical consulting',
      profileImage: '/icon.png',
      resumeUrl: '#',
      email: 'nikhil@example.com',
      phone: '+91 9876543210',
      shortBio: 'Specializing in Next.js 16, React 19, TypeScript, Distributed Systems, and AI Context Retrieval.',
      ctaButtons: JSON.stringify([
        { label: 'View Projects', url: '#projects', primary: true },
        { label: 'Get In Touch', url: 'mailto:nikhil@example.com', primary: false },
      ]),
    },
  })
  console.log('✅ Hero settings seeded')

  // 3. Seed About Settings
  await prisma.aboutSetting.upsert({
    where: { id: 'default-about-setting' },
    update: {},
    create: {
      id: 'default-about-setting',
      content: `I am a Full-Stack Engineer and Systems Architect passionate about building fast, reliable, and scalable web applications. My expertise spans low-latency API architecture, frontend performance engineering, AST parsing, and context retrieval systems for AI models.

When I'm not writing code, I actively contribute to open-source developer tooling, benchmark microservices, and refine modern UI developer experiences.`,
      image: '/icon.png',
      yearsExperience: 4,
      projectsCompleted: 18,
      githubContributions: 1420,
      customCards: JSON.stringify([
        { title: 'Core Focus', text: 'Distributed Systems & Next.js Performance' },
        { title: 'Philosophy', text: 'Clean Code, Strict Typing & Minimal UI Bloat' },
      ]),
    },
  })
  console.log('✅ About settings seeded')

  // 4. Seed SEO Settings
  await prisma.seoSetting.upsert({
    where: { id: 'default-seo-setting' },
    update: {},
    create: {
      id: 'default-seo-setting',
      siteTitle: 'Nikhil — Senior Full-Stack Engineer Portfolio',
      description: 'Senior Full-Stack Engineer specializing in Next.js, React, TypeScript, Systems Architecture, and Developer Tools.',
      keywords: 'Nikhil, Portfolio, Full-Stack Engineer, Next.js, React, TypeScript, Node.js, Prisma, Neon',
      ogImage: '/icon.png',
      twitterImage: '/icon.png',
      robots: 'index, follow',
      canonicalUrl: 'https://nikhilchoudhary.dev',
      favicon: '/icon.png',
    },
  })
  console.log('✅ SEO settings seeded')

  // 5. Seed Projects
  const projectsData = [
    {
      slug: 'universal-app-opener',
      title: 'Universal App Opener',
      subtitle: 'Cross-platform URL routing engine for mobile deep linking',
      role: 'Creator & Lead Architect',
      timeline: 'Nov 2025 – Present',
      description: 'Converts web URLs into deep links for 40+ mobile apps across iOS and Android with automatic fallback routing.',
      tags: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind', 'Mobile DeepLinks']),
      githubUrl: 'https://github.com/mdsaban/universal-app-opener',
      liveUrl: 'https://universalappopener.com',
      stars: 256,
      forks: 42,
      status: ProjectStatus.PUBLISHED,
      featured: true,
      order: 1,
      architecture: JSON.stringify([
        'Client-side Intent Router executing custom scheme detection with latency fallback timers.',
        'Edge Middleware evaluating User-Agent headers to rewrite web links into deep universal links.',
        'Headless analytics pipeline recording link conversion rates without user tracking cookies.',
      ]),
      coreProblem: 'Standard web links open mobile websites inside in-app webviews instead of native applications, resulting in poor user conversion.',
      highlights: JSON.stringify([
        'Zero-dependency intent detection scheme supporting 40+ native applications.',
        'Sub-50ms fallback redirects when target native app is not installed on client device.',
        'Integrated open-graph parser generating dynamic preview cards for social link sharing.',
      ]),
      codeSnippetFilename: 'deepLinkRouter.ts',
      codeSnippetCode: `export function resolveDeepLink(url: string, platform: 'ios' | 'android'): string {
  const scheme = SCHEME_MAP[getAppDomain(url)];
  if (!scheme) return url;
  
  if (platform === 'ios') {
    return \`\${scheme.ios}://open?url=\${encodeURIComponent(url)}\`;
  }
  return \`intent://open?url=\${encodeURIComponent(url)}#Intent;scheme=\${scheme.android};package=\${scheme.package};end\`;
}`,
    },
    {
      slug: 'cursor-code-indexer',
      title: 'Cursor Code Indexer',
      subtitle: 'AST vector search indexer built for LLM context retrieval',
      role: 'Core Maintainer',
      timeline: 'Sep 2025 – Dec 2025',
      description: 'High-performance vector search indexer designed to index repository AST structures for AI pair programmers.',
      tags: JSON.stringify(['TypeScript', 'Node.js', 'Tree-Sitter', 'Vector Index']),
      githubUrl: 'https://github.com',
      stars: 184,
      forks: 21,
      status: ProjectStatus.PUBLISHED,
      featured: true,
      order: 2,
      architecture: JSON.stringify([
        'Tree-sitter parser generating semantic AST syntax blocks across TypeScript, Go, and Python.',
        'In-memory HNSW vector index performing cosine similarity matching over function embeddings.',
        'Incremental file watcher updating vector index only when file SHA-256 hashes change.',
      ]),
      coreProblem: 'Large codebases exceed LLM context windows, requiring intelligent semantic retrieval.',
      highlights: JSON.stringify([
        'Parses over 50,000 lines of source code in under 1.2 seconds.',
        'Supports hybrid search combining BM25 keyword matching with dense vector embeddings.',
        'Low RAM footprint consuming less than 120MB heap memory during continuous indexing.',
      ]),
      codeSnippetFilename: 'astIndexer.ts',
      codeSnippetCode: `export async function indexFileAST(filepath: string, content: string) {
  const tree = parser.parse(content);
  const symbols = extractSymbolNodes(tree.rootNode);
  const embeddings = await generateBatchEmbeddings(symbols.map(s => s.text));
  return vectorStore.upsert(symbols.map((sym, i) => ({
    id: \`\${filepath}#\${sym.name}\`,
    vector: embeddings[i],
    metadata: { filepath, line: sym.startLine }
  })));
}`,
    },
    {
      slug: 'devpulse-telemetry-dashboard',
      title: 'DevPulse Telemetry Dashboard',
      subtitle: 'Ultra-fast monochrome metric monitor for distributed microservices',
      role: 'Full Stack Engineer',
      timeline: 'Jul 2025 – Sep 2025',
      description: 'Ultra-fast monochrome metrics dashboard monitoring API latencies, worker threads, and memory heap usages.',
      tags: JSON.stringify(['React', 'Tailwind CSS', 'Framer Motion', 'Redis']),
      githubUrl: 'https://github.com',
      liveUrl: 'https://devpulse.io',
      stars: 94,
      forks: 12,
      status: ProjectStatus.PUBLISHED,
      featured: false,
      order: 3,
      architecture: JSON.stringify([
        'WebSocket event stream streaming system telemetry at 60 FPS directly to Canvas graphics layers.',
        'Redis TimeSeries database storing sliding 24-hour metric aggregations.',
        'Lightweight React component tree with virtualized rows for high-density log rendering.',
      ]),
      coreProblem: 'Traditional telemetry dashboards suffer from bloated UI rendering and heavy asset loads.',
      highlights: JSON.stringify([
        'Sub-10ms UI render latency with custom Canvas-based sparkline visualizations.',
        'Monochrome, high-contrast dark theme optimized for multi-monitor developer setups.',
        'Configurable alert triggers notifying Slack and PagerDuty endpoints.',
      ]),
      codeSnippetFilename: 'telemetryStream.ts',
      codeSnippetCode: `const ws = new WebSocket(TELEMETRY_ENDPOINT);
ws.onmessage = (event) => {
  const metricBatch = JSON.parse(event.data);
  batchUpdateCanvas(metricBatch);
  updateMemoryHeapGauge(metricBatch.heapUsed);
};`,
    },
    {
      slug: 'fastcache-redis-client',
      title: 'FastCache Redis Client',
      subtitle: 'Zero-allocation in-memory caching layer with multi-region cluster failover',
      role: 'Backend Architect',
      timeline: 'May 2025 – Jun 2025',
      description: 'Zero-allocation in-memory caching layer with multi-region cluster failover and automatic retry policies.',
      tags: JSON.stringify(['Go', 'Redis', 'Docker', 'gRPC']),
      githubUrl: 'https://github.com',
      stars: 120,
      forks: 18,
      status: ProjectStatus.PUBLISHED,
      featured: false,
      order: 4,
      architecture: JSON.stringify([
        'Lock-free ring buffer managing asynchronous cache writes and eviction policies.',
        'RESP3 protocol parser compiled natively without interface allocations.',
        'Automated health check probes managing regional read-replica failover.',
      ]),
      coreProblem: 'Standard Redis drivers produce high GC pressure in high-concurrency Go services.',
      highlights: JSON.stringify([
        'Zero GC memory allocations under 100,000 requests per second workload.',
        'Built-in circuit breaker preventing cache stampede on expired key requests.',
        'Comprehensive Prometheus exporter for cache hit/miss ratio tracking.',
      ]),
      codeSnippetFilename: 'client.go',
      codeSnippetCode: `func (c *Client) Get(ctx context.Context, key string) ([]byte, error) {
	if val, ok := c.localRing.Get(key); ok {
		return val, nil
	}
	return c.redisPool.Do(ctx, "GET", key)
}`,
    },
  ]

  for (const project of projectsData) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }
  console.log('✅ Projects seeded')

  // 6. Seed Experiences
  const experiencesData = [
    {
      company: 'TechCorp Solutions',
      role: 'Senior Full Stack Engineer',
      location: 'Remote',
      employmentType: EmploymentType.FULL_TIME,
      startDate: '2024',
      endDate: 'Present',
      currentJob: true,
      description: 'Leading frontend architecture and cloud integration for enterprise clients.',
      responsibilities: JSON.stringify([
        'Architected Next.js micro-frontends serving 2M+ monthly active users',
        'Reduced initial page load latency by 45% through aggressive edge caching',
        'Mentored junior engineers and led weekly code reviews',
      ]),
      technologies: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind', 'PostgreSQL', 'Redis']),
      order: 1,
    },
    {
      company: 'Acme Systems',
      role: 'Full Stack Engineer',
      location: 'Hybrid',
      employmentType: EmploymentType.FULL_TIME,
      startDate: '2022',
      endDate: '2024',
      currentJob: false,
      description: 'Built high-throughput REST APIs and interactive telemetry dashboards.',
      responsibilities: JSON.stringify([
        'Developed real-time WebSocket monitoring interfaces',
        'Optimized PostgreSQL queries reducing DB CPU load by 30%',
      ]),
      technologies: JSON.stringify(['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker']),
      order: 2,
    },
  ]

  for (const exp of experiencesData) {
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, role: exp.role },
    })
    if (!existing) {
      await prisma.experience.create({ data: exp })
    }
  }
  console.log('✅ Experience seeded')

  // 7. Seed Certifications
  const certsData = [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2024',
      credentialUrl: 'https://aws.amazon.com',
      credentialId: 'AWS-ASA-1029384',
      featured: true,
      order: 1,
    },
    {
      title: 'Meta Certified Front-End Developer',
      issuer: 'Coursera / Meta',
      issueDate: '2023',
      credentialUrl: 'https://coursera.org',
      credentialId: 'META-FE-98765',
      featured: true,
      order: 2,
    },
  ]

  for (const cert of certsData) {
    const existing = await prisma.certification.findFirst({
      where: { title: cert.title, issuer: cert.issuer },
    })
    if (!existing) {
      await prisma.certification.create({ data: cert })
    }
  }
  console.log('✅ Certifications seeded')

  // 8. Seed Development Setup
  const devSetupData = [
    {
      slug: 'gears-hardware',
      title: 'Gears & Hardware',
      subtitle: 'Physical setup and workstation hardware',
      category: 'Workstation Hardware',
      whyIUseIt: 'Designed for high-throughput software development, silent operation, and ergonomic typing.',
      tags: JSON.stringify(['MacBook Pro', 'Keychron', 'MX Master 3S', 'Dell UltraSharp']),
      specs: JSON.stringify([
        { label: 'Primary Computer', value: 'MacBook Pro 16" M3 Max (36GB RAM, 1TB NVMe)' },
        { label: 'Display', value: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)' },
        { label: 'Keyboard', value: 'Keychron K2 Wireless Mechanical (Gateron Brown Switches)' },
        { label: 'Mouse', value: 'Logitech MX Master 3S Performance Wireless' },
        { label: 'Audio', value: 'Sony WH-1000XM5 Noise Canceling Headphones' },
      ]),
      configSnippetFilename: 'hardware-profile.json',
      configSnippetCode: `{
  "workstation": "MacBook Pro M3 Max",
  "memory": "36GB Unified",
  "peripherals": {
    "display": "Dell UltraSharp 27 4K",
    "audio": "Sony WH-1000XM5",
    "input": ["Keychron K2", "Logitech MX Master 3S"]
  }
}`,
      links: JSON.stringify([
        { label: 'Keychron K2 Specs', url: 'https://keychron.com' },
        { label: 'Dell U2723QE Monitor', url: 'https://dell.com' },
      ]),
      order: 1,
    },
    {
      slug: 'development-setup',
      title: 'Development Setup',
      subtitle: 'IDE configuration, terminal environment, and editor themes',
      category: 'Editor & Terminal Config',
      whyIUseIt: 'Optimized for minimal visual distraction, rapid keyboard navigation, and seamless AI pair programming.',
      tags: JSON.stringify(['Cursor AI', 'VS Code', 'Geist Mono', 'JetBrains Mono', 'Zsh']),
      specs: JSON.stringify([
        { label: 'Primary IDE', value: 'Cursor AI / VS Code (Dark+ Theme)' },
        { label: 'Code Editor Font', value: 'Geist Mono & JetBrains Mono' },
        { label: 'Terminal Emulator', value: 'Ghostty & Warp Terminal' },
        { label: 'Shell Configuration', value: 'Zsh with Starship Prompt' },
      ]),
      configSnippetFilename: 'settings.json',
      configSnippetCode: `{
  "editor.fontFamily": "Geist Mono, JetBrains Mono, monospace",
  "editor.fontSize": 13.5,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": true,
  "editor.minimap.enabled": false,
  "workbench.colorTheme": "Dark+"
}`,
      links: JSON.stringify([
        { label: 'Cursor AI Editor', url: 'https://cursor.com' },
        { label: 'Geist Font Family', url: 'https://vercel.com/font' },
      ]),
      order: 2,
    },
    {
      slug: 'tech-stack',
      title: 'Tech Stack',
      subtitle: 'Core daily frameworks, languages, and runtime tools',
      category: 'Software Architecture',
      whyIUseIt: 'Selected for maximum type safety, high developer velocity, ultra-fast server response times, and production reliability.',
      tags: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Redis', 'PostgreSQL', 'Go']),
      specs: JSON.stringify([
        { label: 'Frontend Frameworks', value: 'Next.js 16 (App Router), React 19, Tailwind CSS v4' },
        { label: 'Languages', value: 'TypeScript, JavaScript (ESNext), Go, SQL' },
        { label: 'Databases & Cache', value: 'PostgreSQL, Neon, Supabase, Redis, Prisma ORM' },
        { label: 'DevOps & Tooling', value: 'Vercel, Docker, Git, GitHub Actions, npm' },
      ]),
      configSnippetFilename: 'package.json',
      configSnippetCode: `{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "typescript": "^5.9.0",
    "tailwindcss": "^4.3.0"
  }
}`,
      links: JSON.stringify([
        { label: 'Next.js Documentation', url: 'https://nextjs.org' },
        { label: 'TypeScript Specs', url: 'https://typescriptlang.org' },
      ]),
      order: 3,
    },
  ]

  for (const dev of devSetupData) {
    await prisma.developmentSetup.upsert({
      where: { slug: dev.slug },
      update: dev,
      create: dev,
    })
  }
  console.log('✅ Development setup seeded')

  // 9. Seed Skills
  const skillsData = [
    { name: 'TypeScript', category: SkillCategory.LANGUAGES, icon: 'code', proficiency: 95, order: 1, featured: true },
    { name: 'Next.js 16', category: SkillCategory.FRONTEND, icon: 'layers', proficiency: 95, order: 2, featured: true },
    { name: 'React 19', category: SkillCategory.FRONTEND, icon: 'atom', proficiency: 95, order: 3, featured: true },
    { name: 'Node.js', category: SkillCategory.BACKEND, icon: 'server', proficiency: 90, order: 4, featured: true },
    { name: 'PostgreSQL & Neon', category: SkillCategory.DATABASES, icon: 'database', proficiency: 88, order: 5, featured: true },
    { name: 'Prisma ORM', category: SkillCategory.DATABASES, icon: 'database', proficiency: 92, order: 6, featured: true },
    { name: 'Tailwind CSS v4', category: SkillCategory.FRONTEND, icon: 'palette', proficiency: 95, order: 7, featured: true },
    { name: 'Redis', category: SkillCategory.DATABASES, icon: 'cpu', proficiency: 85, order: 8, featured: false },
    { name: 'Go (Golang)', category: SkillCategory.LANGUAGES, icon: 'terminal', proficiency: 80, order: 9, featured: false },
    { name: 'Docker & DevOps', category: SkillCategory.DEVOPS, icon: 'box', proficiency: 82, order: 10, featured: false },
  ]

  for (const skill of skillsData) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, category: skill.category },
    })
    if (!existing) {
      await prisma.skill.create({ data: skill })
    }
  }
  console.log('✅ Skills seeded')

  // 10. Seed Social Links
  const socialData = [
    { platform: 'GitHub', url: 'https://github.com/nikhil', label: 'GitHub Profile', icon: 'github', order: 1, enabled: true },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/nikhil', label: 'LinkedIn Profile', icon: 'linkedin', order: 2, enabled: true },
    { platform: 'Twitter/X', url: 'https://twitter.com/nikhil', label: 'Twitter/X', icon: 'twitter', order: 3, enabled: true },
    { platform: 'Email', url: 'mailto:nikhil@example.com', label: 'Email Contact', icon: 'mail', order: 4, enabled: true },
  ]

  for (const soc of socialData) {
    const existing = await prisma.socialLink.findFirst({
      where: { platform: soc.platform },
    })
    if (!existing) {
      await prisma.socialLink.create({ data: soc })
    }
  }
  console.log('✅ Social links seeded')

  console.log('🚀 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
