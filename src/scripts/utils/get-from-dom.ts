type Target = string | { id: string };

interface Summary {
    element: HTMLElement | null;
    found: boolean;
}

export const getFromDom = (target: Target | null): Summary | undefined => {
    if (!target) {
        return;
    }

    const summary: Summary = {
        element: null,
        found: false,
    };

    if (typeof target === 'string') {
        if (target.match(/^#/)) {
            // Directly strip off the '#' and fetch the element
            summary.element = document.getElementById(target.slice(1)) || null;
        } else {
            const tryTarget = document.getElementById(target);
            if (tryTarget) {
                summary.element = tryTarget;
            } else {
                summary.element = document.querySelector(target);
            }
        }
    } else if (target.id) {
        // No need to use optional chaining as 'target.id' is already checked for existence
        summary.element = document.getElementById(target.id);
    }

    // Update found property based on whether the element was found
    if (summary.element) {
        summary.found = true;
    }

    return summary;
};
