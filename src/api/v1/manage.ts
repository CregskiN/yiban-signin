import Router from 'koa-router';

const router = new Router();
router.prefix('/api/v1/manage');

/**
 * 停止签到系统
 */
router.post('/stop', async () => {

})

/**
 * 启动签到系统
 */
router.post('/start', async () => {
    console.log('start');
    
})

/**
 * 查询所有用户数据
 */
router.get('/search', async (ctx, next) => {

})

export default router;