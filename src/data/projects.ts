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
                        "Storefront and back office for an Australian furniture retailer: a Next.js front end over NestJS and Laravel services. At HEQS I owned the App Router migration (30%+ faster page loads), the technical SEO and dynamic sitemaps (~2,000 extra organic visits), and the CDN and SSR caching work that cut cloud spend by ~45%, with GitHub Actions pipelines deploying to Vercel, Heroku, AWS, and Azure.",
                stack: [
                        "Next.js",
                        "NestJS",
                        "Laravel",
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
                        "Internship at FiveTwenty: led the backend of an enterprise timekeeping platform (role-based access, audit logging, API design) and contributed to frontend and DevOps, including Playwright + Jest E2E coverage and Docker on DigitalOcean. Now in daily production use by FiveTwenty's enterprise clients.",
                stack: [
                        "React",
                        "ShadCN",
                        "Express",
                        "Prisma",
                        "PostgreSQL",
                        "TypeScript",
                        "Docker",
                        "Jest",
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
                        "Group thesis project, a writing tool that flags biased terms and suggests inclusive alternatives in real time. I worked on the backend and NLP side: REST APIs, the bias-detection pipeline, and the LanguageTool + spaCy integration. The live demo is still online.",
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
                        "Freelance project, a sales and inventory system for a Japanese sweets shop. Built solo, full stack.",
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
                        "Freelance project, a recycling app I built solo. Online-first backend with offline support and tested cloud↔local sync across Android and iOS.",
                stack: ["React Native", "Expo", "Supabase", "TypeScript"],
                year: "2025",
                repo: "https://github.com/pangilinanervin22/GreenCycle",
                image: greenCycle,
                imageAlt: "image of greencycle a recycling mobile app",
        },
];
