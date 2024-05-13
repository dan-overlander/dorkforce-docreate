// BEGIN export
export const doObserve = {
    addition: function (options = {}) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                infinite: arguments[2],
            }];
        }
        if (options.constructor !== Array) {
            options = [options];
        }

        function handleFound(elems, initr) {
            elems.forEach((elem) => {
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

        // As assistance for delayed initialization, define an observer to watch for changes
        const observers = [];
        options.forEach(function (initr) {
            observers.push(
                new MutationObserver(function (mutations, me) {
                    const targetElems = document.querySelectorAll(initr.selector);
                    if (targetElems.length > 0) {
                        handleFound(targetElems, initr);
                        if (!initr.infinite) {
                            me.disconnect(); // stop observing
                        }
                        return;
                    }
                })
            );
        });

        // start observing
        observers.forEach(function (observer) {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    },
    visibility: function (options = {}) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                infinite: arguments[2],
            }];
        }
        if (options.constructor !== Array) {
            options = [options];
        }

        options.forEach(function (initr) {
            const targets = document.querySelectorAll(initr.selector);
            if (targets.length === 0) {
                console.error(`DO: visibility error: ${initr.selector} is not found`);
                return;
            }
            targets.forEach(target => {
                const observer =  new MutationObserver(function (mutations, me) {
                    initr.callback({
                        target,
                        visible: doObserve.utils.isVisible(target),
                    });
                })
                observer.observe(target, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            });

        });

    },
    intersection: function (options = {}) {
        if (arguments.length > 1) {
            options = [{
                selector: arguments[0],
                callback: arguments[1],
                options: arguments[2],
            }];
        }
        if (options.constructor !== Array) {
            options = [options];
        }

        const observerOptions = {
            ...options.options, 
        }


        options.forEach(opt => {
            if (typeof opt.selector === `string`) {
                if (opt.selector.indexOf(`#`) === 0) {
                    opt.selector = document.getElementById(opt.selector.replace(`#`, ``));
                } else {
                    opt.selector = document.querySelector(opt.selector);
                }
            }
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    const intersecting = entry.isIntersecting;
                    opt.callback(entry.intersectionRatio > 0);
                });
            }, observerOptions);
            observer.observe(opt.selector);
        })
    },
    utils: {
        cleanup: (() => {
            new MutationObserver(function (mutations, me) {
                const keepIds = [];
                doObserve.utils.additions.forEach(mutateId => {
                    if (document.getElementById(mutateId)) {
                        keepIds.push(mutateId);
                    }
                });
                doObserve.utils.additions = keepIds;
            }).observe(document, {
                childList: true,
                subtree: true
            });            
        })(),
        additions: [],
        unique: (custom) => {
            const type = !custom
            ? undefined
            : typeof custom === "string"
            ? "string"
            : typeof custom === "number"
            ? "number"
            : "array";
            const range = (seed, modulo) => {
                return (
                    `${((2 ** 31 - 1) & Math.imul(48271, seed)) / 2 ** 31}`.split("").slice(-10).join("") %
                    modulo
                );
            };

            // @ts-ignore
            let crypto = window.crypto || window.msCrypto; // Math.random is forbidden by Checkmarx
            let crpValue = crypto.getRandomValues(new Uint32Array(10))[0];
            let min;
            let max;
            switch (type) {
                case "string":
                    return `${custom}_${crpValue}`;
                case "number":
                    return range(crpValue, custom);
                case "array":
                    min = typeof custom[0] === "string" ? Number(custom[0]) : custom[0];
                    max = typeof custom[1] === "string" ? Number(custom[1]) : custom[1];
                    return range(crpValue, max - (min - 1)) + min;
                default:
                    return crpValue;
            }
        },
        isVisible: (el) => {
            const style = window.getComputedStyle(el);
            return (style.display !== `none`)
        },
    },
};
// END export
