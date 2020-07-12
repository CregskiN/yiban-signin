import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../../config';

export interface MailOptions {
    /* 发件人 格式：SenderName<123456789@qq.com> */
    from: string;
    /* 收件人 格式：ReceiverName<234567890@qq.com> */
    to: string;
    /* 主题 */
    subject: string;
    /* 内容 HTML 模版 */
    html: string;
}

export default class Email {

    static email(options: MailOptions) {
        // 开启一个 SMTP 连接池
        var transport = nodemailer.createTransport(smtpTransport(config.mailbaseConfig));
        // 设置邮件内容
        var mailOptions = {
            from: `签到机器人<${options.from}>`, // 发件人地址
            to: options.to, // 收件人列表,逗号分隔，可以放多个
            subject: options.subject, // 标题
            html: options.html // html 内容
        }
        // 发送邮件
        transport.sendMail(mailOptions, function (error: any, response: any) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message send ok");
            }
            transport.close(); // 如果没用，关闭连接池
        });
    }
}


