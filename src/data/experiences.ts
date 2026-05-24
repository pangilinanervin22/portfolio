export interface ExperienceItem {
	role: string;
	company: string;
	period: string;
	location: string;
	summary: string;
	highlights: string[];
	tech?: string[];
}

export const experiences: ExperienceItem[] = [
	{
		role: "Full-stack Developer",
		company: "Cosmic Society",
		period: "Mar 2026 – Present",
		location: "Berlin, Germany · Remote (via Penbrothers, Manila)",
		summary: "Building a Next.js + Supabase event platform serving ~30,000 peak users at large-scale events.",
		highlights: [
			"Shipping features with Next.js (TypeScript) + Supabase in a remote, international team",
			"Async collaboration with Berlin-based team across time zones; daily workflow on GitHub Projects",
			"Pairing closely with the senior developer and co-founder to debug, optimize, and stabilize features",
			"AI-assisted development with Claude Code to accelerate delivery without sacrificing code quality",
		],
		tech: [
			"Next.js",
			"TypeScript",
			"Supabase",
			"GitHub Projects",
			"Claude Code",
		],
	},
	{
		role: "Full-stack Developer",
		company: "HEQS Group",
		period: "Sep 2025 – Mar 2026",
		location: "Sydney, NSW · Remote",
		summary: "Built and optimized production web applications across TypeScript, Next.js, NestJS, and Laravel.",
		highlights: [
			"Migrated legacy Pages Router to App Router: 30%+ faster page loads and improved Core Web Vitals",
			"Technical SEO and dynamic sitemaps drove ~2,000+ additional organic page visits",
			"Cut cloud costs ~45% with CDN-based asset caching and SSR strategies",
			"CI/CD pipelines via GitHub Actions across Vercel, Heroku, AWS, and Azure",
			"Cross-functional collaboration with IT, marketing, SEO, and sales on UI/UX and production design",
		],
		tech: [
			"TypeScript",
			"Next.js",
			"NestJS",
			"Laravel",
			"GitHub Actions",
			"Vercel",
			"AWS",
			"Azure",
			"Heroku",
		],
	},
	{
		role: "Full-stack Developer",
		company: "FiveTwenty IT Services",
		period: "Jun 2024 – Jun 2025",
		location: "Alabang, Muntinlupa · Hybrid (started as IT Intern, on-site)",
		summary: "Built enterprise-grade applications end-to-end; started as IT intern, transitioned to full-stack.",
		highlights: [
			"Engineered enterprise apps in TypeScript, React, Express, and PostgreSQL; containerized with Docker on DigitalOcean",
			"Introduced E2E testing with Playwright + Jest, reducing regression bugs and improving reliability",
			"Active in Agile workflow: sprint planning, debugging, QA, and code reviews",
			"Provided basic IT troubleshooting (hardware, software, network) during the intern period",
		],
		tech: [
			"TypeScript",
			"React",
			"Express",
			"PostgreSQL",
			"Docker",
			"DigitalOcean",
			"Playwright",
			"Jest",
		],
	},
	{
		role: "Freelance Developer",
		company: "Self-Employed",
		period: "2023 – 2025",
		location: "Remote",
		summary: "Custom web and mobile apps for students and small businesses, academic workflows and automated business processes.",
		highlights: [
			"Built and deployed solutions with React, Express, React Native, and Supabase, with scalability and efficiency in mind",
			"Translated client requirements into shipped implementations with full project-delivery satisfaction",
			"Provided ongoing support and maintenance for long-term usability and client trust",
		],
		tech: ["React", "Express", "React Native", "Supabase"],
	},
	{
		role: "Student Projects",
		company: "Cavite State University Bacoor",
		period: "2022 – 2024",
		location: "Bacoor, Cavite",
		summary: "Thesis and team projects with full-stack architecture, state management, and automated tests.",
		highlights: [
			"Co-built a gender-fair NLP revision tool with FastAPI + spaCy (group thesis)",
			"Chrome Tone, 2-player brain-teaser puzzle game (C# + Unity) where black/white characters cross color-matched platforms toward a portal; won 'Best Intro in Game Development Project 2024'",
			"Online thrift store on the MERN stack (MongoDB, Express, React, Node) for the Software Engineering course",
		],
		tech: [
			"React",
			"Node.js",
			"Express",
			"MongoDB",
			"C#",
			"Unity",
			"Python",
			"FastAPI",
			"spaCy",
		],
	},
	{
		role: "Getting Started",
		company: "Self-taught",
		period: "2021",
		location: "Online",
		summary: "HTML, CSS, JS, Java, Git. Where it began.",
		highlights: [
			"Mini-games in vanilla JS and Java/Android, snake, guessing games, brain teasers",
			"Landing pages with web + mobile responsiveness and theming, designed in Figma",
		],
		tech: ["HTML", "CSS", "JavaScript", "Java", "Android", "Figma", "Git"],
	},
];
