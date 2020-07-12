import Router from 'koa-router';
import YibanManager from '../../services/yiban';
import { ParameterException, Success } from '../../core/http-exception';
import { isQQEmail } from '../../util/index';
import Storage from '../../util/storage';

const router = new Router();

router.prefix('/api/v1/sign');

/**
 * 完成提交并计入数据，启动定时任务
 */
router.post('/submit', async (ctx, next) => {
    const y = YibanManager.getInstance();
    const userSubmitToUs: YibanRequest.UserSubmitToUs = ctx.request.body;
    const { url, email, position } = userSubmitToUs;

    /* 1. 验证参数 */
    if (!url) {
        throw new ParameterException('参数有误，请添加 url');
    }
    if (!isQQEmail(email)) {
        throw new ParameterException('参数有误，请检查你的e-mail')
    }
    if (!position.length) {
        throw new ParameterException('参数有误，请检查你的位置填写')
    }

    /* 2. 处理数据 */
    Storage.storageUsers(userSubmitToUs);
    const usersData = Storage.getUsers();

    /* 3. 设定定时任务 */
    //'0 0 1 * * *'
    y.shadule(userSubmitToUs);
    throw new Success('任务添加成功');
})




export default router;