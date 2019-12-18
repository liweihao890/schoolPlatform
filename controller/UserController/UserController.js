import User from "../../models/User";
import config from "../../src/config";
import { basename } from "path";
import formidable from "formidable";
import md5 from "blueimp-md5";
class UserController {
  constructor() {}
  /* 生成后台管理员 itlike   123*/
  async createAdmin(req, res, next) {
    try {
      const user_name = req.body.user_name || "";
      const user_pwd = md5(req.body.user_pwd + "@WaLk1314?.ItikE.Com.#") || "";
      // 操作数据库
      const user = new User({
        // 用户名
        user_name: user_name,
        // 密码
        user_pwd: user_pwd
      });
      const result = await user.save();
      if (result) {
        res.json({
          status: 200,
          result: "添加管理员成功!"
        });
      } else {
        throw new Error("添加管理员失败!");
      }
    } catch (error) {
      return next(error);
    }
  }

  /*用户名和密码进行登录*/
  async userLogin(req, res, next) {
    // 1. 获取数据
    const user_name = req.body.user_name;
    const user_pwd = req.body.user_pwd;
    try {
      // 2. 查询数据
      const user = await User.findOne({ user_name: user_name });
      if (user) {
        // 2.2 判断密码
        if (user.user_pwd === user_pwd) {
          // 密码匹配成功
          // console.log(req.session);
          // session中存token
          req.session.token = user._id;

          // 2.3 登录成功
          res.json({
            status: 200,
            result: {
              token: user._id,
              message: "登录成功"
            }
          });
        } else {
          res.json({
            status: 1,
            result: "输入密码有误!"
          });
        }
      } else {
        res.json({
          status: 0,
          result: "输入口令不存在!"
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  /* 退出登录*/
  async userLogout(req, res, next){
    // 销毁session
    // 方式1: 将cookie的时间设置为0，只有cookie中携带的信息通过客户端请求传到服务器，由对应的session接收session才起作用，cookie没了session自然而然的将不起作用
    req.session.cookie.maxAge = 0;

    // 方式二: destroy
   /* req.session.destroy((err)=>{
        return next(err);
    });*/

    // 提示用户
    res.json({
       status: 200,
       result: '退出登录成功!'
    });

}

/*获取用户信息-部分*/
async getUserInfoDraftById(req, res, next){
    try {
        const user = await User.findById(req.params.token, '-_id icon_url real_name intro_self points rank gold');
        if(user){
            res.json({
                status: 200,
                result: user
            })
        }else {
            req.session.cookie.maxAge = 0;
        }
    } catch (error) {
        return next(error)
    }
}

/*根据获取用户信息-所有*/
async getUserInfoById(req, res, next){
    try {
        const user = await User.findById(req.params.token, '-_id -user_name -user_pwd -l_edit -c_time');
        if(user){
            res.json({
                status: 200,
                result: user
            })
        }else { 
        //token 失效了，要销毁session
            req.session.cookie.maxAge = 0;
        }
    } catch (error) {
        return next(error)
    }
    
}

/*根据id(token)去修改一条用户信息*/
async updateUserInfoById(req, res, next){
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req,async (err, fields, files)=>{
        try {
             // 1. 取出普通字段
            let body = fields;
            // console.log(body);
            // 2. 根据id查询文档
            const user = await User.findById(body.token);
            if(user){
                    // 2.1 修改文档的内容
                user.real_name = body.real_name;
                user.icon_url = body.icon_url || basename(files.icon_url.path);

                user.phone = body.phone;
                user.e_mail = body.e_mail;
                user.join_time = body.join_time;
                user.intro_self = body.intro_self;
                const result = await user.save();
                if(result){
                    res.json({
                        status: 200,
                        result: '用户信息修改成功!'
                    })
                }else{
                    throw new Error(err)
                }
            }
        } catch (error) {
            return next(error)
        }

    });
}

/**** * 根据token修改密码 */
async updateUserPasswordById(req,res,next){
    //拿到传过来的token,旧密码,新密码
    const token = req.body.token;
    const old_pwd = req.body.old_pwd;
    const new_pwd = req.body.new_pwd;
    try {
        const user =await User.findById(token);
        // 查询不到
        if(!user){
            res.json({
                status: 0,
                result:{
                    message: '用户不存在或者token已过期'
                }
            })
        }else if(user.user_pwd !== old_pwd){
            //密码不匹配
            res.json({
                status: 1,
                result:{
                    message: '用户密码错误!'
                }
            })
        }else{
            //更新数据库中的密码
            user.user_pwd = new_pwd;
            //保存到数据库
            const result = await user.save();
            if(result){
                res.json({
                    status: 200,
                    result:{
                        message: '密码修改成功!!'
                    }
                })
            }
        }
    } catch (error) {
        return next(error)
    }
}
}

export default new UserController();
