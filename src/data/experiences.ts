import cosmicSocietyLogo from "../assets/experience/Cosmic_Society.jpg";
import heqsLogo from "../assets/experience/HEQS.png";
import fiveTwentyLogo from "../assets/experience/520_IT_SERVICE.png";

export interface ExperienceItem {
	role: string;
	company: string;
	period: string;
	location: string;
	summary: string;
	highlights: string[];
	tech?: string[];
	logo?: ImageMetadata;
	logoAlt?: string;
}

export const experiences: ExperienceItem[] = [
	{
		role: "Full-stack Developer",
		company: "Cosmic Society",
		logo: cosmicSocietyLogo,
		logoAlt: "Cosmic Society company logo",
		period: "Mar 2026 – Present",
		location: "Berlin, Germany · Remote (via Penbrothers, Manila)",
		summary: "Building a multi-brand event and retail-activation platform on Next.js, Supabase and Tailwind, serving ~30,000 peak users at large-scale events.",
		highlights: [
			"Fixed two cross-brand privilege-escalation vulnerabilities in the Postgres row-level security layer",
			"Scaled the platform for production event load: database load-profiling, rewritten brand-admin RLS policies after a statement-timeout incident, virtualised admin lists, and heavy statistics moved to Deno edge functions",
			"Extended the Salesforce, Twilio and Veriff/SCHUFA integrations, adding SMS delivery observability with segment-accurate cost tracking, a retry queue for pending consent syncs, and Apple Wallet membership passes",
			"Rebuilt admin loyalty analytics with leaderboards and a live activity feed, plus unified dispense reporting across staff, agent and machine channels with date-range filtering and CSV export",
			"E2E and integration coverage with Vitest and Puppeteer; every schema change ships as a repeatable migration",
		],
		tech: [
			"TypeScript",
			"Next.js",
			"Supabase",
			"PostgreSQL",
			"Tailwind",
			"Deno",
			"Netlify",
			"Vitest",
			"Puppeteer",
		],
	},
	{
		role: "Full-stack Developer",
		company: "HEQS Group",
		logo: heqsLogo,
		logoAlt: "HEQS Group company logo",
		period: "Aug 2025 – Feb 2026",
		location: "Sydney, Australia · Remote",
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
		logo: fiveTwentyLogo,
		logoAlt: "FiveTwenty IT Services company logo",
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
			"Built and deployed solutions with React, Express, React Native, Supabase, and PostgreSQL, with scalability and efficiency in mind",
			"Secured and optimized client applications: authentication flows and database policies",
			"Translated client requirements into shipped implementations with full project-delivery satisfaction",
			"Provided ongoing support and maintenance for long-term usability and client trust",
		],
		tech: ["React", "Express", "React Native", "Supabase", "PostgreSQL"],
	},
];
