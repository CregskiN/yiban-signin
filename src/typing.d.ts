declare namespace Yiban {
    // http 状态码
    type StatusCode = 200 | 301 | 400 | 401 | 500;

    /**
     * app内部错误码
     * 0 没有错误
     * 10000 base错误码
     * 10001 参数错误
     * 40001 数据提交到易班出错
     * 40002 发送邮件出错
     * 40003 签到超时
     * 999 预料之外的错误
     */
    type ErrorCode = 0 | 10000 | 10001 | 40001 | 40002 | 40003;

    /**
     * 经转化，cookie转为带有JSESESSIONID的对象
     */
    interface JSESESSIONIDObj {
        JSESESSIONID?: string;
    }

    /**
     * 用户数据类型
     */
    interface User {
        url: string;
        q1: '否',
        q2: '否',
        q3: '否',
        q4: '否',
        q5: '否',
        q6: '否',
        q7: '否|',
        q8: '否|',
        position: string;
        ishb: number;
        email: string;
    }

    interface UsersData {
        [key: string]: User;
    }



}