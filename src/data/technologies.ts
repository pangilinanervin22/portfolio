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
		category: "FRONTEND",
		skills: ["Astro", "React", "React Native", "TypeScript"],
	},
	{
		category: "BACKEND",
		skills: ["Node.js", "Express", "NestJs", "FastAPI", "Python", "Prisma"],
	},
	{
		category: "DATABASE",
		skills: ["PostgreSQL", "MongoDB"],
	},
	{
		category: "TOOLS & INFRA",
		skills: ["Docker", "Git", "Azure", "Jest", "Unity (C#)"],
	},
];

// Flat list for backward compatibility (SEO structured data, etc.)
export const allSkills: Skill[] = skillGroups.flatMap((g) =>
	g.skills.map((label) => ({ label }))
);
