import { browser } from 'wxt/browser';

export function createFetchInjection() {
    browser.scripting.registerContentScripts([{
        id: "network-hook",
        js: ["main-world.js"],
        matches: ["<all_urls>"],
        runAt: "document_start",
        world: "MAIN"
    }]);
    
    const fetchOriginal = window.fetch;

    window.fetch = async (...args) => {
        const startedAt = Date.now();
        const response = await fetchOriginal(...args);
        response.clone().text()
            .then(body => log({ url: response.url, status: response.status, startedAt, body }))
            .catch(() => {})
        return response;
    }
}

function log(log: {url: string, status: number, startedAt: number, body: string}) {
    console.log(log);
}