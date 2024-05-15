import { doId } from "../do-id";
import { doElement } from "../do-element";

// Define an interface for the blockquote options
interface BlockquoteOptions {
    id?: string;
    class?: string;
    quote?: string;
    caption?: string;
    author?: string;
    cite?: string;
}

export const blockquote = (options: BlockquoteOptions = {}): HTMLElement => {
    const optId = options.id || doId("blockquote");
    const optClass = options.class || "";
    const optQuote = options.quote || "";
    const optCaption = options.caption;
    const optAuthor = options.author || "";
    const optCite = options.cite || "";

    // Create main figure element
    const comp = doElement(`<figure id="${optId}" class="dds__blockquote ${optClass}">`) as HTMLElement;
    const bquote = doElement(`<blockquote>`) as HTMLElement;
    const bquoteP = doElement(`<p>${optQuote}</p>`) as HTMLElement;

    // Determine if a caption or author/cite should be used
    let fig: HTMLElement;
    if (optCaption !== undefined) {
        const captionDash = optCaption.length > 0 ? "— " : "";
        fig = doElement(`<figcaption>${captionDash}${optCaption}</figcaption>`) as HTMLElement;
    } else {
        const citeDash = optAuthor.length > 0 || optCite.length > 0 ? "— " : "";
        fig = doElement(`<figcaption>${citeDash}${optAuthor} </figcaption>`) as HTMLElement;
        if (optCite) {
            const cite = doElement(`<cite>${optCite}</cite>`) as HTMLElement;
            fig.appendChild(cite);
        }
    }

    // Build the blockquote structure
    comp.appendChild(bquote);
    comp.appendChild(fig);
    bquote.appendChild(bquoteP);

    return comp;
};
