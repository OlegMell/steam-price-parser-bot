import { JSDOM } from 'jsdom';

export class DOMHelper {

    #dom: JSDOM;

    constructor(pageContent: string) {
        this.#dom = new JSDOM(pageContent);
    }

    getTextFrom(selector: string, position?: number): string | null {
        return this.#dom.window.document.querySelectorAll(selector)[position || 0].textContent;
    }

}
