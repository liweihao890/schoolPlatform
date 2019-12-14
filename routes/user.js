import express from 'express'
import User from './../models/User'
import md5 from 'blueimp-md5'
const router = express.Router({})
//前后端约定的秘钥头部分,俗称盐
const S_KEY = '@QWcdkkLk1314?.ItikE.Com.#';
/****接口API  Start */
router.post('/user/api/add',(req,res,next) => {
   //拿到传过来的用户名和密码
   const user_name = req.body.user_name || '';
   const user_pwd = md5(req.body.user_pwd + S_KEY) || '' ;//对密码进行md5加密
   //生成文档
   const user = new User({
       user_name: user_name,
       user_pwd : user_pwd
   })
   //保存到数据库
   user.save((err,result) => {
      if(err){
          return next(err)
      }
      res.json({
          status: 200,
          result: '添加管理员成功!!!'
      })
   })

})

//登录接口
router.post('/user/api/login',(req,res,next)=>{
    //拿到用户名和密码
    const user_name = req.body.user_name
    const user_pwd = req.body.user_pwd
    // 根据用户名查询数据库
    User.findOne({user_name: user_name},(err,user) => {
       if(err){
           return next(err)
       }
       //如果用户不存在
       if(!user){
           res.json({
               status: 0,
               result: '输入的口令不存在'
           })
       }else if(user.user_pwd !== user_pwd){
        //    如果密码错误
            res.json({
                status: 1,
                result: '密码错误'
            })
       }else{
          
           res.json({
               status: 200,
                result: {
                    token: user._id,
                    message: '登录成功'
                }
           })
       }
    })
})




/****接口API  End */

/****用户界面Start */
// 用户登录
router.get('/back/login',(req,res,next)=>{
    res.render('back/login.html')
})
// 用户中心
router.get('/back/u_center',(req,res,next) => {
   res.render('back/user_center.html')
})
// 用户信息展示列表
router.get('/back/u_list',(req,res,next) => {
    res.render('back/user_list.html')
 })
//  用户信息编辑
 router.get('/back/u_message',(req,res,next) => {
    res.render('back/user_message.html')
 })
//用户密码修改
router.get('/back/u_reset_pwd',(req,res,next)=>{
    res.render('back/reset_pwd.html')
})
/****用户界面End */

export default router;