import astroIcon from "../assets/technologies/astro.svg";
import reactIcon from "../assets/technologies/react.svg";
import typescriptIcon from "../assets/technologies/typescript.svg";
import nodeIcon from "../assets/technologies/node-js.svg";
import expressIcon from "../assets/technologies/express.svg";
import prismaIcon from "../assets/technologies/prisma.svg";
import postgresIcon from "../assets/technologies/postgresql.svg";
import mongoIcon from "../assets/technologies/mongodb.svg";
import fastapiIcon from "../assets/technologies/fastapi.svg";
import pythonIcon from "../assets/technologies/python.svg";
import expoIcon from "../assets/technologies/expo.svg";
import dockerIcon from "../assets/technologies/docker.svg";
import gitTechIcon from "../assets/technologies/git.svg";
import jestTechIcon from "../assets/technologies/jest.svg";
import unityIcon from "../assets/technologies/unity.svg";
import azureIcon from "../assets/technologies/azure.svg";
import nestIcon from "../assets/technologies/nestjs.svg";

export interface Skill {
	label: string;
	icon?: any;
}

export const allSkills: Skill[] = [
	{ label: "Astro", icon: astroIcon },
	{ label: "React", icon: reactIcon },
	{ label: "TypeScript", icon: typescriptIcon },
	{ label: "Node.js", icon: nodeIcon },
	{ label: "Express", icon: expressIcon },
	{ label: "Prisma", icon: prismaIcon },
	{ label: "PostgreSQL", icon: postgresIcon },
	{ label: "MongoDB", icon: mongoIcon },
	{ label: "FastAPI", icon: fastapiIcon },
	{ label: "Python", icon: pythonIcon },
	{ label: "React Native", icon: expoIcon },
	{ label: "Docker", icon: dockerIcon },
	{ label: "Git", icon: gitTechIcon },
	{ label: "Unity (C#)", icon: unityIcon },
	{ label: "Jest", icon: jestTechIcon },
	{ label: "Azure", icon: azureIcon },
	{ label: "NestJs", icon: nestIcon },
];
