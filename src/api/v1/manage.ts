import Router from 'koa-router';
import YibanManager from '../../services/yiban';
import Schedule from '../../util/Schedule';
import Storage from '../../util/storage';
import { Success } from '../../core/http-exception';

const router = new Router();
router.prefix('/api/v1/manage');

/**
 * 停止签到系统
 */
router.post('/stop', async () => {
    console.log('stop');
    const y = YibanManager.getInstance();
    y.schedule = null as any;
    throw new Success('签到系统已停止')
})

/**
 * 启动签到系统
 */
router.post('/start', async () => {
    console.log('start');
    const users = Storage.getUsers();
    const y = YibanManager.getInstance();
    y.schedule = null as any;
    // y.schedule = Schedule.scheduleCronstyle('* * * * * *', async () => {
    for (let email in users) {
        await y.executeSignOnce(users[email]); // 异步，此处不再限制
    }
    // })
    throw new Success(`签到系统启动成功 - ${y.schedule ? '已安排定时任务' : '未安排定时任务'}`)
})

/**
 * 查询所有用户数据
 */
router.get('/test', async (ctx, next) => {
    ctx.body = ctx.request.body;
})

export default router;