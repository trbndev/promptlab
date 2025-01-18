import { usePLTL } from "../lib/context";
import type { PLTLPipeline, PLTLTemplate } from "../lib/pltl/types";

export function usePipelineOperations() {
	const { pipeline, setPipeline } = usePLTL();

	const rebuildPipeline = (newPipeline: PLTLPipeline) => {
		// Trigger rebuild logic here
		setPipeline({ ...newPipeline });
	};

	const addAddon = (addon: PLTLTemplate) => {
		if (!pipeline) return;

		const newPipeline = {
			...pipeline,
			addons: [...pipeline.addons, addon],
		};

		rebuildPipeline(newPipeline);
	};

	const removeAddon = (addonName: string) => {
		if (!pipeline) return;

		const newPipeline = {
			...pipeline,
			addons: pipeline.addons.filter(
				(addon) => addon.metadata.name !== addonName,
			),
		};

		rebuildPipeline(newPipeline);
	};

	const replaceBasePLTL = (newBase: PLTLTemplate) => {
		if (!pipeline) return;

		const newPipeline = {
			...pipeline,
			basePrompt: newBase,
		};

		rebuildPipeline(newPipeline);
	};

	const clearAddons = () => {
		if (!pipeline) return;

		const newPipeline = {
			...pipeline,
			addons: [],
		};

		rebuildPipeline(newPipeline);
	};

	const updateArguments = (newArgs: Record<string, string>) => {
		if (!pipeline?.basePrompt) return;

		const newPipeline = {
			...pipeline,
			basePrompt: {
				...pipeline.basePrompt,
				args: pipeline.basePrompt.args.map((arg) => ({
					...arg,
					value: newArgs[arg.name] ?? arg.value,
				})),
			},
		};

		rebuildPipeline(newPipeline);
	};

	return {
		addAddon,
		removeAddon,
		replaceBasePLTL,
		clearAddons,
		updateArguments,
		pipeline,
	};
}
