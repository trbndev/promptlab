import { AppSidebar } from "@/components/app-sidebar";
import { PipelineProcessor } from "@/components/pipeline-processor";
import DotPattern from "@/components/ui/dot-pattern";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PLTLProvider } from "@/lib/context";
import { cn } from "@/lib/utils";

export default function App() {
	return (
		<PLTLProvider>
			<SidebarProvider>
				<div className="w-dvw h-dvh flex">
					<PipelineProcessor />
					<AppSidebar />
					<DotPattern
						className={cn(
							"[mask-image:radial-gradient(4000px_circle_at_center,white,transparent)]",
						)}
					/>
				</div>
			</SidebarProvider>
		</PLTLProvider>
	);
}
