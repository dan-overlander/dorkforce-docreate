import { sortArrayOfObjects, generateData, make } from "./dodata.js";
const doCreate = { ...DCR.default };
console.log(doCreate);

// The mockServerAPI simulates a server call that returns an object containing data and totalItems
// In this code, data and totalItems are mocked to show an example of the returned object
// The API will need to be properly set up in order to pass data correctly
const mockServerAPI = ({ currentPage, pageSize, sort }) => {
    const totalItems = 1000;

    return new Promise((resolve) => {
        const data = [];

        for (let i = 0; i < pageSize; i++) {
            data.push({
                columns: [{ value: Math.round(Math.random() * 100000) }, { value: doCreate.id(`Gremgoblin`) }, { value: "02/16/2023" }, { value: doCreate.id(`Gravi-Team`) }],
            });
        }

        setTimeout(() => {
            resolve({ data, totalItems });
        }, 250);
    });
};
const fetchData = async ({ currentPage, pageSize, sort }) => {
    try {
        const response = await mockServerAPI({ currentPage, pageSize, sort });
        return { data: response.data, totalItems: response.totalItems };
    } catch (error) {
        console.warn("fetchData fail", error);
    }
};
const debounce = (func, timeout = 780) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};


const handleScroll = (element) => {
    const y = element.getBoundingClientRect().top + window.scrollY;
    window.scroll({
        top: y - 256,
        behavior: 'smooth'
    });
};
const usageHeader = (title) => {
    doCreate.add(`<a id="anchor-${title.toLowerCase()}">`);
    doCreate.add(`<hr class="dds__divider" />${title}`);
};
const usage = {
    icon: () => {
        usageHeader(`Icon`);

        // icon definition -- you CAN do this, or you can have it done for you on demand when you run doCreate.icon (or doCreate.add, method:icon)
        doCreate.iconDef({
            icon: `dds__icon--upload`,
            callback: (svgRes) => {
                // console.log(svgRes);
            }
        });

        doCreate.class.add(`
        .ddsc__icon {
            color: blue;
            transform: scale(2.5);
            position: relative;
            left: 33vw;
        }`);

        const myIcon = doCreate.add({
            method: `icon`,
            options: {
                id: `mycloud`,
                icon: `cloud`,
                class: `ddsc__icon`,
            },
        });
    },
    accordion: () => {
        usageHeader(`Accordion`);
        const myAccordion = doCreate.add({
            method: `accordion`,
            options: {
                items: [{
                    expanded: true,
                    head: `I can't wait for the year 2000!`,
                    body: doCreate.element(`<p>Like the infinite horizon, it eludes my grasp.`),
                }, {
                    head: `Romance By Soos`,
                    body: `<ol>
<li>A woman! All right, Soos, you can do this</li>
<li>Just use your mouth to say words that make romance happen.</li>
<li>Your face is good!</li>
<li>I'm a Soos!</li>
</ol>`,
                }]
            },
            ddsOptions: {
                independent: true,
            }
        });
        myAccordion.appendChild({
            head: `Well, I'm probably scarred for life!`,
            body: `I think I'm gonna go stare at a wall for a while and rethink everything.`,
        });
    },
    actionMenu: () => {
        usageHeader(`ActionMenu`);
        const handle = {
            action: (e) => {
                const target = e.target.closest(`.dds__action-menu__item`);
                const box = target.getBoundingClientRect();
                console.log(target.innerText);
            },
        };

        const myActionMenu = doCreate.add({
            method: `actionMenu`,
            options: {
                class: `dds__action-menu--sm`,
                chevron: true,
                trigger: doCreate.button({
                    label: `Pacifica`,
                }),
                items: [{
                    id: `Corduroy`,
                    label: `Lumberjack`,
                    icon: `airplane`,
                    onclick: handle.action,
                }],
            }
        });
        [`Gideon`, `Bill`, `.GIFfany`].forEach(ac => {
            const popAmItem = doCreate.actionMenuItem({
                label: ac,
                onclick: handle.action,
            })
            myActionMenu.element.appendChild(popAmItem);
        });



        const nextAmContainer = doCreate.element(`<div style="border:1px solid red; padding: 1rem;"></div>`);
        document.body.appendChild(nextAmContainer);
        const billButton = doCreate.add({
            method: `button`,
            parent: nextAmContainer,
            options: {
                id: `billButton`,
                label: `Ask Bill About`,
                class: `dds__button--sm dds__button--tertiary`,
                chevron: {
                    selector: `#productMenu`,
                    open: `ddsActionMenuOpenEvent`,
                    close: `ddsActionMenuCloseEvent`,
                },
            },
        });
        const billActionMenu = doCreate.add({
            method: `actionMenu`,
            options: {
                id: `productMenu`,
                class: `productMenu`,
                trigger: billButton,
                items: [{
                    icon: `gear`,
                    label: `Weirdmageddon`,
                    onclick: handle.action,
                }],
            },
            ddsOptions: {
                placement: `bottom-start`,
            },
        });


        const iconActionMenu = doCreate.add({
            method: `actionMenu`,
            options: {
                id: `amIconMenu`,
                trigger: doCreate.add({
                    method: `button`,
                    options: {
                        id: `amIconButton`,
                        icon: `overflow`,
                        class: `dds__button--mini dds__button--tertiary`,
                    },
                }),
                items: [{
                    icon: `arrow-tri-solid-right`,
                    label: `Hectorgon`,
                    onclick: handle.action,
                }],
            },
            ddsOptions: {
                placement: `bottom-start`,
            },
        });


    },
    badge: () => {
        usageHeader(`Badge`);
        const myBadge = doCreate.add({
            method: `badge`,
            options: {
                label: `👕`
            }
        });
    },
    blockquote: () => {
        usageHeader(`Blockquote`);
        const myBlockquote1 = doCreate.add({
            method: `blockquote`,
            options: {
                quote: `Wait! Don't go! Grenda, was it? I must speak with you. There's something about you, I can't get you out of my head. You're so bold and confident! I know you're probably out of my league, but, might I give you mein phone number?`,
                caption: `Marius von Fundshauser <cite>teenage Austrian baron</cite>`,
                class: `dds__blockquote--end`,
            }
        });
        const myBlockquote2 = doCreate.add({
            method: `blockquote`,
            options: {
                quote: ``,
                author: ``,
                cite: ``,
            }
        });
    },
    breadcrumb: () => {
        usageHeader(`Breadcrumb`);
        const myBreadcrumb = doCreate.add({
            method: `breadcrumb`,
            options: {
                items: [`USA`, `Upper Northwest`, `Oregon`, `Gravity Falls`, `Mystery Shack`],
            }
        });
    },
    button: () => {
        usageHeader(`Button`);
        const myButton = doCreate.add({
            method: `button`,
            options: {
                label: `Smile Dip`,
                type: `submit`,
                title: `Beleven.. teen...`,
                "data-whatever": `goblin`,
                onclick: () => {
                    console.log(`The future is in the past! Onwards, Aoshima!`);
                }
            }
        });
        const myButton2 = doCreate.add({
            method: `button`,
            options: {
                label: `Paper Jam Dipper`,
                disabled: true,
            }
        });
        const myButton3PairsWithMyModal2 = doCreate.add({
            method: `button`,
            options: {
                id: `buttonWithChevron`,
                label: `Grappling Hook!`,
                chevron: {
                    selector: `#linksWithMyButton3`,
                    open: `ddsModalOpenedEvent`,
                    close: `ddsModalClosedEvent`,
                },
            }
        });
        const myIconButton = doCreate.add({
            method: `button`,
            options: {
                icon: `airplane`,
                onclick: (e) => {
                    console.log(`You look nice today!`);
                }
            }
        });
        const myIconButton2 = doCreate.add({
            method: `button`,
            options: {
                label: `eyebat`,
                icon: `eye-view-on`,
                onclick: (e) => {
                    console.log(`Ewww!`);
                }
            }
        });
    },
    card: () => {
        usageHeader(`Card`);
        doCreate.add(`<div id="cards" class="dds__container">
<div class="dds__row">
</div>
</div>`);
        doCreate.add({
            method: `<div class="dds__col--1 dds__col--sm-3 dds__col--md-6 dds__mb-3">
<div id="putCard1Here" class="ddsc__card--container"></div>
</div>`,
            parent: `#cards .dds__row`
        });
        doCreate.add({
            method: `<div class="dds__col--1 dds__col--sm-3 dds__col--md-6 dds__mb-3">
<div id="putCard2Here" class="ddsc__card--container"></div>
</div>`,
            parent: `#cards .dds__row`
        });
        const myCard1 = doCreate.add({
            method: `card`,
            parent: document.getElementById(`putCard1Here`),
            options: {
                id: `cardOne`,
                media: doCreate.element(`<img src="https://assets.codepen.io/434262/Cipher_Hunt_Alex_Hirsch_Bill_Cipher_Statue.webp" alt="Cipher Hunt" class="dds__card__media__item">`),
                title: `Cipher Hunt`,
                icon: `pin`,
                body: `Cipher Hunt was an ARG (alternate reality game) about Gravity Falls, created by series creator Alex Hirsch.`,
                footer: doCreate.element(`<a href="https://gravityfalls.fandom.com/wiki/Cipher_Hunt" target="_blank">Read more on Fandom</a>`),
            },
        });
        const myCard2 = doCreate.add({
            method: `card`,
            parent: document.getElementById(`putCard2Here`),
            options: {
                media: {
                    src: `https://assets.codepen.io/434262/S2e16_mystery_mountain.webp`,
                    alt: `A scene at Mystery Mountain`,
                },
                title: `Mystery Mountain`,
                subtitle: `Fun for some of the family!`,
                icon: `pin`,
                body: `Mystery Mountain is a tourist attraction located on Redwood Highway, Oregon.`,
                footer: [{
                    label: `Mummy Museum`,
                    onclick: () => {
                        console.log(`New Mummies Daily!`);
                    },
                }],
            },
        });
    },
    loadingIndicator: () => {
        usageHeader(`LoadingIndicator`);

        // full page loader
        const myLoadingIndicator = doCreate.add({
            method: `loadingIndicator`,
            options: {
                label: `There's a perfectly logical explanation.`,
            },
        });
        myLoadingIndicator.show();
        setTimeout(() => {
            myLoadingIndicator.hide();
        }, 250);

        // button loader
        const disablingButton = doCreate.add({ // must add a loading indicator to the button; see myLoad2
            method: `button`,
            options: {
                label: `"The Hide-Behind"`,
                onclick: (event) => {
                    event.target.disable();
                    setTimeout(() => {
                        event.target.enable();
                    }, 750);
                },
            }
        });
        const myLoad2 = doCreate.add({
            method: `loadingIndicator`,
            options: {
                id: `disableButtonLoader`,
                parent: disablingButton
            }
        });

        // skeleton loader; going to use cardOne for this
        const togglingButton = doCreate.add({
            method: `button`,
            options: {
                label: `Let the Globnar BEGIN!`,
                onclick: () => {
                    document.getElementById(`cardOneLoader`).show();
                    setTimeout(() => {
                        document.getElementById(`cardOneLoader`).hide();
                    }, 750);
                },
            },
        });
        const myLoad3 = doCreate.add({
            method: `loadingIndicator`,
            options: {
                id: `cardOneLoader`,
                parent: `#cardOne`,
            }
        });
        setTimeout(() => {
            myLoad3.hide();
        }, 2500);
    },
    carousel: () => {
        usageHeader(`Carousel`);
        doCreate.class.add(`
.custom__carousel-example--basic__media {
width: 100%;
height: 100%;
object-fit: cover;
background-color: rgba(0, 0, 0, 0.025);
}`);
        const newContainer = () => {
            const container = doCreate.element(`<div class="dds__container dds__p-0">`);
            container.row = doCreate.element(`<div class="dds__row">`);
            container.row.col01 = doCreate.element(`<div class="dds__col--1 dds__col--sm-3">
                <h5 class="dds__h2 dds__mb-3">${make.title()}</h5>
            </div>`);
            container.row.col01.body = doCreate.element(`<p class="dds__body-2 dds__mb-4">${make.phrase(40)}.</p>`);
            container.row.col01.footer = doCreate.element(`<div class="dds__mb-4">`);
            container.row.col01.footer.cta = doCreate.button({
                class: `dds__button--sm`,
                label: make.title(),
            });
            container.row.col02 = doCreate.element(`<div class="dds__col--1 dds__col--sm-3">`);
            container.row.col02.image = doCreate.element(`<img
                src="https://i.dell.com/sites/csimages/Learn_Imagery/all/565x363-services-splitter-3.jpg"
                eager=""
                fetchpriority="high"
                loading="lazy"
                width="565"
                height="363"
                alt="A person at a desk using a laptop - 1"
                class="custom__carousel-example--basic__media"
            />`);

            container.appendChild(container.row);
            container.row.appendChild(container.row.col01);
            container.row.col01.appendChild(container.row.col01.body);
            container.row.col01.appendChild(container.row.col01.footer);
            container.row.col01.footer.appendChild(container.row.col01.footer.cta);
            container.row.appendChild(container.row.col02);
            container.row.col02.appendChild(container.row.col02.image);
            return container;
        };
        const newCard = () => {
            const body = {};
            body.card = doCreate.card({
                media: doCreate.element(`<img src="https://picsum.photos/id/${make.number(0, 999)}/400/220" alt="${make.title()}" class="dds__card__media__item">`),
                title: make.title(),
                icon: `pin`,
                body: make.phrase(12),
                footer: doCreate.element(`<a href="#" target="_blank">${make.phrase(3)}</a>`),
            });
            return body.card;
        };
        let items = [];
        for (let i = 0; i < 12; i++) {
            items.push({
                body: newCard()
            });
        }

        let carousel00 = doCreate.add({
            method: `carousel`,
            options: {
                items,
            },
            ddsOptions: {
                itemsPerSlide: { "540": 2, "960": 3, "1440": 4 }
            },
        });

        let carousel01 = doCreate.add({
            method: `carousel`,
            options: {
                items: [{
                    body: newContainer()
                }],
            },
        });
        carousel01 = carousel01.add([{
            body: newContainer()
        }, {
            body: newContainer()
        }, {
            body: newContainer()
        }]);
    },
    checkbox: () => {
        usageHeader(`Checkbox`);
        const myCheckbox1 = doCreate.add({
            method: `checkbox`,
            options: {
                label: `I think we just found our loophole!`,
                checked: false,
                "data-test": true,
            }
        });
        myCheckbox1.indeterminate(true);
        const myCheckbox2 = doCreate.add({
            method: `checkbox`,
            options: {
                id: `Mabel`,
                label: `Womp, Womp`,
                checked: true,
                onclick: (e) => {
                    console.log(`${e.target.id} says ${make.quote({ sentences: 1 })}!`)
                },
            }
        });
        myCheckbox2.check(false);
    },
    datepicker: () => {
        usageHeader(`Datepicker`);
        const myDatePicker = doCreate.add({
            method: `datePicker`,
            options: {
                label: `Pines Birthday`,
            }
        });
    },
    drawer: () => {
        usageHeader(`Drawer`);
        const myDrawer = doCreate.add({
            method: `drawer`,
            ddsOptions: {
                width: `500px`,
            },
            options: {
                id: `myDrawer`,
                labels: {
                    trigger: `Mr. Mystery Drawer`,
                    back: `Please`,
                    title: `Disclaimer`,
                    subtitle: `No responsibilities taken`,
                },
                body: doCreate.element(`<p>"Mr. Mystery does not assume liability for disappointment, strange rashes, or accidental plunges into the Bottomless pit. Visitors may experience loss of vision, loss of balance, loss of children, or loss of wallet. Please do not look Mr. Mystery directly in the eye. Not responsible for uncontrolled fits of rage or fits of pants. Remember to tip your waitress. In the event of no waitress, remember to tip your Mr. Mystery. In the even [sic] of no tip, you will be escorted from the premises. Kids’ admission $30 because they smell bad and that one keeps doing that weird thing with his legs. Side effects may include existential quandaries and sudden moral relativism."</p>`),
                footer: doCreate.button({
                    label: `Soos?`,
                    onclick: (() => {
                        myDrawer.body.clearChildren();
                        myDrawer.title.set(`"Give it up, dudes! Your fighting only makes us look more rad!"`);
                        myDrawer.footer.appendChild(doCreate.element(`<span>Yes, I am a soos!</span>`));
                    })
                })
            }
        });
        const manualTrigger = doCreate.add({
            method: `button`,
            options: {
                class: `dds__button--sm ddsc__button--bot`,
                id: `consoleTrigger`,
                label: doCreate.icon({
                    icon: `clipboard-notes`,
                    type: `font`,
                }).outerHTML,
            },
        });
        const myDrawer2 = doCreate.add({
            method: `drawer`,
            options: {
                id: `myDrawer2`,
                trigger: manualTrigger,
                labels: {
                    title: `The Stanchurian Candidate`,
                },
                body: doCreate.element(`<p>"Good! He's saying all the right things!" —America guy</p>`),
            }
        });
    },
    dropdown: () => {
        usageHeader(`Dropdown`);
        const myDropdown = doCreate.add({
            method: `dropdown`,
            options: {
                maxlength: 0,
                label: `TV lied, man`,
                placeholder: `I make the rules, sucka! BOOSH!`,
                helper: `Come on, man.  These are the jokes.`,
                items: [{
                    label: `Gnomes`,
                    value: 0,
                    selected: true,
                }],
                onchange: (e) => alert(e.detail.value)
            },
        });
        [`Puppeteer`, `Mermen`].forEach(pdi => {
            const popDropItem = doCreate.dropdownItem({
                label: pdi,
            })
            myDropdown.element.appendChild(popDropItem);
        });

        const myDropdown2 = doCreate.add({
            method: `dropdown`,
            ddsOptions: {
                selection: "multiple", selectAll: true
            },
            options: {
                label: `Sev'ral Timez is overrated`,
                helper: `Yo I think this is food dawg!`,
                error: `Dude, you gonna share that?`,
                required: true,
                items: [{
                    label: `Creggy G`,
                    value: 1
                }, {
                    label: `Greggy C`,
                    value: 0
                }, {
                    label: `Leggy P`,
                    value: 3
                }, {
                    label: `Chubby Z`,
                    value: 4
                }, {
                    label: `Deep Chris`,
                    value: 5
                }],
            }
        });
    },
    fileInput: () => {
        usageHeader(`FileInput`);

        const myFileInput = doCreate.add({
            method: `fileInput`,
            options: {
                labels: {
                    title: `Manly Dan`
                }
            }
        });
    },
    footnote: () => {
        usageHeader(`Footnote`);
        doCreate.add(`<span>In 2002, Blubs was the county Sheriff and had a large afro.</span>`);
        const myFootnote1 = doCreate.add({
            method: `footnote`,
            options: {
                root: `#footnotes`,
                note: ` "Blendin's Game." Jeff Rowe, Alex Hirsch (writers) & Matt Braly (director). Gravity Falls. Disney XD. November 10, 2014. No. 8, season 2.`,
            },
        });
        doCreate.add(`<div>`);
        doCreate.add(`<span>Exodus demonus, spookus-scareus. Ain'tafraidus Noghostus.</span>`);
        const myFootnote2 = doCreate.add({
            method: `footnote`,
            options: {
                root: `#footnotes`,
                note: ` "Northwest Mansion Mystery." Jeff Rowe, Alex Hirsch, Mark Rizzo (writers) & Matt Braly (director). Gravity Falls. Disney XD. February 16, 2015. No. 10, season 2.`,
            },
        });

    },
    form: () => {
        usageHeader(`Form`);
        doCreate.add({
            method: `form`,
            options: {
                id: `theForm`,
            }
        });
        doCreate.add({
            parent: document.getElementById(`theForm`),
            method: `fieldset`,
            options: {
                id: `theFieldset`,
            }
        });
    },
    link: () => {
        usageHeader(`Link`);
        const myList = doCreate.add({
            method: `link`,
            options: {
                label: make.quote({ sentences: 1 }),
                icon: `airplane`,
            }
        });

    },
    list: () => {
        usageHeader(`List`);
        const myList = doCreate.add({
            method: `list`,
            options: {
                class: `dds__list--unstyled`,
                items: generateData(5, [
                    [`class`, `custom-class`],
                    [`text`, `gibberish`],
                    [`data-value`, `gibberish`],
                ])
            }
        });

    },
    messageBar: () => {
        usageHeader(`MessageBar`);
        const myMessageBar = doCreate.add({
            method: `messageBar`,
            // parent: `#top`,
            options: {
                icon: `download`,
                title: `Mayor Tyler Cutebiker - `,
                body: `says "Git 'em!'"`,
                global: true,
            }
        });
    },
    modal: () => {
        usageHeader(`Modal`);
        const myModal = doCreate.add({
            method: `modal`,
            options: {
                id: `goatPig`,
                labels: {
                    trigger: `Goat and a pig`,
                    title: `Waddles and Gompers`
                },
                body: doCreate.element(`<p>A couple of livestock, livin' the life, stuck together in harmony. A pig and a goat, showing the world that a pig and a goat can be family. Love so strong, love so big, such a beautiful. Goat and a pig. Bound in matrimony now and forever. Shopping for groceries and buying a condo and filing their taxes together. Goat and a pig, goooooat and a pig!</p>`),
                footer: doCreate.button({
                    label: `Oink`,
                    onclick: (() => {
                        myModal.close();
                    })
                })
            }
        });
        const manualModalTrigger = doCreate.add({
            method: `button`,
            options: {
                label: `CRAY CRAY`
            }
        });
        const manualModal = doCreate.add({
            method: `modal`,
            options: {
                class: `dds__modal--lg`,
                labels: {
                    title: `CRAY CRAY`
                },
                body: `Oh, girl you got me ackin' so cray cray
        CRAY CRAY
        You tell me that you won't be my ba-bay
        We're non threatening, girl
        Yeah!`,
                trigger: manualModalTrigger,
                onclick: () => {
                    setTimeout(() => {
                        manualModal.appendChild(doCreate.element(`<p style="margin-top:1rem;">You been danced at, yo!`));
                    }, 1250);
                }
            }
        })
        const myModal2 = doCreate.add({
            method: `modal`,
            options: {
                id: `linksWithMyButton3`,
                trigger: `#buttonWithChevron`,
                labels: {
                    title: `Waddles and Gompers`
                },
                body: doCreate.element(`<p>A couple of livestock, livin' the life, stuck together in harmony. A pig and a goat, showing the world that a pig and a goat can be family. Love so strong, love so big, such a beautiful. Goat and a pig. Bound in matrimony now and forever. Shopping for groceries and buying a condo and filing their taxes together. Goat and a pig, goooooat and a pig!</p>`),
            }
        });
    },
    moreLess: () => {
        usageHeader(`MoreLess`);
        const myMoreLess = doCreate.add({
            method: `moreLess`,
            options: {
                label: `Oh No She Di'nt`,
                body: `features a woman in a purple dress and tan belt in a sassy pose on a green DVD case. The title of the movie appears on the cover as if she's speaking, in the form of a word balloon. The top of the spine also has a purple "W."`,
            },
        });
        document.body.appendChild(doCreate.element(`<hr />`));
        const myMoreLess2 = doCreate.add({
            method: `moreLess`,
            options: {
                labels: {
                    more: `What might be inside?`,
                    less: `Pay $50 to get out`,
                },
                type: `list`,
                body: doCreate.element(`<ol class="dds__more-less__target">
        <li><span>Wax Sherlock Holmes</span></li>
        <li><span>Wax Larry King</span></li>
        <li><span>Wax Coolio</span></li>
        <li><span>Wax Richard Nixon</span></li>
        <li hidden="true"><span>Wax Abraham Lincoln</span></li>
        <li hidden="true"><span>Wax John Wilkes Booth</span></li>
        <li hidden="true"><span>Wax Groucho Marx</span></li>
        <li hidden="true"><span>Wax William Shakespeare</span></li>
        <li hidden="true"><span>Wax Genghis Khan</span></li>
        <li hidden="true"><span>Wax Lizzie Borden</span></li>
        <li hidden="true"><span>Wax Queen Elizabeth II</span></li>
        <li hidden="true"><span>Wax Robin Hood</span></li>
        <li hidden="true"><span>Wax Thomas Edison</span></li>
        <li hidden="true"><span>Wax Edgar Allan Poe</span></li>
      </ol>`),
            }
        });
        document.body.appendChild(doCreate.element(`<hr />`));
        const myMoreLess3 = doCreate.add({
            method: `moreLess`,
            options: {
                type: `bottom`,
                label: `Staircase entryway`,
                intro: `It is a relatively small entryway which features a stuffed "dodo" perched on a table and a ball hanging in a net from the ceiling. This room has four exits besides the staircase that leads upstairs.`,
                body: `First is the exit to the back porch. The second is a door that leads to a hallway past the stairs. The third is the doorway to the living room. And the fourth is a doorway to the kitchen directly in front of the stairs.`,
            },
        });
        document.body.appendChild(doCreate.element(`<hr />`));
        const myMoreLess4 = doCreate.add({
            method: `moreLess`,
            options: {
                type: `inline`,
                label: `Pitt Cola`,
                intro: `Pitt Cola is a peach-flavored soda, and the most popular soft drink in Gravity Falls. It is mostly the characters' favorite beverage. `,
                body: `Stan and Dipper Pines frequently drink it, the empty cans are visible lying around the Mystery Shack, and they are featured in every vending machine in Gravity Falls. One of its slogans is: 'It's the pitts!' `,
            },
        });
    },
    notification: () => {
        usageHeader(`Notification`);
        const myNotification = doCreate.add({
            method: `notification`,
            options: {
                title: `Melody`,
                close: true,
                // open: true, // different than "close"
                messageBody: doCreate.element(`<div>Hoo-Ha Owl's Pizzamatronic Jamboree</div>`),
            },
        });
        const notiShow = doCreate.add({
            method: `button`,
            options: {
                label: `Show`,
                onclick: () => {
                    myNotification.show();
                }
            }
        });
        const notiHide = doCreate.add({
            method: `button`,
            options: {
                label: `Hide`,
                onclick: () => {
                    myNotification.hide();
                }
            }
        });
    },
    popover: () => {
        usageHeader(`Popover`);
        const myPopoverTrigger = doCreate.add({
            method: `button`,
            options: {
                label: `Beep. Boop.`,
            }
        });
        const myPopover = doCreate.add({
            method: `popover`,
            options: {
                trigger: `#${myPopoverTrigger.id}`,
                callback: (popoverBody) => {
                    popoverBody.appendChild(doCreate.element(`<span >I am a nerd robot.</span>`));
                },
            }
        });
        const mySecondPopover = doCreate.add({
            method: `popover`,
            options: {
                trigger: doCreate.add({
                    method: `button`,
                    options: { label: `Soos, it's three in the morning` }
                }),
                body: `Okay, okay, so it turns out that the second Stan, the Stan that, we know, was actually, Stanley but the first Stan, was Stanford, but we didn't know, until, that Stanford came out of the portal, which was built by Stanford, but then Stanley pretended to be Stanford, he, did the portal, cause he's Stan, but he's not Stan.`
            }
        });
        const trigger3 = doCreate.button({
            label: `Sock Opera`,
        });
        const pop3 = doCreate.popover({
            trigger: `#${trigger3.id}`,
            title: `That wet sandwich does look delicious`,
            body: make.quote(),
        });
        document.querySelector(`body`).appendChild(trigger3);
        document.querySelector(`body`).appendChild(pop3);
        DDS.Popover(pop3);

        const TriggerlessPopover = doCreate.add({
            method: `popover`,
            options: {
                body: make.quote()
            }
        });

    },
    progressBar: () => {
        usageHeader(`ProgressBar`);
        const indeterminate = doCreate.add({
            method: `progressBar`,
            options: {
                class: `dds__progress-bar--indeterminate`,
                label: `The Bottomless Pit by Soos.`,
                helper: `My advice: stay at the top and don't fall in.`,
            }
        });
        const myProgress = doCreate.add({
            method: `progressBar`,
            options: {
                label: `Who is The Author?`,
                helper: `Stanford "Ford" Filbrick Pines`,
            },
            ddsOptions: {
                currentValue: 25
            },
        });
        setTimeout(() => {
            myProgress.setProgress(76);
        }, 10000);
    },
    progressTracker: () => {
        usageHeader(`ProgressTracker`);
        const items = [{
            name: make.title(),
            summary: make.phrase(3),
            onclick: (e) => { console.log(0) },
            complete: true,
        }, {
            name: make.title(),
            summary: make.phrase(3),
            onclick: (e) => { console.log(1) },
            complete: true,
        }, {
            name: make.title(),
            summary: make.phrase(3),
            onclick: (e) => { console.log(2) },
            active: true,
        }, {
            name: make.title(),
            summary: make.phrase(3),
            onclick: (e) => { console.log(3) },
            active: false,
            inactive: true,
        }, {
            name: make.title(),
            summary: make.phrase(3),
            active: false,
        },];
        const myProgressTracker = doCreate.add({
            method: `progressTracker`,
            options: {
                items
            },
        });
        setTimeout(() => {
            myProgressTracker.dispose();
            myProgressTracker.init([{
                name: make.title(),
                summary: make.phrase(3),
                onclick: (e) => { console.log(0) },
                complete: true,
            }, {
                name: make.title(),
                summary: make.phrase(3),
                onclick: (e) => { console.log(1) },
                complete: true,
            }, {
                name: make.title(),
                summary: make.phrase(3),
                onclick: (e) => { console.log(2) },
                complete: true,
            }, {
                name: make.title(),
                summary: make.phrase(3),
                onclick: (e) => { console.log(3) },
                active: true,
            }, {
                name: make.title(),
                summary: make.phrase(3),
                active: false,
            },]);
        }, 6000);
    },
    radioButton: () => {
        usageHeader(`RadioButton`);
        doCreate.add({
            method: `radioButton`,
            options: {
                buttons: [{
                    value: "1",
                    label: `"Guys, if you ask me, this whole thing is a serious load." – Wendy Corduroy`,
                }, {
                    value: "2",
                    label: `"Dude, am I a side character?" – Soos Ramirez`,
                }, {
                    value: "3",
                    label: `"Welcome, one and all, to Weirdmageddon!" – Bill Cipher`,
                },]
            }
        });
    },
    sideNav: () => {
        // sideNav is the one exception where you should not use doCreate.add
        usageHeader(`SideNav`);
        const mySideNav = doCreate.sideNav();
        mySideNav.addMenu({
            id: `root`,
        });
        mySideNav.addItem({
            label: `Home`,
            parent: `root`,
            icon: `home`,
            "data-note": `Questioney, the Question Mark`,
        });
        mySideNav.addGroup({
            id: `peoplegroup`,
            parent: `root`,
            label: `People`,
            icon: `user`,
        });
        mySideNav.addMenu({
            id: `people`,
            parent: `peoplegroup`,
        });
        mySideNav.addItem({
            parent: `people`,
            label: `Dipper Pines`,
        })
        document.querySelector(`body`).appendChild(mySideNav);
        DDS.SideNav(mySideNav);
    },
    search: () => {
        usageHeader(`Search`);
        const mySearch = doCreate.add({
            method: `search`,
            options: {
                label: `"Little Gift Shop of Horrors"`,
            }
        });
    },
    select: () => {
        usageHeader(`Select`);
        doCreate.add({
            method: `select`,
            options: {
                label: `Hands Off`,
                values: [
                    `Archibald Corduroy`,
                    `Beardy`,
                    `Celestabellebethabelle`,
                ],
                selected: `Beardy`,
            }
        });
    },
    table: () => {
        usageHeader(`Table`);
        const myTable = doCreate.add({
            method: `table`,
            options: {
                id: `idTable`,
            },
            ddsOptions: {
                dataSource: { fetchData },
                columns: [{ value: "Ticket ID" }, { value: "Team" }, { value: "Date" }, { value: "Status" }],
                subscribe: ["idPagination"],
                columnFilter: true,
                pagination: {
                    currentPage: 2,
                    rowsPerPage: 8,
                },
            }
        });
        const myTable2 = doCreate.add({
            method: `table`,
            options: {
                id: `id2Table`,
            },
            ddsOptions: {
                expandableRows: true,
                data: [
                    { columns: [{ value: 574704463 }, { value: "GC" }], expandable: true, expandableContent: make.quote() },
                    { columns: [{ value: 675035551 }, { value: "AI/ML" }], expandable: true, expandableContent: make.quote() },
                    { columns: [{ value: 642270261 }, { value: "UMF" }], expandable: true, expandableContent: make.quote() },
                    { columns: [{ value: 710182054 }, { value: "UMF" }], expandable: true, expandableContent: make.quote() },
                ],
                columns: [{ value: "Ticket ID" }, { value: "Team" }],
            }
        });
    },
    pagination: () => {
        usageHeader(`Pagination`);
        const myPagination = doCreate.add({
            method: `pagination`,
            options: {
                id: `idPagination`,
                perPageValues: [4, 8, 12],
                currentPage: 2,
                rowsPerPage: 8,
            },
            ddsOptions: {
                subscribe: ["idTable"],
            }
        });
        const secondPagination = doCreate.add({
            method: `pagination`,
            options: {
                id: `idPagination`,
                perPageValues: [4, 8, 12],
                currentPage: 2,
                rowsPerPage: 8,
            },
            ddsOptions: {
                totalItems: 100,
            },
        });
    },
    switch: () => {
        usageHeader(`Switch`);
        let mySwitchState = true;
        const mySwitch = doCreate.add({
            method: `switch`,
            options: {
                label: make.quote({ sentences: 1 }),
                checked: mySwitchState,
                on: `squish`,
                off: `pop`,
                onclick: (e) => {
                    mySwitchState = !mySwitchState;
                    console.log(mySwitchState);
                },
            },
        });
    },
    tabs: () => {
        usageHeader(`Tabs`);
        let myTabs = doCreate.add({
            method: `tabs`,
            options: {
                id: `myTabs`,
                tabs: [{
                    tab: `Mermando`,
                    pane: `I was swimming with my friends, the mighty dolphins, in the Gulf of Mexico, where I was ensnared! ...The cargo was heading for Gravity Falls. Using all my strength, I tried to escape back home, but it was not to be... I would have died from dehydration, were it not for the kindness of the forest animals.`,
                }, {
                    tab: `Gideon`,
                    pane: doCreate.element(`<p>The shack is hereby signed over to.. SUCK A LEMON LITTLE MAN?!`),
                    selected: true,
                }, {
                    tab: `Mabel`,
                    pane: `I'll be there with you, brother. Whatever happens, I'll be right here, supporting you every step of the–OH MY GOSH A PIG!!!!!`,
                }],
            },
        });
        const newTab = doCreate.tabsItem({
            parentId: myTabs.element.id,
            id: `dearestmabel`,
            tab: `Dearest Mabel`,
            pane: `I truly appreciate that you responded to my correspondence. Sure, it was from a lawyer telling me to "cease and desist", but it's the thought that counts!

You can only count the 246 bricks in your prison cell so much. Did you know that you can make fruit punch in a prison toilet? And you won't believe where I can make a peach cobbler. Oh, the things that I've learned!

Hope to see 'ya real soon. I'm includin' a little 'ol piece of my hair. And some sweat. Don't forget me.

Love, Lil' Gideon`,
            selected: false,
        });
    },
    tag: () => {
        usageHeader(`Tag`);
        const myTag = doCreate.add({
            method: `tag`,
            options: {
                label: `Grunkle Stan`,
                dismiss: true,
            }
        });
        const myTagIcon = doCreate.add({
            method: `tag`,
            options: {
                ariaLabel: `Airplane`,
                label: doCreate.icon({
                    icon: `airplane`,
                    type: `span`
                }),
            }
        });
    },
    textArea: () => {
        usageHeader(`TextArea`);
        const myTextArea = doCreate.add({
            method: `textArea`,
            options: {
                label: `Society of the Blind Eye`,
                helper: `The Hall of the Forgotten`,
                value: `"GIDEON'S TANTRUMS, MISSPELLED TATTOOS, SHANDRA'S REJECTIONS, SOCIETY'S VIEWS, A FEAR OF WITCHES, A LIFE OF REGRET, THESE ARE THE THINGS THAT THEY TRY TO FORGET."`,
            },
            ddsOptions: {
                counterMax: 162
            }
        });
    },
    textInput: () => {
        usageHeader(`TextInput`);
        const myTextInput = doCreate.add({
            method: `textInput`,
            options: {
                id: `meep`,
                label: `Mabel Pines: “I’m legalizing everything!”`,
                helper: `“Romance is like gum: once it’s lost its flavor, you just cram another one in.” – Mabel Pines`,
                value: `President Mabel`,
                "data-page": 0,
                onchange: (e) => {
                    console.log(`You look nice today!`);
                },
            }
        });
        const myPassword = doCreate.add({
            method: `inputPassword`,
            options: {
                formField: true,
                label: make.quote({ sentences: 1 }),
                helper: make.quote({ sentences: 1 }),
                value: `Dipper Pines`,
            }
        });
        const myPhone = doCreate.add({
            method: `inputMask`,
            options: {
                formField: true,
                label: make.quote({ sentences: 1 }),
                helper: make.quote({ sentences: 1 }),
            },
            ddsOptions: { mask: "(999) 999-9999" },
        });
    },
    timePicker: () => {
        usageHeader(`TimePicker`);
        const myTimePicker = doCreate.add({
            method: `timePicker`,
            options: {
                label: `I am all about that sweet girlfriend label`,
                helper: `So if you want to, call me Mabel`,
                value: `1:00 p.m.`,
            },
            ddsOptions: {
                availableTimes: ["10:00 a.m.", "12:00 p.m.", "4:00 p.m."]
            }
        });
    },
    tooltip: () => {
        usageHeader(`Tooltip`);
        const myTooltipTrigger = doCreate.element(`<a class="dds__mr-3" id="anchor_${doCreate.id()}" href="javascript:void(0);" class="dds__link--standalone">I'll be there with you, brother. Whatever happens--</a>`);
        document.querySelector(`body`).appendChild(myTooltipTrigger);
        const myTooltip = doCreate.add({
            method: `tooltip`,
            options: {
                trigger: myTooltipTrigger,
                icon: false,
                tip: `Omigosh! A Pig!`
            }
        });
        const triggerlessTooltip = doCreate.add({ // autocreates button as needed
            method: `tooltip`,
            options: {
                tip: `“Songs are like hugs that mouths give to ears!” – Mabel Pines`
            }
        });

        const triggerId = make.id();
        const newTrigger = doCreate.element(`<span id="${triggerId}">${make.word()}</span>`);
        document.body.appendChild(newTrigger);

        const manuallyAddedTooltip = doCreate.tooltip({
            trigger: `#${triggerId}`,
            icon: false,
            tip: make.quote({ sentences: 1 }),
        });
        document.body.appendChild(manuallyAddedTooltip);
        DDS.Tooltip(manuallyAddedTooltip);
    },
};
const top = document.getElementById(`top`);
Object.keys(usage).forEach(key => {
    usage[key]();
    const linkId = `linkto-${key.toLowerCase()}`;
    top.appendChild(doCreate.element(`<a id="${linkId}" class="ddsc__link" data-target="anchor-${key.toLowerCase()}">${key.toLowerCase()}</a>`))
    top.appendChild(doCreate.element(`<span> | </span>`));
    document.getElementById(linkId).addEventListener(`click`, (e) => {
        handleScroll(document.getElementById(e.target.getAttribute(`data-target`)));
    });
});
top.appendChild(doCreate.element(`<span>Total: ${Object.keys(usage).length}`));
doCreate.add(`<div style="height:5rem;">`);

