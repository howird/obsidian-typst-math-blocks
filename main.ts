import { MarkdownView, Plugin, loadMathJax } from "obsidian";
import { typst2tex, tex2typst } from "tex2typst";

function hasLatexCommand(expr: string): boolean {
	const regex = /\\\S/;
	return regex.test(expr);
}

function typst2texHandleNewline(expr: string): string {
	const hasTypstNewlineRegex = /\\\n/g;
	return hasTypstNewlineRegex.test(expr)
		? `\\displaylines{${typst2tex(expr)}}`
		: typst2tex(expr);
}

function convertLatexToTypst(input: string): string {
	let result = input;

	result = result.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
		const trimmed = mathContent.trim();
		if (trimmed && hasLatexCommand(trimmed)) {
			try {
				const converted = tex2typst(mathContent);
				return `$$${converted}$$`;
			} catch (error) {
				return match;
			}
		}
		return match;
	});

	result = result.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
		const trimmed = mathContent.trim();
		if (trimmed && hasLatexCommand(trimmed)) {
			try {
				const converted = tex2typst(trimmed);
				return `$${converted}$`;
			} catch (error) {
				return match;
			}
		}
		return match;
	});

	return result;
}

export default class TypstMathBlocksPlugin extends Plugin {
	// settings: TypstMathBlocksPluginSettings;
	private _tex2chtml;

	async onload() {
		// await this.loadSettings();

		await loadMathJax();

		if (!globalThis.MathJax) {
			throw new Error("MathJax failed to load.");
		}

		this._tex2chtml = globalThis.MathJax.tex2chtml;

		globalThis.MathJax.tex2chtml = (e, r) =>
			this._tex2chtml(
				hasLatexCommand(e) ? e : typst2texHandleNewline(e),
				r,
			);

		this.app.workspace
			.getActiveViewOfType(MarkdownView)
			?.previewMode.rerender(true);

		this.addCommand({
			id: "convert-editor-latex-to-typst",
			name: "Convert current text from LaTeX to Typst",
			editorCallback: (editor) => {
				const currentText = editor.getValue();
				const convertedText = convertLatexToTypst(currentText);
				editor.setValue(convertedText);
			},
		});
	}

	onunload() {
		globalThis.MathJax.tex2chtml = this._tex2chtml;
		this.app.workspace
			.getActiveViewOfType(MarkdownView)
			?.previewMode.rerender(true);
	}

	async loadSettings() {}

	async saveSettings() {}
}
