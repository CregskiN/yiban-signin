import Router from 'koa-router';

const router = new Router();
router.prefix('/api/v1/user');

/**
 * 添加用户数据
 */
router.post('/add', async (ctx, next) => {
    console.log(ctx.request.body);
    ctx.body = {
        msg: 'success'
    }
})

/**
 * 删除用户数据
 */
router.get('/delete/:uid', async (ctx, next) => {

})


export default router;