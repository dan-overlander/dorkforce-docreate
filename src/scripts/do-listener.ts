type EventHandler = (evt: Event) => void;

const listeners = [] as string[];

export const doListener = (selector: string, event: string, handler: EventHandler) => {
    // Assuming rootElement is reliably present (body should always be present)
    const rootElement = document.querySelector('body') as HTMLBodyElement;

    // Generate a unique ID for this event and check if it's already stored
    const listenerId = `${selector}__${event}`;
    // Assume doCreate.utils.listeners is an array of string
    const listenerExists = listeners.includes(listenerId);

    // Define the handler for this listener
    const listenerInstance = function (evt: Event) {
        // Start where the user clicks
        let targetElement = evt.target as HTMLElement | null;
        // Walk up from the click target until there is no parent left
        // If the target matching the selector is found, fire the handler
        while (targetElement !== null) {
            if (targetElement.matches(selector)) {
                handler(evt);
                return;
            }
            targetElement = targetElement.parentElement;
        }
    };

    if (!listenerExists) {
        listeners.push(listenerId);
        rootElement.addEventListener(event, listenerInstance, true);
    }
};
