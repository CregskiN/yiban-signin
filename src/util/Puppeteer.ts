import puppeteer from 'puppeteer';
import path from 'path';


const puupeteerConfig = {
    headless: true,
    args: ['--no-sandbox']
};

export default class Puppeteer {
    static filePath = path.resolve(process.cwd(), './static');

    /**
     * 使用用户提供的带token的url，获取带JSESSIONID的cookie
     * @param url 
     */
    static async getCookies(url: string) {
        return await puppeteer.launch(puupeteerConfig).then(async browser => {
            try {
                const page = await browser.newPage();
                await page.goto(url);
                const cookies = await page.cookies()
                await browser.close();
                return cookies;
            } catch (err) {
                console.error('puppeteer在获取用户JSESSIONID时发生错误，此时的URL为', url);
                return [];
            }

        });
    }

    /**
     * 获取截屏
     * @param url 
     */
    static async getScreenShot(url: string) {
        return await puppeteer.launch(puupeteerConfig).then(async browser => {
            try {
                console.log('截图', url);

                const page = await browser.newPage();
                await page.goto(url);
                const timeStamp = Date.now();
                await page.screenshot({ path: Puppeteer.filePath + `/${timeStamp}.png` });
                await browser.close();
                console.log('截图完成');

                return timeStamp;
            } catch (err) {
                console.error('用户在获取截屏时发生错误', err);
                return '';
            }

        });


    }
}

// const getCookies = (url: string) => {
//     return puppeteer.launch().then(async browser => {
//         const page = await browser.newPage();
//         await page.goto(url);
//         const cookies = await page.cookies()
//         await browser.close();
//         return cookies;
//     });
// }

// getCookies('http://211.68.191.30/coronavirus/page/student?token=3a51b16281d546bcc82647eb3bc2f2b9baff65dd').then(res => {
//     console.log(res);
// })




