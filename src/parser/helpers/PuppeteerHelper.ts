import puppeteer, {
    Browser,
    ElementHandle,
    HTTPResponse, NodeFor,
    Page,
    PuppeteerLaunchOptions,
    WaitForOptions
} from 'puppeteer';

export class PuppeteerHelper {

    #browser: Browser;

    #page: Page;

    readonly #options: PuppeteerLaunchOptions = {
        headless: true,
        args: [ '--no-sandbox' ]
    };

    #goToOptions: WaitForOptions = {
        waitUntil: 'networkidle2'
    };

    constructor(options?: PuppeteerLaunchOptions) {

        if (options) {
            this.#options = options;
        }

    }

    get browser() {
        return this.#browser;
    }

    get page() {
        return this.#page;
    }

    async createBrowserPage() {
        this.#browser = await puppeteer.launch(this.#options);
        this.#page = await this.#browser.newPage();
    }

    async goTo(link: string, options?: WaitForOptions & { referer?: string | undefined }): Promise<HTTPResponse | null> {
        return this.#page.goto(link, { ...this.#goToOptions });
    }

    async waitForSelector(selector: string): Promise<ElementHandle<NodeFor<string>> | null> {
        return this.#page.waitForSelector(selector, {
            timeout: 0
        });
    }

    async getPageContent(selector: string): Promise<string> {

        return this.waitForSelector(selector)
            .then(() => {
                return this.#page.content();
            })
            .catch(() => {
                return '';
            });
    }

    async close(): Promise<void> {
        return this.#browser.close();
    }

}
