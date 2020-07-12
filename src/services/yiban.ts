import axios from 'axios';
import { isString } from 'lodash';
import { Job } from 'node-schedule';

import { SignupException } from '../core/http-exception';
import Schedule from '../util/Schedule';
import Puppeteer from '../util/Puppeteer';
import Email, { MailOptions } from '../util/email';
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
        delete formObj['url'];
        delete formObj['email'];
        return await axios.post('http://211.68.191.30/coronavirus/page/sign', formObj, {
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 yiban_android',
                'Content-Type': 'test/plain; charset=UTF-8',
                'Cookie': `client=android;JSESSIONID=${JSESESSIONIDObj.JSESESSIONID}`,
            }
        }).then(res => res.data).catch(err => {
            console.error(err);
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
     * 安排签到任务
     * @param user 
     */
    async shadule(user: Yiban.User) {
        const y = YibanManager.getInstance();
        Schedule.scheduleCronstyle('20 * * * * *', async () => {
            const { url, email } = user;
            // 获取 jseSessionIdObj
            const jseSessionIdObj = await y.getJSESESSIONIDCookie(url);
            // 签到
            let res = await y.signup(jseSessionIdObj, user);

            if (isString(res)) {
                if (res.indexOf('html') !== -1) {
                    res = 10;
                }
            }

            console.log(`用户${user.email}的任务已执行`);
            switch (res) {
                case 1: {
                    y.noticeUser(email, true, '签到成功');
                    // throw new Success('签到成功。');
                    break;
                }
                case 3: {
                    y.noticeUser(email, true, '你已经签到啦');
                    // throw new Success('你已经签到啦');
                    break;
                }
                case 10: {
                    y.noticeUser(email, true, '签到时间已经过了');
                    // throw new TimeoutException('签到时间已经过了！');
                    break;
                }
                default: {
                    y.noticeUser(email, true, '机器人出现一些异常');
                    // throw new SignupException()
                    break;
                }
            }
        })
    }


}

export default YibanManager;