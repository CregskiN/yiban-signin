import Router from 'koa-router';
import { ParameterException, Success } from '../../core/http-exception';
import { isQQEmail } from '../../util/index';
import Storage from '../../util/storage';
import YibanManager from '../../services/yiban';

const router = new Router();

router.prefix('/api/v1/sign');

/**
 * 完成提交并计入数据
 */
router.post('/submit', async (ctx, next) => {
    const userSubmitToUs: YibanRequest.UserSubmitToUs = ctx.request.body;
    const { url, email, position } = userSubmitToUs;
    const y = YibanManager.getInstance();

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
    // const usersData = Storage.getUsers();

    /* 3. 设定定时任务 */
    //'0 0 1 * * *'
    // y.shadule(userSubmitToUs);
    throw new Success(`用户添加成功 - ${y.schedule ? '已安排定时任务' : '未安排定时任务'}`);
})




export default router;