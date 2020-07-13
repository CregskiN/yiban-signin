import _ from 'lodash';

/**
 * 生成HTML模版，作为邮件内容
 * @param content 
 */
export function generateHTML(content: string) {
    return `
        <h3>每日签到提示</h3>
        <h4>时间：${new Date()}</h4>
        <p>${content.toString()}</p>
    `
}

/**
 * 验证是否是邮箱
 * @param str 
 */
export function isQQEmail(str: string): boolean {
    var reg = /^([a-zA-Z0-9]{5,})+@([a-zA-Z0-9])+(.[a-zA-Z0-9])+/;
    return reg.test(str);
}

/**
 * formObj转化为url形式
 * @param obj 
 */
export function obj2URI(obj: { [key: string]: any }) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        console.error('obj2Url接受参数不为object');
        return '';
    }
    let str = '';
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str = `${str}&${key}=${obj[key]}`;
        }
    }
    str = str.substr(1);
    str = encodeURI(str);
    return str;
}