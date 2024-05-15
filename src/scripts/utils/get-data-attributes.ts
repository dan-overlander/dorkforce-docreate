export const getDataAttributes = (options: Record<string, any>): string => {
    const dataAttributes: string[] = [];
    Object.keys(options).forEach(key => {
        if (typeof options[key] !== 'object' && key.startsWith('data-')) {
            dataAttributes.push(`${key}="${options[key]}"`);
        }
    });
    return dataAttributes.join(' ');
};
