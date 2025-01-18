import type {
	PLTLArgument,
	PLTLMetadata,
	PLTLPipeline,
	PLTLTemplate,
} from "./types";

export class PLTLInterpreter {
	private extractMetadata(content: string): PLTLMetadata {
		const lines = content.split("\n");
		return {
			name:
				lines
					.find((l) => l.startsWith("Name:"))
					?.split(":")[1]
					.trim() ?? "",
			category:
				lines
					.find((l) => l.startsWith("Category:"))
					?.split(":")[1]
					.trim() ?? "",
			author:
				lines
					.find((l) => l.startsWith("Author:"))
					?.split(":")[1]
					.trim() ?? "",
			url:
				lines
					.find((l) => l.startsWith("URL:"))
					?.split(":")[1]
					.trim() ?? "",
		};
	}

	private extractArguments(content: string): PLTLArgument[] {
		const argumentRegex = /{argument name="([^"]+)"}/g;
		const matches = [...content.matchAll(argumentRegex)];
		const uniqueArgs = new Set(matches.map((match) => match[1]));
		// Convert unique names back to PLTLArguments
		return Array.from(uniqueArgs).map((name) => ({
			name,
			value: undefined,
		}));
	}

	private extractContent(content: string): string {
		const contentStart = content.indexOf("Content:") + "Content:".length;
		return content.slice(contentStart).trim();
	}

	parse(fileContent: string): PLTLTemplate {
		const metadata = this.extractMetadata(fileContent);
		const content = this.extractContent(fileContent);
		const args = this.extractArguments(content);

		return {
			metadata,
			content,
			args,
		};
	}

	build(template: PLTLTemplate, args: Record<string, string>): string {
		// Validate all required arguments are provided
		const missingArgs = template.args
			.filter((arg) => !args[arg.name])
			.map((arg) => arg.name);

		if (missingArgs.length > 0) {
			throw new Error(`Missing required arguments: ${missingArgs.join(", ")}`);
		}

		// Replace all arguments in content
		let result = template.content;
		for (const [key, value] of Object.entries(args)) {
			result = result.replace(
				new RegExp(`{argument name="${key}"}`, "g"),
				value,
			);
		}

		return result;
	}

	buildPipeline(pipeline: PLTLPipeline, args: Record<string, string>): string {
		// First, build the base prompt
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		let result = this.build(pipeline.basePrompt!, args);

		// Then apply each addon in sequence
		for (const addon of pipeline.addons) {
			result = this.build(addon, { input: result });
		}

		return result;
	}
}
