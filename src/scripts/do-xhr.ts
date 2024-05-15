// Define an interface for options used in fetch and request functions
interface RequestOptions {
    url: string;
    method?: string;
    data?: any; // Consider specifying a more specific type depending on the expected data
    headers?: Record<string, string>;
    server?: string; // Include if server is used differently from url
}

export const doXhr = {
    fetch: async (input: string | RequestOptions) => {
        const options: RequestOptions = typeof input === 'string' ? { url: input } : input;
    
        const optUrl = options.server || options.url;
        const optMethod = options.method || 'GET';
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
            // Return a suitable default or handle the error appropriately
            return null; // Or handle it differently based on your application's needs
        }
    },

    request: (input: string | RequestOptions) => {
        // Determine if input is a string or RequestOptions and adjust accordingly
        const options: RequestOptions = typeof input === 'string' ? { url: input } : input;
    
        const method = options.method || 'GET';
        const url = options.server || options.url;
        const data = options.data || {};
        const headers = options.headers || {};
    
        // Instead of returning, use promise rejection to signal an error
        if (!url) {
            console.error('doXhr: URL is required');
            return Promise.reject(new Error('URL is required')); // Properly reject the promise if URL is missing
        }
    
        const xhr = new XMLHttpRequest();
        return new Promise<{ status: number, response: string }>((resolve, reject) => {
            xhr.open(method, url, true);
            xhr.onload = () => resolve({
                status: xhr.status,
                response: xhr.responseText
            });
            xhr.onerror = () => reject(new Error('Network error'));
    
            // Set headers
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
    
            if (method !== "GET" && Object.keys(data).length) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    },
    

    post: async (url: string, data: any, headers: Record<string, string> = {}) => {
        return doXhr.fetch({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        });
    },
}
