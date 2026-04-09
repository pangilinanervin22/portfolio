export interface Skill {
	label: string;
	icon?: any;
}

export interface SkillGroup {
	category: string;
	skills: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		category: "LANGUAGES",
		skills: ["JavaScript (ES6+)", "TypeScript", "Python", "HTML5", "CSS3", "SQL"],
	},
	{
		category: "FRAMEWORKS",
		skills: [
			"Next.js",
			"React.js",
			"NestJS",
			"Node.js",
			"Express.js",
			"Laravel",
			"FastApi",
			"React Native",
			"TailwindCSS",
		],
	},
	{
		category: "CLOUD & DEVOPS",
		skills: ["Azure", "Vercel", "Heroku", "Docker", "DigitalOcean", "GitHub Actions"],
	},
	{
		category: "DATABASES",
		skills: ["PostgreSQL", "Supabase", "MySQL", "MongoDB", "Firebase"],
	},
	{
		category: "TOOLS & DESIGN",
		skills: ["Git", "Figma", "Postman", "Expo", "Draw.io"],
	},
	{
		category: "AI & AUTOMATION",
		skills: ["N8n Workflow Automation", "Ollama (Local LLMs)", "OpenAI API"],
	},
];

// Flat list for backward compatibility (SEO structured data, etc.)
export const allSkills: Skill[] = skillGroups.flatMap((g) =>
	g.skills.map((label) => ({ label }))
);
