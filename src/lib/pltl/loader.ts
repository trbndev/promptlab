// src/lib/pltl/loader.ts
import { PLTLInterpreter } from "./interpreter";
import type { PLTLTemplate } from "./types";

interface TemplateCollection {
	addons: PLTLTemplate[];
	assistants: PLTLTemplate[];
	prompts: PLTLTemplate[];
}

export async function loadTemplates(): Promise<TemplateCollection> {
	const interpreter = new PLTLInterpreter();

	// Use import.meta.glob to load all .pltl files
	const files = import.meta.glob("./templates/**/*.pltl", {
		query: "?raw",
		import: "default",
		eager: true,
	});

	const templates: TemplateCollection = {
		addons: [],
		assistants: [],
		prompts: [],
	};

	// Parse each file and categorize
	for (const [path, content] of Object.entries(files)) {
		const template = interpreter.parse(content as string);

		if (path.includes("/addons/")) {
			templates.addons.push(template);
		} else if (path.includes("/assistants/")) {
			templates.assistants.push(template);
		} else if (path.includes("/prompts/")) {
			templates.prompts.push(template);
		}
	}

	return templates;
}
