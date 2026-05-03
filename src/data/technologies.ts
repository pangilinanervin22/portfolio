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
			"Node.js",
			"Express",
			"PostgreSQL",
			"Prisma",
			"Docker",
		],
	},
	{
		label: "OFTEN",
		context: "regular reach",
		skills: [
			"NestJS",
			"Laravel",
			"React Native",
			"Expo",
			"Tailwind",
			"GitHub Actions",
			"Vercel",
			"AWS",
			"Azure",
			"Heroku",
			"DigitalOcean",
			"Supabase",
			"Jest",
			"Playwright",
		],
	},
	{
		label: "SOMETIMES",
		context: "shipped at least once",
		skills: [
			"FastAPI",
			"Python",
			"MongoDB",
			"MySQL",
			"Firebase",
			"C#",
			"Unity",
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
			"n8n",
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
