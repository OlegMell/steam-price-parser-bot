import { JSDOM } from 'jsdom';

export class DOMHelper {

    #dom: JSDOM;

    constructor(pageContent: string) {
        this.#dom = new JSDOM(pageContent);
    }

    getTextFrom(selector: string): string | null {
        return this.#dom.window.document.querySelectorAll(selector)[1].textContent;
    }

}
