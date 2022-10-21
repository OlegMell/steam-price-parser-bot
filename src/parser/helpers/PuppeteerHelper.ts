import puppeteer, {
    Browser,
    ElementHandle,
    HTTPResponse, NodeFor,
    Page,
    PuppeteerLaunchOptions,
    WaitForOptions
} from 'puppeteer';

export class PuppeteerHelper {

    browser: Browser;

    page: Page;

    readonly #options: PuppeteerLaunchOptions = {
        headless: true,
        args: [ '--no-sandbox' ],
        timeout: 10000
    };

    #goToOptions: WaitForOptions = {
        waitUntil: 'networkidle2',
        timeout: 10000
    };

    constructor(options?: PuppeteerLaunchOptions) {

        if (options) {
            this.#options = options;
        }

    }

    async createBrowser(): Promise<any> {
        return puppeteer.launch(this.#options);
    }

    async createPage(browser: any): Promise<any> {
        if (browser) {
            return browser.newPage();
        } else {
            return this.browser.newPage();
        }
    }

    async createBrowserPage() {
        this.browser = await puppeteer.launch(this.#options);
        this.page = await this.browser.newPage();
    }

    async goTo(link: string, options?: WaitForOptions & { referer?: string | undefined }): Promise<HTTPResponse | null> {
        return this.page.goto(link, { ...this.#goToOptions });
    }

    async waitForSelector(selector: string): Promise<ElementHandle<NodeFor<string>> | null> {
        return this.page.waitForSelector(selector, {
            timeout: 50000
        });
    }

    async getPageContent(selector: string): Promise<string> {

        return this.waitForSelector(selector)
            .then(() => {
                return this.page.content();
            })
            .catch(() => {
                return '';
            });
    }

    async close(): Promise<void> {
        return this.browser.close();
    }

}
