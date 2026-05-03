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
                        "Internship at FiveTwenty: a small team built a timekeeping platform. I owned the backend — role-based access, audit logging, API design, performance tuning, automated tests. It's in daily production use by FiveTwenty's enterprise clients.",
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
                        "Group thesis project — a writing tool that flags biased terms and suggests inclusive alternatives in real time. I worked on the backend and NLP side: REST APIs, the bias-detection pipeline, and the LanguageTool + spaCy integration. Live demo's still online.",
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
                        "Freelance project — a sales and inventory system for a Japanese sweets shop. Built solo, full stack.",
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
                        "Freelance project — a recycling app I built solo. Online-first backend with offline support and tested cloud↔local sync across Android and iOS.",
                stack: ["React Native", "Expo", "Supabase", "TypeScript"],
                year: "2025",
                repo: "https://github.com/pangilinanervin22/GreenCycle",
                image: greenCycle,
                imageAlt: "image of greencycle a recycling mobile app",
        },
];
