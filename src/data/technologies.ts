export interface SkillTier {
	label: string;       // CORE, OFTEN, SOMETIMES, TOOLS
	context: string;     // "daily", "regular reach", "shipped at least once", "daily workflow"
	skills: string[];
}

export const skillTiers: SkillTier[] = [
	{
		label: "CORE",
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
			"Jest",
			"Playwright",
		],
	},
	{
		label: "OFTEN",
		context: "regular reach",
		skills: [
			"NestJS",
			"Python",
			"FastAPI",
			"React Native",
			"Expo",
			"Heroku",
			"DigitalOcean",
		],
	},
	{
		label: "SOMETIMES",
		context: "shipped at least once",
		skills: [
			"Laravel",
			"AWS",
			"Azure",
			"MongoDB",
			"MySQL",
			"Firebase",
			"C#",
			"Unity",
			"n8n",
		],
	},
	{
		label: "TOOLS",
		context: "daily workflow",
		skills: [
			"Git",
			"Figma",
			"Postman",
			"Draw.io",
			"Ollama",
			"OpenAI API",
			"Claude",
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
