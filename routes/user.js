import express from 'express'
import User from './../models/User'
import md5 from 'blueimp-md5'
const router = express.Router({});

const S_KEY = '@WaLk1314?.ItikE.Com.#';

/********************************数据接口API-start**********************************/
/*
  生成后台管理员
  itlike
  123
*/
router.post('/user/api/add', (req, res, next)=>{
     const user_name = req.body.user_name || '';
     const user_pwd =  md5(req.body.user_pwd + S_KEY) || '';

     // 操作数据库
    const user = new User({
       // 用户名
        user_name: user_name,
       // 密码
        user_pwd: user_pwd
    });

    // 存储
    user.save((err, result)=>{
        if(err){
            return next(err);
        }
        res.json({
           status: 200,
           result: '添加管理员成功!'
        });
    });

});

/*
 用户名和密码进行登录
*/
router.post('/user/api/login', (req, res, next)=>{
    // 1. 获取数据
    const user_name = req.body.user_name;
    const user_pwd = req.body.user_pwd;


    console.log('----------------------------');
    console.log(req.body);
    console.log('----------------------------');

    // 2. 查询数据
    User.findOne({user_name: user_name}, (err, user)=>{
        if(err){
            return next(err);
        }
        // 2.1 如果用户存在
        if(user !== null){
            // 2.2 判断密码
            if(user.user_pwd === user_pwd){ // 密码匹配成功
                // 在session中存储客户端的信息
                req.session.token = user._id;
                // 2.3 登录成功
                res.json({
                    status: 200,
                    result: {
                        token: user._id,
                        message: '登录成功'
                    }
                });
            }else {
                res.json({
                    status: 1,
                    result: '输入密码有误!'
                });
            }
        }else{
            res.json({
                status: 1,
                result: '输入口令不存在!'
            });
        }
    });
});

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

