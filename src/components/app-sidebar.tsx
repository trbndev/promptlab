import { AuroraText } from "@/components/ui/aurora-text";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";
import SparklesText from "@/components/ui/sparkles-text";
import { usePipelineOperations } from "@/hooks/pltl";
import { usePLTL } from "@/lib/context";

export function AppSidebar() {
	const { templates, pipeline } = usePLTL();
	const { addAddon, removeAddon, replaceBasePLTL, updateArguments } =
		usePipelineOperations();

	// Convert PLTL templates to Combobox items format
	const basePrompts =
		templates?.prompts.map((prompt) => ({
			value: prompt.metadata.name,
			label: prompt.metadata.name,
			category: `Prompts/${prompt.metadata.category || "Other"}`,
		})) ?? [];

	const assistants =
		templates?.assistants.map((assistant) => ({
			value: assistant.metadata.name,
			label: assistant.metadata.name,
			category: `Assistants/${assistant.metadata.category || "Other"}`,
		})) ?? [];

	// Combine prompts and assistants
	const items = [...basePrompts, ...assistants];

	const addons =
		templates?.addons.map((addon) => ({
			id: addon.metadata.name,
			label: addon.metadata.name,
			category: addon.metadata.category || "Other",
			template: addon,
		})) ?? [];

	const handleAddonToggle = (checked: boolean, addon: (typeof addons)[0]) => {
		if (checked) {
			addAddon(addon.template);
		} else {
			removeAddon(addon.id);
		}
	};

	const handleBasePromptSelect = (value: string) => {
		const selectedTemplate = [
			...(templates?.prompts ?? []),
			...(templates?.assistants ?? []),
		].find((t) => t.metadata.name === value);

		if (selectedTemplate) {
			replaceBasePLTL(selectedTemplate);
		}

		// Output the current pipeline
		console.log(pipeline);
	};

	// Get the arguments for the current base prompt, excluding 'input'
	const baseArguments =
		pipeline?.basePrompt?.args.filter((arg) => arg.name !== "input") ?? [];

	const handleArgumentChange = (name: string, value: string) => {
		if (!pipeline?.basePrompt) return;
		updateArguments({ [name]: value });
	};

	return (
		<Sidebar side="right">
			<SidebarHeader className="w-full text-center py-8 select-none">
				<h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl flex gap-2 items-center justify-center">
					<SparklesText text="Prompt" />{" "}
					<AuroraText className="px-1">Lab</AuroraText>
				</h1>
			</SidebarHeader>
			<SidebarContent className="px-4">
				<SidebarGroup>
					<h2 className="text-lg font-bold">Base Prompt</h2>
					<p className="text-sm text-gray-500">
						Base prompts are the main text that is used to generate the output
						prompt.
					</p>
					<Combobox
						items={items}
						placeholder="Select a base prompt..."
						onSelect={handleBasePromptSelect}
					/>
				</SidebarGroup>
				<SidebarGroup>
					<h2 className="text-lg font-bold">Addons</h2>
					<p className="text-sm text-gray-500">
						Addons are additional prompts that can be appended to the base
						prompt.
					</p>
					<div className="space-y-4">
						{Object.entries(
							addons.reduce(
								(acc, addon) => {
									const category = addon.category;
									if (!acc[category]) acc[category] = [];
									acc[category].push(addon);
									return acc;
								},
								{} as Record<string, typeof addons>,
							),
						).map(([category, categoryAddons]) => (
							<div key={category} className="space-y-2">
								<h3 className="text-sm font-medium">{category}</h3>
								<div className="space-y-2">
									{categoryAddons.map((addon) => (
										<div key={addon.id} className="flex items-center space-x-2">
											<Checkbox
												id={addon.id}
												onCheckedChange={(checked) =>
													handleAddonToggle(checked as boolean, addon)
												}
											/>
											<label
												htmlFor={addon.id}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{addon.label}
											</label>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</SidebarGroup>
				<SidebarGroup>
					<h2 className="text-lg font-bold">Arguments</h2>
					<p className="text-sm text-gray-500">
						Arguments are used to customize the output prompt.
					</p>
					<div className="space-y-4">
						{baseArguments.map((arg) => (
							<div key={arg.name} className="space-y-2">
								<Label htmlFor={arg.name} className="capitalize">
									{arg.name.replace(/_/g, " ")}
								</Label>
								<Input
									id={arg.name}
									value={arg.value ?? ""}
									onChange={(e) =>
										handleArgumentChange(arg.name, e.target.value)
									}
									placeholder={`Enter ${arg.name.replace(/_/g, " ")}...`}
								/>
							</div>
						))}
						{baseArguments.length === 0 && (
							<p className="text-sm text-muted-foreground italic">
								No arguments required for this prompt.
							</p>
						)}
					</div>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
