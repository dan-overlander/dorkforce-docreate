import { doId } from "../do-id";
import { doElement } from "../do-element";

// Define an interface to describe the structure of the options parameter
interface BadgeOptions {
    id?: string;
    label?: string;
    class?: string;
}

export const badge = (options: BadgeOptions = {}): HTMLElement => {
    const optId = options.id || doId("badge");
    const optLabel = options.label || "";
    const optClass = options.class || "";

    // Create the badge component and label element
    const comp = doElement(`<span id="${optId}" class="dds__badge ${optClass}">`) as HTMLElement;
    const label = doElement(`<span class="dds__badge__label">${optLabel}</span>`) as HTMLElement;

    // Append the label to the component
    comp.appendChild(label);

    return comp;
};
