let stylesCreated: string[] = [];

export const doClass = {
    add: (styles: string): void => {
        const styleId = styles.substring(0, styles.indexOf('{'))
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/ /g, '_');
        const fullStyleId = `${styleId}-style`;

        if (stylesCreated.includes(fullStyleId)) {
            return;
        }

        stylesCreated.push(fullStyleId);

        const css = document.createElement('style');
        css.id = fullStyleId;
        css.type = 'text/css';
        
        // Modern way to add styles.
        css.appendChild(document.createTextNode(styles));

        document.getElementsByTagName("head")[0].appendChild(css);
    },
    remove: (styles: string): void => {
        const styleId = styles.substring(0, styles.indexOf('{'))
            .replace(/[^\w\s]/gi, '')
            .trim()
            .replace(/ /g, '_');
        const fullStyleId = `${styleId}-style`;

        if (stylesCreated.includes(fullStyleId)) {
            stylesCreated = stylesCreated.filter(item => item !== fullStyleId);
            const element = document.getElementById(fullStyleId);
            element?.remove();
        }
    },
};
