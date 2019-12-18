import express from 'express'
const router = express.Router({});
import UserController from './../controller/UserController/UserController'



/********************************数据接口API-start**********************************/
/* 生成后台管理员 itlike   123*/

router.post('/user/api/add',UserController.createAdmin);
/*用户名和密码进行登录*/
router.post('/user/api/login', UserController.userLogin);
/* 退出登录*/
router.get('/back/user/api/logout', UserController.userLogout);
/*获取用户信息-部分*/
router.get('/back/user/api/u_msg/:token', UserController.getUserInfoDraftById);

/*获取用户信息-所有*/
router.get('/back/user/api/u_msg_all/:token', UserController.getUserInfoById);

/*根据id(token)去修改一条用户信息*/
router.post('/back/user/api/edit', UserController.updateUserInfoById);

/**** * 根据token修改密码 */
router.post('/back/user/api/reset',UserController.updateUserPasswordById);
/********************************数据接口API-end**********************************/


/********************************页面的路由-start**********************************/
router.get('/back/login', (req, res, next)=>{
    res.render('back/login.html');
});

router.get('/back/u_center', (req, res, next)=>{
    res.render('back/user_center.html');
});

router.get('/back/u_set', (req, res, next)=>{
    res.render('back/user_message.html');
});

router.get('/back/u_reset_pwd', (req, res, next)=>{
    res.render('back/reset_pwd.html');
});

/********************************页面的路由-end**********************************/

export default router;

