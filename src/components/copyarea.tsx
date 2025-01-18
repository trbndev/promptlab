import {
	type KeyboardEvent,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";

export interface CopyareaRef {
	getValue: () => string;
	setValue: (value: string) => void;
}

interface CopyareaProps {
	className?: string;
	value: string;
}

export const Copyarea = forwardRef<CopyareaRef, CopyareaProps>(
	({ className = "", value }, ref) => {
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		useImperativeHandle(
			ref,
			() => ({
				getValue: () => textareaRef.current?.value ?? "",
				setValue: (value: string) => {
					if (textareaRef.current) {
						textareaRef.current.value = value;
					}
				},
			}),
			[],
		);

		const handleSelect = () => {
			textareaRef.current?.select();
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				handleSelect();
			}
		};

		return (
			<textarea
				ref={textareaRef}
				readOnly
				onClick={handleSelect}
				onKeyDown={handleKeyDown}
				value={value}
				className={`w-full rounded-md border border-gray-300 p-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
			/>
		);
	},
);

Copyarea.displayName = "CopyArea";
