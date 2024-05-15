/**
 * Converts kebab-case words into camelCase
 * @param str - a string with some number of dashes
 * @return a camelCase version of whatever string was entered
 */
export const dashCamel = (str: string): string => {
    return str.replace(/-([a-z])/gi, (match: string, letter: string): string => {
        return letter.toUpperCase();
    });
};