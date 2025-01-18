import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface ComboboxItem {
	value: string;
	label: string;
	category?: string;
}

interface ComboboxProps {
	items: ComboboxItem[];
	placeholder?: string;
	emptyMessage?: string;
	searchPlaceholder?: string;
	className?: string;
	onSelect?: (value: string) => void;
}

export function Combobox({
	items,
	placeholder = "Select item...",
	emptyMessage = "No item found.",
	searchPlaceholder = "Search items...",
	className,
	onSelect,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");

	// Group items by category
	const groupedItems = React.useMemo(() => {
		return items.reduce(
			(groups, item) => {
				const category = item.category || "Other";
				return {
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					...groups,
					[category]: [...(groups[category] || []), item],
				};
			},
			{} as Record<string, ComboboxItem[]>,
		);
	}, [items]);

	const handleSelect = (currentValue: string) => {
		setValue(currentValue === value ? "" : currentValue);
		setOpen(false);
		onSelect?.(currentValue);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", className)}
				>
					{value
						? items.find((item) => item.value === value)?.label
						: placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-full p-0", className)}>
				<Command className="w-full">
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						{Object.entries(groupedItems).map(([category, categoryItems]) => (
							<CommandGroup key={category} heading={category}>
								{categoryItems.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={handleSelect}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === item.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
