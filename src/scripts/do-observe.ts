interface Option {
    selector: string | HTMLElement;
    callback: (info: any) => void;
    infinite?: boolean;
}

interface InitOption extends Option {
    options?: IntersectionObserverInit;
}

export const doObserve = {
    addition: function (options: Option[] | Option = [], arg2?: object, arg3?: boolean) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                infinite: arguments[2],
            }];
        }
        let optionArray = Array.isArray(options) ? options : [options];

        function handleFound(elems: Element[], initr: Option) {
            elems.forEach((elem: Element) => {
                if (!elem.id) {
                    elem.id = `elem${doObserve.utils.unique()}`;
                }
                if (!doObserve.utils.additions.includes(elem.id)) {
                    initr.callback({
                        target: elem,
                    });
                    doObserve.utils.additions.push(elem.id);
                }
            });
        }

        const observers: MutationObserver[] = [];
        optionArray.forEach((initr) => {
            observers.push(
                new MutationObserver((mutations, me) => {
                    const targetElems = document.querySelectorAll(initr.selector as string);
                    if (targetElems.length > 0) {
                        handleFound(Array.from(targetElems), initr);
                        if (!initr.infinite) {
                            me.disconnect(); // stop observing
                        }
                    }
                })
            );
        });

        observers.forEach((observer) => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    },

    visibility: function (options: Option[] | Option = []) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                infinite: arguments[2],
            }];
        }
        let optionArray = Array.isArray(options) ? options : [options];

        optionArray.forEach((initr) => {
            const targets = document.querySelectorAll(initr.selector as string);
            if (targets.length === 0) {
                console.error(`DO: visibility error: ${initr.selector} is not found`);
                return;
            }
            targets.forEach(target => {
                const observer =  new MutationObserver((mutations, me) => {
                    initr.callback({
                        target,
                        visible: doObserve.utils.isVisible(target),
                    });
                });
                observer.observe(target, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            });

        });

    },

    intersection: function (options: InitOption[] | InitOption = []) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                options: arguments[2],
            }];
        }
        let optionArray = Array.isArray(options) ? options : [options];

        optionArray.forEach(opt => {
            const elem = typeof opt.selector === `string` ? document.querySelector(opt.selector) : opt.selector;
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    opt.callback(entry.intersectionRatio > 0);
                });
            }, opt.options);
            observer.observe(elem as Element);
        });
    },

    utils: {
        // cleanup: (() => {
        //     new MutationObserver((mutations, me) => {
        //         const keepIds = doObserve.utils.additions.filter(mutateId => document.getElementById(mutateId));
        //         doObserve.utils.additions = keepIds;
        //     }).observe(document.body, {
        //         childList: true,
        //         subtree: true
        //     });
        // })(),
        additions: [] as string[],
        unique: () => {
            const crypto = window.crypto || (window as any).msCrypto;
            let crpValue = crypto.getRandomValues(new Uint32Array(1))[0];
            return crpValue;
        },
        isVisible: (el: Element) => {
            const style = window.getComputedStyle(el);
            return (style.display !== `none`);
        },
    },
};
