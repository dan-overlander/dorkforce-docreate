export const doMsg = {
    init: (() => {
        DCR.default.class(`
            .doMsg {
                display: none;
            }
        `);
        DCR.default.class(`
            .doMsg__notification {
                background: aliceblue !important;  
            }
            .doMsg__notification--error {
                background: MistyRose !important;
            }
            .doMsg__notification--warn {
                background: Seashell !important;
            }
            .doMsg__log__title {
                font-weight: bold;
                font-family: Courier New;
            }
            .doMsg__notification__icon {
                cursor: pointer;
            }
            .doMsg__notification__icon {
                width: 1rem !important;
                height: 1rem !important;
            }
            .ddsc__button--bot {
                position: fixed;
                right: 1rem;
                bottom: 1rem;
                height: 2rem;
                z-index: 1049;
            }
            .doMsg__log__time {
                font-weight: bold;
            }
            .ddsc__notification__message {
                max-width: 20rem !important;
                overflow-x: hidden;
            }
        `);
        setTimeout(() => {
            document.getElementById(`doMsgTrigger`).addEventListener(`click`, doMsg.handle.history.add);
        });
    })(),
    handle: {
        history: {
            add: () => {
                doMsg.elements.drawer.body.innerHTML = "";
                doMsg.utils.history.reverse().forEach(h => {
                    const titleElStr = (h.title !== doMsg.default.title) ? `<div class="doMsg__log__title">${h.title}</div>` : ``;
                    const timeStampElStr = `<span class="doMsg__log__time">${h.timeStamp}</span>`;
                    doMsg.elements.drawer.body.innerHTML += 
                        `${titleElStr}<p>${timeStampElStr}: ${h.msg}<br /></p>`;
                });
            },
        },
        more: {
            click: (e) => {
                doMsg.handle.history.add();
                doMsg.elements.drawer.open();
            },
        },
    },
    elements: {
        body: document.querySelector(`body`),
        trigger: DCR.default.add({
            method: `button`,
            options: {
                class: `doMsg dds__button--sm ddsc__button--bot`,
                id: `doMsgTrigger`,
                label: DCR.default.icon({
                    icon: `help-cir`,
                    type: `font`,
                }).outerHTML,
            },
        }),
        drawer: DCR.default.add({
            method: `drawer`,
            options: {
                id: `doMsgDrawer`,
                class: `doMsg`,
                trigger: `#doMsgTrigger`,
                labels: {
                    title: `Console Log`,
                },
            }
        }),
    },
    error: (options = {}) => {
        if (typeof options === `string` || !options.msg) {
            options = {
                msg: options
            }
        }
        options.class = `${options.class} doMsg__notification--error`;
        return doMsg.log(options);
    },
    log: (options = {}) => {
        let doReturn;
        if (typeof options === `string` || !options.msg) {
            options = {
                msg: options
            }
        }
        const optTitle = options.title || doMsg.default.title;
        const optClass = options.class || `doMsg__notification`;
        let optMsg = options.msg;
        let displayMsg;
        let cloneMsg = optMsg;
        const optTimeout = typeof options.close === "number" ? Number(options.close) : 5000;
        const optClose = typeof options.close === "number" ? false : options.close || false;
        const optNext = options.next;
        const optVisible = options.visible == null ? true : options.visible;
        const optQuiet = options.quiet;
        if (!optQuiet) {
            console.log(optTitle, optMsg);
        }

        // manage history
        doMsg.utils.history.push({
            timeStamp: (() => {const d = new Date(); return `${d.getHours()}:${`0${d.getMinutes()}`.slice(-2)}`;})(),
            msg: optMsg.querySelector != null ? optMsg.innerHTML :
                 typeof optMsg === `string` ? optMsg : JSON.stringify(optMsg),
            title: optTitle,
        });

        if (optMsg.constructor === Array) {
            displayMsg = ``;
            optMsg.forEach(om => {
                if (typeof om === `string`) {
                    displayMsg += `${om}<br>`;
                } else {
                    displayMsg += `${JSON.stringify(om)}<br>`;                    
                }
            });
        } else if (optMsg.querySelector == null) {
            optMsg = JSON.stringify(optMsg);
            // shorten message for Notification window
            const lineLength = 48;
            if (cloneMsg.length > lineLength) {
                displayMsg = ``;
                while (cloneMsg.length > 0) {
                    const moveLine = cloneMsg.length > lineLength ? cloneMsg.substr(0, lineLength) : cloneMsg;
                    displayMsg += `${moveLine}<br>`;
                    cloneMsg = cloneMsg.replace(moveLine, ``);
                }
            }
        }


        if (optVisible) {
            const moreIcon = DCR.default.icon({
                icon: `help-cir`,
                class: `doMsg__notification__icon`,
            });
            doReturn = DCR.default.add({
                method: `notification`,
                options: {
                    title: optTitle,
                    class: `doMsg ${optClass}`,
                    close: optClose,
                    messageBody: displayMsg || optMsg,
                    timeStamp: `now`,
                    primaryAction: optNext ? () => {
                        doReturn.hide();
                        optNext();
                    } : doMsg.handle.more.click,
                    primaryActionText: optNext ? `Next` : moreIcon.outerHTML,
                    secondaryAction: optNext ? () => {
                        doReturn.hide();
                    } : undefined,
                    secondaryActionText: optNext ? `End` : undefined,
                },
            });

            doReturn.show();
            setTimeout(() => {
                const generatedNote = document.getElementById(doReturn.id.replace(`-trigger`, ``));
                if (generatedNote) {
                    const message = generatedNote.querySelector(`.dds__notification__message`);
                    message.classList.add(`ddsc__notification__message`);
                }
            });
            if (!optClose && !optNext) {
                setTimeout(() => {
                    doReturn.hide();
                }, optTimeout);
            }
        }
        return doReturn;
    },
    warn: (options = {}) => {
        if (typeof options === `string` || !options.msg) {
            options = {
                msg: options
            }
        }
        options.class = `${options.class} doMsg__notification--warn`;
        return doMsg.log(options);
    },
    open: () => {
        doMsg.handle.more.click();
    },
    default: {
        title: `Notification`,
    },
    utils: {
        history: [],
    },
    complete: (() => {
        setTimeout(() => {
            DCR.default.styleRemove(`
                .doMsg {
                    display: none;
                }
            `);
        }, 500);
    })(),
};
