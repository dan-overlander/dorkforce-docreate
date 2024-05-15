import { doId } from "../do-id";
import { iconDef } from "./icon-def";
import { doElement } from "../do-element";

export const icon = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`icon`);
    const optClass = options.class || ``;
    const optType = options.type || `svg`;
    let optIcon = options.icon || `dds__icon--accessibility`;
    if (optIcon.indexOf(`dds__icon--`) < 0) {
        optIcon = `dds__icon--${optIcon}`;
    }

    if (!document.getElementById(optIcon)) {
        iconDef({
            icon: optIcon
        });
    }
    if (optType === `svg`) {
        noo.icon = doElement(`<svg id="${optId}" class="dds__icon ${optClass}" focusable="false"><use xlink:href="#${optIcon}"></use></svg>`);
    } else {
        noo.icon = doElement(`<${optType} id="${optId}" class="dds__icon ${optClass} ${optIcon}">`);
    }

    return noo.icon;
};