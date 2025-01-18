export interface PLTLMetadata {
	name: string;
	category: string;
	author: string;
	url: string;
}

export interface PLTLArgument {
	name: string;
	value?: string;
}

export interface PLTLTemplate {
	metadata: PLTLMetadata;
	content: string;
	args: PLTLArgument[];
}

export interface PLTLPipeline {
	basePrompt: PLTLTemplate | null;
	addons: PLTLTemplate[];
}
