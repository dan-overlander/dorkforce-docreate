export const clearChildren = (targetEl: HTMLElement): void => {
    const elChildren = Array.from(targetEl.children);
    elChildren.forEach(c => {
        c.remove();
    });
};
