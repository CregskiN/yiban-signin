declare namespace YibanRequest {
    type TrulyOrFalsy = '是' | '否';

    /**
     * 易班前端对字符串处理不干净q7 q8 后加了个|
     */
    interface UserSubmitToUs {
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
        [propName: string]: any;
    }

    interface UsSubmitToYiban {
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
        [propName: string]: any;
    }
}