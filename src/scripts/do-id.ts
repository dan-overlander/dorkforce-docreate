import { doRandom } from "./do-random";

export const doId = (custom = "") => {
  let newId = "";
  const notSupplied = custom === "";
  if (notSupplied) {
    newId = ["a", "b", "c", "d", "e"][doRandom(0, 5)];
    newId = `${newId}-${doRandom()}`;
  } else {
    newId = custom.replace(/[^\w\s]/gi, "");
    newId = newId.replace(/ /g, ``);
  }
  return newId;
};
