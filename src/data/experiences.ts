export interface ExperienceItem {
	role: string;
	company: string;
	period: string;
	location: string;
	description: string;
	tech?: string[];
}

export const experiences: ExperienceItem[] = [
	{
		role: "Full-Stack Developer",
		company: "HEQS Group",
		period: "Aug 2025 – Present",
		location: "Sydney, Australia · Remote",
		description:
			"Built and maintained web apps with TypeScript and Next.js, managed CI/CD pipelines via Vercel, AWS, and Heroku, and migrated legacy code to App Router with Next.js 16 improving performance and reducing costs.",
		tech: [
			"TypeScript",
			"Next.js",
			"NestJS",
			"Vercel",
			"AWS",
			"Heroku",
			"GitHub Actions",
		],
	},
	{
		role: "Full-Stack Developer",
		company: "Five Twenty IT Service",
		period: "Jun 2024 – Jun 2025",
		location: "Alabang, Muntinlupa City · Hybrid",
		description:
			"Implemented end‑to‑end features for a corporate web platform designed REST APIs, refined responsive React UI, optimized database queries & strengthened testing for reliability.",
		tech: [
			"Express",
			"React",
			"TypeScript",
			"Prisma",
			"PostgreSQL",
			"Digital Ocean",
			"Jest",
			"Docker",
		],
	},
	{
		role: "Freelance Developer",
		company: "Self‑Employed",
		period: "2023 – 2025",
		location: "Remote",
		description:
			"Deliver responsive landing pages & small business sites with semantic, accessible markup and lightweight tooling.",
		tech: ["NextJs", "React Native", "Supabase"],
	},
	{
		role: "Student Projects",
		company: "Cavite State University Bacoor",
		period: "2022 – 2024",
		location: "Bacoor, Cavite",
		description:
			"Collaborated with other students on thesis and school projects building full‑stack features with clean architecture, solid state management & automated testing.",
		tech: [
			"React",
			"Node.js",
			"Express",
			"MongoDB",
			"C#",
			"Unity",
			"Python",
			"FastAPI",
			"Spacy",
		],
	},
	{
		role: "Getting Started",
		company: "Self Learning",
		period: "2021",
		location: "Online",
		description:
			"Explored programming fundamentals, version control & web basics turning curiosity into structured learning.",
		tech: ["HTML", "CSS", "JavaScript", "Java", "Git"],
	},
];
