import DemoImageInventory from "../assets/projects/inventory.png";
import timekeeping from "../assets/projects/timekeeping.png";
import greenCycle from "../assets/projects/greenCycle.png";
import fairWrite from "../assets/projects/fairwrite.png";

export interface ProjectItem {
	title: string;
	description: string;
	stack: string[];
	repo?: string;
	demo?: string;
	year?: string;
	image?: ImageMetadata;
	imageAlt?: string;
}

export const projects: ProjectItem[] = [
	{
		title: "Paysera Timekeeping System",
		description:
			"Internship at FiveTwenty: our team built a timekeeping platform. I mainly contributed to the backend, including role-based access control, audit logging, API design, performance tuning, and automated tests.",
		stack: [
			"React",
			"ShadCN",
			"Express",
			"Prisma",
			"PostgreSQL",
			"TypeScript",
			"Docker",
			"Jest",
			"Supertest",
			"DigitalOcean",
		],
		year: "2024 – 2025",
		image: timekeeping,
		imageAlt: "image of paysera timekeeping system",
	},
	{
		title: "Fair Write (Gender Fair Revision)",
		description:
			"Group thesis project: my role involved backend and NLP development, where I built REST APIs and integrated pipelines to detect biased terms and suggest inclusive alternatives in real time.",
		stack: [
			"Svelte",
			"Tailwind",
			"Prosemirror",
			"FastAPI",
			"LanguageTool",
			"spaCy",
		],
		year: "2024 – 2025",
		repo: "https://github.com/Fair-Write",
		demo: "https://fairwrite.netlify.app/",
		image: fairWrite,
		imageAlt: "image of fair write a gender fair revision web application",
	},
	{
		title: "Ajapco Sales & Inventory System",
		description:
			"Freelance project developed a sales and inventory management system for selling japanese sweets.",
		stack: ["React", "Node.js", "Express", "MySQL"],
		year: "2023",
		repo: "https://github.com/pangilinanervin22/inventory_react",
		demo: "https://pangilinanervin22.github.io/inventory_react/",
		image: DemoImageInventory,
		imageAlt: "image of ajapco sales and inventory system",
	},
	{
		title: "GreenCycle Mobile App",
		description:
			"Freelance project built online‑first backend logic with offline support for a recycling app  and tested data sync between cloud and local storage across Android/iOS.",
		stack: ["React Native", "Expo", "Supabase", "TypeScript"],
		year: "2025",
		repo: "https://github.com/pangilinanervin22/GreenCycle",
		image: greenCycle,
		imageAlt: "image of greencycle a recycling mobile app",
	},
];
