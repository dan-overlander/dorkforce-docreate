// BEGIN export
export const doXhr = {
    fetch: async (options = {}) => {
        if (typeof options === `string`) {
            options = {
                url: options,
            }
        }
        const optUrl = options.server || options.url;
        const optMethod = options.method || `GET`;
        const optData = options.data || {};
        const optHeaders = options.headers || {};
        try {
            const request = await doXhr.request({
                method: optMethod,
                url: optUrl,
                data: optData,
                headers: optHeaders
            });
            return request.response;
        } catch (error) {
            console.error("fetchData fail", error);
        }
    },
    request: (options = {}) => {
        if (typeof options === `string`) {
            options = {
                url: options,
            }
        }

        const method = options.method || `GET`;
        const url = options.server || options.url;
        const data = options.data || {};
        const headers = options.headers || {};

        if (!url) {
            console.error(`doMsg: url needed`);
            return;
        }

        const xhr = new XMLHttpRequest();
        return new Promise((resolve) => {
            xhr.open(method, url, true);
            xhr.onload = () =>
            resolve({
                status: xhr.status,
                response: xhr.responseText
            });
            xhr.onerror = () =>
            resolve({
                status: xhr.status,
                response: xhr.responseText
            });
            if (method != "GET") {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            }
            const headerKeys = Object.keys(headers);
            if (headerKeys.length > 0) {
                headerKeys.forEach(hk => {
                    xhr.setRequestHeader(hk, headers[hk]);
                });
            }

            data != {} ? xhr.send(JSON.stringify(data)) : xhr.send();
        });
    },
    post: async function(url, data, headers = {}) {
        // Utilizing the existing fetch method with method set to POST
        return this.fetch({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        });
    },
}
// END export
