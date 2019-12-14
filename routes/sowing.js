import express from "express";
import Sowing from "./../models/Sowing.js";
import config from './../src/config.js';
import formidable from 'formidable';
import {basename} from 'path'
const router = express.Router({});

/***********接口API的编写Start*********/
/***
 * 往数据库插入一条数据
 * **/
router.post("/sowing/api/add", (req, res,next) => {
  // const basrUrl = 'http://localhost:3000'
  const form = new formidable.IncomingForm();
  form.uploadDir = config.uploadPath;//确定文件上传后放置的文件夹
  form.keepExtensions = true;//保存文件原始扩展名
  form.parse(req,(err,fields,files) => {
     if(err){
      return  next(err)
     }
    //  取出主题信息
    let body = fields;
    // 取出文件名
    body.image_url = basename(files.image_url.path);
    // //取出文件存储后的访问路径
    // body.image_link = basrUrl + '/uploads/' + body.image_url
    // 将整合后的数据传入数据库中
     const sowing = new Sowing({
    // 图片名称
    image_title: body.image_title,
    // 图片地址
    image_url: body.image_url,
    // 跳转链接
    image_link: body.image_link,
    // 上架时间
    s_time: body.s_time,
    // 下架时间
    e_time: body.e_time
  });

  sowing.save((err, result) => {
    if (err) {
      return next(err);
    }
    res.json({
      status: 200,
      result: "添加轮播图成功"
    });
  }); 
  })
});
/*
获取所有轮播图列表
*/
router.get("/sowing/api/list", (req, res, next) => {
  Sowing.find(
    {},
    "_id image_title image_url image_link s_time e_time",
    (err, docs) => {
      if (err) {
        return next(err);
      }
      //把数据返回
      res.json({
        status: 200,
        result: docs
      });
    }
  );
});
/*
  *根据id获取一条轮播图数据,模糊查询
**/
router.get("/sowing/api/single/:sowingId", (req, res, next) => {
  Sowing.findById(
    req.params.sowingId,
    "_id image_title image_url image_link s_time e_time",
    (err, docs) => {
        if (err) {
            return next(err);
          }
      //把数据返回
      res.json({
        status: 200,
        result: docs
      });
    }
  );
});
/**
 * 根据id修改一条轮播图数据
 */
router.post("/sowing/api/edit", (req, res,next) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = config.uploadPath;//确定文件上传后放置的文件夹
  form.keepExtensions = true;//保存文件原始扩展名
  form.parse(req,(err,fields,files) => {
    if(err){
      return next(err)
    }
    //取出主体信息
    let body = fields;
     //根据id查询数据库
    Sowing.findById(body.id,(err,sowing) => {
       if(err){
         return next(err)
       }
       //修改数据库中的数据
       sowing.image_title = body.image_title;
       sowing.image_url = body.image_url || basename(files.image_url.path);
       sowing.image_link = body.image_link;
       sowing.s_time = body.s_time;
       sowing.e_time = body.e_time;
       sowing.l_edit = Date.now();
       //保存数据到数据库
       sowing.save((err,result) => {
          if(err){
            return next(err)
          }
          res.json({
            status: 200,
            result: "修改轮播图成功"
          })
       })
    })
  })
});


/***
 * 根据id删除一条数据
 */
router.get("/sowing/api/remove/:sowingId", (req, res, next) => {
  Sowing.deleteOne(
    {_id: req.params.sowingId},
    (err, result) => {
        if (err) {
            return next(err);
          }
      //把数据返回
      res.json({
        status: 200,
        result: '成功删除轮播图!'
      });
    }
  );
});

/***********接口API的编写End*********/




/*******页面路由Start****** */
/***加载轮播图列表 */
router.get("/back/s_list", (req, res, next) => {
  //查询数据库
  Sowing.find((err,sowings) => {
     if(err){
       return next(err)
     }
     //将数据传给页面
     res.render("back/sowing_list.html",{sowings});
  })
  
});

/****加载添加轮播图 */
router.get("/back/s_add", (req, res, next) => {
  res.render("back/sowing_add.html");
});

/***加载轮播图编辑页面 */
router.get('/back/s_edit',(req,res,next) => {
  res.render('back/sowing_edit.html')
})



/*******页面路由End****** */

export default router;
