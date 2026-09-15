import DemoImageInventory from "../assets/projects/inventory.png";
import timekeeping from "../assets/projects/timekeeping.png";
import greenCycle from "../assets/projects/greenCycle.png";
import fairWrite from "../assets/projects/fairwrite.png";
import priceworth from "../assets/projects/priceworth.jpg";

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
                title: "Priceworth Furniture",
                description:
                        "Storefront and back office for an Australian furniture retailer, selling mostly to homes and sometimes to larger companies. A Next.js front end over a NestJS API. Because it is a live commercial site, the App Router migration had to land incrementally with no downtime, which meant picking a rendering strategy per page type instead of converting everything at once.",
                stack: [
                        "Next.js",
                        "NestJS",
                        "TypeScript",
                        "PostgreSQL",
                        "GitHub Actions",
                        "Vercel",
                        "Azure",
                        "AWS",
                        "Heroku",
                ],
                year: "2025",
                demo: "https://www.priceworth.com.au/",
                image: priceworth,
                imageAlt: "image of priceworth australian furniture e-commerce website",
        },
        {
                title: "Paysera Timekeeping System",
                description:
                        "Internship at FiveTwenty: led the backend of a corporate timekeeping platform used by 40+ employees (role-based access, audit logging, API design, Redis caching) and contributed to frontend and DevOps, including Jest, Supertest and Playwright coverage plus Docker on DigitalOcean with CI/CD. Now in daily production use by FiveTwenty's enterprise clients.",
                stack: [
                        "React",
                        "ShadCN",
                        "Express",
                        "Prisma",
                        "PostgreSQL",
                        "Redis",
                        "TypeScript",
                        "Docker",
                        "Jest",
                        "Supertest",
                        "Playwright",
                        "DigitalOcean",
                ],
                year: "2024 – 2025",
                image: timekeeping,
                imageAlt: "image of paysera timekeeping system",
        },
        {
                title: "Fair Write (Gender Fair Revision)",
                description:
                        "Group thesis project, a writing tool that flags biased terms and suggests inclusive alternatives in real time. I worked on the backend and NLP side: REST APIs, the bias-detection pipeline, and the LanguageTool + spaCy integration, tuned for concurrent requests. The live demo is still online.",
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
                        "Freelance build for Ajapco, a Japanese sweets shop: a sales and inventory system with a reporting dashboard (monthly sales, stock alerts, best-selling products) plus product, stock, sales, and employee management. Built solo, front to back.",
                stack: ["React", "Zustand", "React Hook Form", "Node.js", "Express", "MySQL"],
                year: "2023",
                repo: "https://github.com/pangilinanervin22/inventory_react",
                demo: "https://pangilinanervin22.github.io/inventory_react/",
                image: DemoImageInventory,
                imageAlt: "image of ajapco sales and inventory system",
        },
        {
                title: "GreenCycle Mobile App",
                description:
                        "Freelance project, built solo: a React Native app for discovering ways to reuse and recycle fruit and vegetable waste, with liked posts and an admin dashboard for reviewing pending submissions. Online-first backend with offline support, cloud↔local sync tested on Android and iOS.",
                stack: ["React Native", "Expo", "Supabase", "TypeScript"],
                year: "2025",
                repo: "https://github.com/pangilinanervin22/GreenCycle",
                image: greenCycle,
                imageAlt: "image of greencycle a recycling mobile app",
        },
];
