import express from 'express'
import Source from './../models/Source'
import config from './../src/config'
import {basename} from 'path'
import formidable from 'formidable'
const router = express.Router({});

/**************************接口API********************************/
/***
 * 添加图片接口
 * **/
router.post('/back/source/api/add_img', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
       //检测到上传图片
       if(files.image_url){
           //取出上传图片后再服务器的位置
           let image_url = 'http://localhost:3000' + '/uploads/' + basename(files.image_url.path)
           //返回数据
           res.json({
               status: 200,
               result: image_url,
               
           })
       }else{
           //上传失败
           res.json({
               status: 1,
               result: '上传图片失败'
           })
       }
       
       
    });
});
/*****
 * 添加文章接口
 */
router.post('/back/source/api/add',(req,res,next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
    // 1. 获取普通数据
    let body = fields
    //2. 解析图片的路径,取出缩略图片图片的名字
    body.small_img = basename(files.small_img.path);
    //3. 生成数据文档
    const source = new Source({
        title: body.title,
        author: body.author,
        small_img: body.small_img,
        price: body.price,
        content: body.content,
    });
    //4. 添加到数据库
    source.save((err,result) => {
       if(err){
           return next(err)
       }
       res.json({
           status: 200,
           result: {
               message: '添加文章成功!'
           }
       })
    })
    })
})
/****
 * 根据id查询文章接口
 */
router.get('/back/source/api/singer/:sourceId',(req,res,next) => {
    Source.findById(req.params.sourceId,(err, docs)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: docs
        })
    })
})

/****
 * 根据id修改文章接口
 */
router.post('/back/source/api/edit',(req,res,next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
    // 1. 获取普通数据
    let body = fields
    //2. 解析图片的路径,取出缩略图片图片的名字
    body.small_img = basename(files.small_img.path);
    //3. 根据id查询数据库
    Source.findById(body.id,(err,source) => {
       if(err){
           return next(err)
       }
       //修改数据
       source.title =  body.title;
       source.author = body.author,
       source.small_img = body.small_img || basename(files.small_img.path);
       source.price = body.price;
       source.content = body.content;
        //4. 保存到数据库
        source.save((err,result) => {
        if(err){
            return next(err)
        }
        //返回结果给客户端
        res.json({
            status: 200,
            result:{
                message: '修改文章成功!'
            }
        })
     })
    })
   
   
    

})
})

/**
 * 根据id删除一篇文章接口
 */
router.get('/back/source/api/remove/:sourceId', (req, res, next)=>{
    Source.deleteOne({_id: req.params.sourceId}, (err, result)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: '成功删除文章!'
        })
    })
});
/**************************页面路由********************************/
/**
 * 加载文章资源列表
 */
router.get('/back/source_list', (req, res, next)=>{
    // 查询所有的数据
    Source.find((err, sources)=>{
        if(err){
            return next(err);
        }
        res.render('back/source_list.html', {sources});
    });

});             
/****
 * 加载添加文章页面
 */
router.get('/back/source_add',(req,res,next) => {
   res.render('back/source_add.html')
})

/****
 * 加载编辑文章页面
 */
router.get('/back/source_edit',(req,res,next) => {
   res.render('back/source_edit.html')
})
export default router;