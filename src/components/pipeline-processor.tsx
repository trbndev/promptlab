import { Copyarea } from "@/components/copyarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePLTL } from "@/lib/context";
import { PLTLInterpreter } from "@/lib/pltl/interpreter";
import { MessageCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PipelineProcessor() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const { pipeline } = usePLTL();
	const interpreter = useRef(new PLTLInterpreter());

	useEffect(() => {
		if (!pipeline?.basePrompt) return;

		try {
			const result = interpreter.current.buildPipeline(pipeline, {
				input,
				...Object.fromEntries(
					pipeline.basePrompt.args
						.filter((arg) => arg.name !== "input")
						.map((arg) => [arg.name, arg.value ?? ""]),
				),
			});
			setOutput(result);
		} catch (error) {
			setOutput(error as string);
		}
	}, [input, pipeline]);

	const handleOpenChatGPT = () => {
		if (!output) return;

		const chatGPTUrl = `https://chatgpt.com/?q=${encodeURIComponent(output)}`;
		window.open(chatGPTUrl, "_blank");
	};

	return (
		<div className="flex flex-col flex-grow z-20">
			<div className="p-4 flex flex-col gap-4 flex-grow">
				<Label className="text-lg">Input Prompt</Label>
				<Textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Enter your prompt here..."
					className="h-full"
				/>
			</div>
			<div className="p-4 flex flex-col gap-4 flex-grow">
				<Label className="text-lg">Output Prompt</Label>
				<Copyarea className="h-full" value={output} />
				<Button
					onClick={handleOpenChatGPT}
					className="w-full flex justify-center items-center gap-2"
					disabled={!output}
				>
					<MessageCircleIcon />
					<span>Open in ChatGPT</span>
				</Button>
			</div>
		</div>
	);
}
