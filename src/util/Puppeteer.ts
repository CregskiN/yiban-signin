import puppeteer from 'puppeteer';

export default class Puppeteer {

    /**
     * 使用用户提供的带token的url，获取带JSESSIONID的cookie
     * @param url 
     */
    static async getCookies(url: string) {
        return await puppeteer.launch().then(async browser => {
            const page = await browser.newPage();
            await page.goto(url);
            const cookies = await page.cookies()
            await browser.close();
            return cookies;
        });
    }

}



