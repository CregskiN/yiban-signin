import axios from 'axios';
import { isString } from 'lodash';
import { Job } from 'node-schedule';

import { SignupException } from '../core/http-exception';
import Puppeteer from '../util/Puppeteer';
import Email, { MailOptions } from '../util/email';
import { obj2URI } from '../util'
import config from '../../config';


/**
 * 处理易班的业务
 */
class YibanManager {
    public schedule: Job = null as any;
    private static instance: YibanManager;

    private constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new YibanManager();
        }
        return this.instance;
    }

    /**
     * 将 token 转化为 cookie （使用 puppeteer ）
     * @param url 携带tohen的URL 
     */
    async getJSESESSIONIDCookie(url: string) {
        const obj: Yiban.JSESESSIONIDObj = {};
        const cookies = await Puppeteer.getCookies(url);
        for (let value of cookies) {
            if (value.name === 'JSESSIONID') {
                obj.JSESESSIONID = value.value;
                break;
            }
        }
        return obj;
    }

    /**
     * 发送伪造的签到http request（经抓包验证）
     * @param JSESESSIONIDObj 
     */
    async signup(JSESESSIONIDObj: Yiban.JSESESSIONIDObj, formObj: YibanRequest.UserSubmitToUs) {
        let finalFormObj: Partial<YibanRequest.UsSubmitToYiban> = {};
        for (let key in formObj) {
            if (key !== 'url' && key !== 'email') {
                finalFormObj[key] = formObj[key];
            }
        }
        return await axios.post('http://211.68.191.30/coronavirus/sign/submit', obj2URI(finalFormObj), {
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 yiban_android',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': `client=android;JSESSIONID=${JSESESSIONIDObj.JSESESSIONID}`,
            }
        }).then(res => res.data).catch(err => {
            console.error(`${new Date()}数据提交至易班服务器时发生错误`, err);
            throw new SignupException('提交至易班服务器时，出现错误');
        })
    }

    /**
     * 给用户提示
     * @param to 
     * @param success 
     */
    async noticeUser(to: string, success: boolean, msg?: string) {
        const options: MailOptions = {
            from: `签到机器人<${config.manager.email}>`,
            to: `老铁<${to}>`,
            subject: `签到提示`,
            html: success ? (msg || '签到成功或已签到') : '出现异常，请手动签到，并联系管理员 - 27247132@qq.com'
        }
        Email.email(options);
    }

    /**
     * 完成一次单人签到+反馈
     * @param user 
     */
    async executeSignOnce(user: Yiban.User) {
        const y = YibanManager.getInstance();
        const { url, email } = user;
        // 获取 jseSessionIdObj
        const jseSessionIdObj = await y.getJSESESSIONIDCookie(url);
        console.log('本次executeSignOnce获取的user为', user);
        console.log('本次executeSignOnce获取的JSESSIONID为', jseSessionIdObj);

        // 签到
        let res = await y.signup(jseSessionIdObj, user);
        // console.log(res);

        // console.log(`用户${email}的截图为${res}.png`);
        const picName = (await Puppeteer.getScreenShot(url)) + '.png';


        if (isString(res)) {
            if (res.indexOf('html') !== -1) {
                res = 10;
            }
        }

        switch (res) {
            case 1: {
                console.log(`用户${email}的任务执行成功`);
                y.noticeUser(email, true, `签到成功</br><img src="${config.server.baseUrl + config.server.staticPath + '/' + picName}">`);
                // throw new Success('签到成功。');
                break;
            }
            case 3: {
                console.log(`用户${email}的任务执行成功，重复执行`);
                y.noticeUser(email, true, `你已经签到啦</br><img src="${config.server.baseUrl + config.server.staticPath + '/' + picName}">`);
                // throw new Success('你已经签到啦');
                break;
            }
            case 10: {
                console.log(`用户${email}的任务执行失败，签到时间已经过了`);
                y.noticeUser(email, true, `签到时间已经过了</br><img src="${config.server.baseUrl + config.server.staticPath + '/' + picName}">`);
                // throw new TimeoutException('签到时间已经过了！');
                break;
            }
            default: {
                console.log(`用户${email}的任务执行时发生错误`);
                y.noticeUser(email, true, '机器人出现一些异常。请手动签到，并联系管理员 - 27247132@qq.com');
                // throw new SignupException()
                break;
            }
        }
    }


}

export default YibanManager;