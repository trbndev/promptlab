import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { loadTemplates } from "./pltl/loader";
import type { PLTLPipeline, PLTLTemplate } from "./pltl/types";

interface PLTLContextType {
	templates: {
		addons: PLTLTemplate[];
		assistants: PLTLTemplate[];
		prompts: PLTLTemplate[];
	} | null;
	pipeline: PLTLPipeline | null;
	setPipeline: (pipeline: PLTLPipeline) => void;
}

const PLTLContext = createContext<PLTLContextType | null>(null);

export function PLTLProvider({ children }: { children: ReactNode }) {
	const [templates, setTemplates] =
		useState<PLTLContextType["templates"]>(null);
	const [pipeline, setPipeline] = useState<PLTLPipeline>({
		basePrompt: null,
		addons: [],
	});
	useEffect(() => {
		loadTemplates().then(setTemplates);
	}, []);

	return (
		<PLTLContext.Provider value={{ templates, pipeline, setPipeline }}>
			{children}
		</PLTLContext.Provider>
	);
}

export function usePLTL() {
	const context = useContext(PLTLContext);
	if (!context) {
		throw new Error("usePLTL must be used within a PLTLProvider");
	}
	return context;
}
