export const doElement = (blueprint: string, isSvg: boolean | string = false): HTMLElement | SVGElement => {
    const definiteSvgTypes: string[] = [
        "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse",
        "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting",
        "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR",
        "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight",
        "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch",
        "hatchpath", "image", "line", "linearGradient", "marker", "mask", "metadata", "mpath", "path", "pattern",
        "polygon", "polyline", "radialGradient", "rect", "set", "stop", "svg", "switch", "symbol", "text",
        "textPath", "tspan", "use", "view",
    ];
    if (typeof isSvg === 'string') {
        isSvg = isSvg === 'svg' || isSvg === 'true';
    }
    const props: { [key: string]: string } = {};
    const propNames: string[] = [];
    const svgNs = "http://www.w3.org/2000/svg";
    const blueprintOpener = blueprint.substring(0, blueprint.indexOf(">")).trim();
    const blueprintSpaceOrClose = blueprint.match(/( |>)/g);
    let regex;
    let domType;
    let parameters = blueprintOpener.match(/ [^ "]*"/g);
    try {
        let typeLength = blueprintOpener.indexOf(blueprintSpaceOrClose![0]) > 0
            ? blueprintOpener.indexOf(blueprintSpaceOrClose![0])
            : blueprintOpener.length;
        domType = blueprintOpener.substr(0, typeLength).replace("<", "").trim();
        parameters = blueprintOpener.match(/( |\n)[^ "]*="/g);
    } catch (e) {
        console.error(`DO: Blueprint error: ${blueprint}`, e);
    }
    if (definiteSvgTypes.includes(domType)) {
        isSvg = true;
    }
    if (parameters) {
        parameters.forEach(param => {
            if (param.indexOf("=") > -1) {
                param = param.replace("='", "").replace("=\"", "").trim();
                propNames.push(param);
            }
        });
    }
    propNames.forEach(pName => {
        regex = new RegExp(`(${pName}=")[^"]*(")`);
        const pValue = blueprint.match(regex)![0].replace(`${pName}="`, "").replace("\"", "");
        props[pName] = pValue;
    });
    regex = new RegExp(`(<${domType})[^>]*(>)`);
    const opening = blueprint.match(regex)![0];
    const closing = `</${domType}>`;
    const contents = blueprint.replace(opening, "").replace(closing, "");
    if (contents.indexOf("<") > -1) {
        props.html = contents;
    } else {
        props.text = contents;
    }
    let domNode: HTMLElement | SVGElement;
    if (isSvg) {
        domNode = document.createElementNS(svgNs, domType);
    } else {
        domNode = document.createElement(domType);
    }
    for (const prop in props) {
        if (prop === "html") {
            domNode.innerHTML = props[prop];
        } else if (prop === "text") {
            domNode.textContent = props[prop];
        } else {
            if (prop.startsWith("aria_") || prop.startsWith("data_")) {
                const attr = prop.replace("_", "-");
                domNode.setAttribute(attr, props[prop]);
            } else {
                domNode.setAttribute(prop, props[prop]);
            }
        }
        // Set attributes on the element if passed
        if (["role", "aria-label"].includes(prop)) domNode.setAttribute(prop, props[prop]);
    }
    return domNode;
};
