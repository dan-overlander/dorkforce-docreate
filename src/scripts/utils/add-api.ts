export const addApi = (options: any = {}) => {
    const optTarget = options.target;
    const optApi = options.api;
    const isInternal = options.isInternal;

    if (isInternal) {
        optTarget.api = optApi;
    } else {
        Object.keys(optApi).forEach(method => {
            optTarget[method] = optApi[method];
        });
    }
};