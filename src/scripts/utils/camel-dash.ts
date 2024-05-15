/*
* converts camelCased words into dashed-cased ones
* @param {string} key - a string with some number of capitalized letters
* @return {string} a dashed version of whatever string was entered
*/
export const camelDash = (key: string) => {
    let conversion = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    if (conversion.indexOf(`-`) === 0) {
        conversion = conversion.replace(`-`, ``);
    }
    return conversion;
};