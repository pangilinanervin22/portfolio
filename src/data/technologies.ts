export interface SkillTier {
	label: string;       // Core, Often, Sometimes, Tools
	context: string;     // "daily", "regular reach", "shipped at least once", "daily workflow"
	skills: string[];
}

export const skillTiers: SkillTier[] = [
	{
		label: "Core",
		context: "daily",
		skills: [
			"TypeScript",
			"Next.js",
			"React",
			"Tailwind",
			"SCSS",
			"Node.js",
			"Express",
			"PostgreSQL",
			"Prisma",
			"Supabase",
			"Docker",
			"GitHub Actions",
			"Vercel",
			"Netlify",
			"Vitest",
			"Jest",
			"Playwright",
		],
	},
	{
		label: "Often",
		context: "regular reach",
		skills: [
			"NestJS",
			"Python",
			"FastAPI",
			"React Native",
			"Expo",
			"shadcn/ui",
			"Puppeteer",
			"Supertest",
			"Redis",
			"Heroku",
			"DigitalOcean",
		],
	},
	{
		label: "Sometimes",
		context: "shipped at least once",
		skills: [
			"Laravel",
			"Deno",
			"AWS",
			"Azure",
			"MongoDB",
			"MySQL",
			"Firebase",
			"Salesforce",
			"Twilio",
			"C#",
			"Unity",
			"n8n",
		],
	},
	{
		label: "Tools",
		context: "daily workflow",
		skills: [
			"Git",
			"Figma",
			"Postman",
			"Draw.io",
			"Ollama",
			"OpenAI API",
			"Claude Code",
			"MCP servers",
		],
	},
];

// Flat list retained for SEO structured data and any other consumers.
export interface Skill {
	label: string;
}

export const allSkills: Skill[] = skillTiers.flatMap((t) =>
	t.skills.map((label) => ({ label }))
);
