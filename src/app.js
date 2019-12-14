import express from 'express'
// 挂载路由
import indexRouter from './../routes/index.js'
import sowingRouter from './../routes/sowing'
import userRouter from './../routes/user'
// 导入设置
import config from './config'
// 导入第三方包
import nunjucks from 'nunjucks'
//导入中间件
import bodyParser from './../middle_wares/body_parser.js'
import errorLog from './../middle_wares/error_log'

// 创建express服务器
const app = express();
// 配置公共资源访问路径
app.use(express.static(config.publicPath));
// app.use(express.static(config.viewsPath));//使用模板引擎时就不能使用了

// 2. 配置中间件（nunjucks模板引擎能够作用到views文件夹中的模板）
nunjucks.configure(config.viewsPath, {
    autoescape: true,
    express: app,
    noCache: true // 不使用缓存，模板每次都会重新编译
});
// 配置数据处理中间件
app.use(bodyParser)


//配置路由
app.use(indexRouter);
app.use(sowingRouter);
app.use(userRouter);

//挂载错误中间件
app.use(errorLog);

//404中间件
app.use((req, res)=>{
    res.render('404.html')
})




app.listen(3000,(req,res)=>{
    console.log('Server is running');
    
})