import Tabs from "@dds/components";
import { doId } from "../do-id";
import { doElement } from "../do-element";

export const tabsItem = (tabInfo) => {
  const parentId = tabInfo.parentId;
  const optId = tabInfo.id || doId(`tab`);
  const tabLabel = tabInfo.tab;
  const tabContent = tabInfo.pane;
  const tabSelected = tabInfo.selected || false;
  const tabId = `${parentId}-${optId}`;

  const li: any = {};
  li.el = doElement(`<li role="none">`);
  li.elButton = doElement(
    `<button id="${tabId}" class="dds__tabs__tab" role="tab" aria-controls="${tabId}-pane" aria-selected="${tabSelected}" tabindex="0">`
  );
  li.elButtonSpan = doElement(
    `<span class="dds__tabs__tab__label" title="${tabLabel}">${tabLabel}</span>`
  );
  li.el.appendChild(li.elButton);
  li.elButton.appendChild(li.elButtonSpan);

  const pane: any = {};
  pane.el = doElement(`<div 
            id="${tabId}-pane"
            class="dds__tabs__pane"
            role="tabpanel"
            tabindex="0"
            aria-labelledby="${tabId}"
            aria-hidden="${!tabSelected}"
        >${typeof tabContent === `string` ? tabContent : ``}`);
  if (typeof tabContent !== `string`) {
    try {
      pane.el.appendChild(tabContent);
    } catch (e) {
      console.error(`DO: failed trying to append tab content`);
    }
  }
  const parentEl: any = document.getElementById(parentId);
  if (parentEl && parentEl.Tabs) {
    parentEl.Tabs.tabs.appendChild(li.el);
    parentEl.Tabs.panes.appendChild(pane.el);
    parentEl.Tabs.dispose();
    parentEl.Tabs = Tabs(document.getElementById(parentId));
  }

  return {
    tab: li.el,
    pane: pane.el,
  };
};
