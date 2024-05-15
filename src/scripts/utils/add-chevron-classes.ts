import { doClass } from "../do-class";

export const addChevronClasses = () => {
    doClass.add(`
        .do__chevron {
        margin-left: 0.625rem;
        transition: all .2s ease-in;
        pointer-events: none;
        }

        .do__chevron-rotated {
        transform: rotate(180deg);
        }
    `);
};