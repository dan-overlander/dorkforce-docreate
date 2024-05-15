export const iconName = (iName) => {
    if (iName) {
        return iName ? `dds__icon--${iName.replace('dds__icon--', '')}` : ``;
    }
};