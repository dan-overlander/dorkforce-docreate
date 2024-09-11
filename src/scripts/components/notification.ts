import Notification from "@dds/components";
import { doId } from "../do-id";
import { doElement } from "../do-element";
import { iconDef } from "./icon-def";
import { addApi } from "../utils/add-api";

declare const DDS: any;

interface NotificationHTMLElement extends HTMLElement {
    hide: () => void;
    show: () => void;
}

interface NotificationOptions {
    id?: string;
    class?: string;
    timeStamp?: string | 'now';
    messageBody?: string | HTMLElement;
    body?: string;
    title?: string;
    close?: boolean;
    closeIcon?: boolean;
    primaryActionText?: string;
    secondaryActionText?: string;
    primaryAction?: Function;
    secondaryAction?: Function;
    icon?: string;
    iconType?: 'svg' | 'other';
    open?: boolean;
}

interface NotificationData {
    closeIcon: boolean;
    title: string;
    messageBody: string | HTMLElement;
    timeStamp: string;
    primaryActionText: string;
    secondaryActionText: string;
    titleIcon: string;
    titleIconType: string;
    primaryAction?: Function;
    secondaryAction?: Function;
}

export const notification = (options: NotificationOptions = {}) => {
    const optId = options.id || doId(`notification`);
    const optClasses = options.class ? options.class.split(` `) : [];
    const optTimeStamp = options.timeStamp === `now` ? new Date().toTimeString().substring(0, 5) : options.timeStamp || ``;
    const optBody = options.messageBody || options.body || `Notification`;
    const optTitle = options.title || ``;
    const optClose = options.close == null && options.closeIcon == null ? true : options.close || options.closeIcon || false;
    const optPrimaryActionText = options.primaryActionText || ``;
    const optSecondaryActionText = options.secondaryActionText || ``;
    const optPrimaryAction = options.primaryAction;
    const optSecondaryAction = options.secondaryAction;
    const optIcon = options.icon ? `dds__icon--${options.icon.replace('dds__icon--', '')}` : `dds__icon--alert-info-cir`;
    const optIconType = options.iconType || `svg`;
    const optOpen = options.open != null ? options.open : false;

    if (optIconType === `svg`) {
        iconDef({ icon: optIcon });
    }

    const data: NotificationData = {
        closeIcon: optClose,
        title: optTitle,
        messageBody: optBody,
        timeStamp: optTimeStamp,
        primaryActionText: optPrimaryActionText,
        secondaryActionText: optSecondaryActionText,
        titleIcon: optIcon,
        titleIconType: optIconType,
    };

    if (optPrimaryAction) {
        data.primaryAction = optPrimaryAction;
    }

    if (optSecondaryAction) {
        data.secondaryAction = optSecondaryAction;
    }

    let notification: any | undefined;

    const comp = doElement(`<span id="${optId}-trigger">`) as HTMLElement;
    addApi({
        target: comp,
        api: {
            show: () => {
                if (!notification) {
                    notification = new Notification(data);
                    setTimeout(() => {
                        if (typeof optBody !== 'string') {
                            notification.element.querySelector(`.dds__notification__message`).appendChild(optBody);
                        }
                        if (notification.element) {
                            notification.element.id = optId;
                            optClasses.forEach(oClass => notification.element.classList.add(oClass));
                        }
                    });
                }
            },
            hide: () => {
                if (notification) {
                    try {
                        notification.hide();
                    } catch (e) {
                        console.error(e);
                    }
                    if (notification.element) {
                        notification.element.remove();
                    }
                    comp.remove();
                    notification = undefined;
                }
            },
        }
    });

    if (optOpen) {
        if ('show' in comp) {
            (comp as NotificationHTMLElement).show();
        }
    }

    return comp;
};
