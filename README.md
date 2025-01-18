# PromptLab ⚡

PromptLab is a powerful prompt engineering and management tool built with React and TypeScript. It allows you to create, test, and manage AI prompts using a pipeline-based approach.

## Features

- 🔄 Pipeline-based prompt processing
- 📝 Rich template management
- 🧩 Modular addon system
- 💾 Real-time preview
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Getting Started

1. Clone the repository:
```sh
git clone https://github.com/yourusername/promptlab.git
cd promptlab
```

2. Install dependencies:
```sh
bun install
```

3. Start the development server:
```sh
bun run dev
```

## Project Structure

- `src/` - Source code
  - `lib/` - Core libraries and utilities
    - `pltl/` - Prompt Lab Template Language implementation
      - `templates/` - Template storage
        - `prompts/` - Base prompt templates
        - `assistants/` - Assistant templates
        - `addons/` - Pipeline addon templates
      - `interpreter.ts` - PLTL interpreter
      - `loader.ts` - Template loader
      - `types.ts` - Type definitions
    - `context.tsx` - React context providers
    - `utils.ts` - Utility functions
  - `components/` - React components
    - `ui/` - Reusable UI components
    - `app-sidebar.tsx` - Sidebar component
    - `copyarea.tsx` - Copy text area
    - `pipeline-processor.tsx` - Pipeline processor
  - `hooks/` - Custom React hooks
    - `pltl.ts` - Pipeline operation hooks
    - `use-mobile.tsx` - Mobile detection hook
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `main.css` - Global styles

The structure follows a modular approach where:
- [`src/lib/pltl`](src/lib/pltl) handles core PLTL functionality
- [`src/components`](src/components) contains all React components
- [`src/hooks`](src/hooks) provides custom hooks for state management

## Usage

1. Select a base prompt from the sidebar
2. Configure any required arguments
3. Add optional addons to modify the output
4. Enter your input text
5. View and copy the processed output

## Pipeline System

The pipeline system allows you to:
- Set a base prompt template
- Add multiple addons
- Configure arguments
- Process input text through the entire pipeline

Example usage with the `usePipelineOperations` hook:

```tsx
const { addAddon, removeAddon, replaceBasePLTL, updateArguments } = usePipelineOperations();

// Set base prompt
replaceBasePLTL(template);

// Add addon
addAddon(addon);

// Update arguments
updateArguments({ key: "value" });
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Biome (Formatting)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ⚡ by Torben Haack