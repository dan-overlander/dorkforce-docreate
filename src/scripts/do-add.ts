import * as DDS from "@dds/components";
import { doElement } from "./do-element";
import { capitalize } from "./utils/capitalize";

export const doAdd = (DCR: any, options: any = {}) => {
  if (!options) {
    options = {};
  }
  if (typeof options === `string`) {
    options = {
      method: options,
    };
  }
  const optMethod = options.method;
  const optOptions = options.options || {};
  const optDdsOptions = options.ddsOptions;
  let optParent;
  if (options.target && !options.parent) {
    options.parent = options.target;
  }
  if (typeof options.parent === `string`) {
    optParent = document.querySelector(options.parent);
  } else {
    optParent = options.parent || document.querySelector(`body`);
  }

  // Should this stay !options.parent ?
  if (!optOptions.parent) {
    optOptions.parent = optParent;
  }

  // tell other doCreate methods that we're automatically initializing this component...
  optOptions.isInternal = true;

  let newEl;
  if (DCR[optMethod]) {
    newEl = DCR[optMethod](optOptions);
  } else {
    newEl = doElement(optMethod);
  }
  if (!newEl) {
    console.error(`DO: Error creating element ${optMethod}`);
    return;
  }
  if (!document.getElementById(newEl.id)) {
    optParent.appendChild(newEl);
  }
  const ddsMethod = capitalize(optMethod);
  if (DDS[ddsMethod]) {
    if (
      !newEl.getAttribute(`data-dds`) &&
      newEl.querySelector(`[data-dds]:not([data-dds=""])`)
    ) {
      newEl = newEl.querySelector(`[data-dds]:not([data-dds=""])`);
    }
    DDS[ddsMethod](newEl, optDdsOptions);
    if (newEl.api) {
      Object.keys(newEl.api).forEach((key) => {
        if (newEl[ddsMethod]) {
          newEl[ddsMethod][key] = newEl.api[key];
        } else {
          newEl[key] = newEl.api[key];
        }
      });
      delete newEl.api;
    }
    const newComp = newEl[ddsMethod];
    if (newComp) {
      newComp.ddsOptions = optDdsOptions;
    }
    if (newEl.doCallback) {
      newEl.doCallback();
      newEl.doCallback = null;
    }
    return newComp || newEl;
  }
  return newEl;
};
