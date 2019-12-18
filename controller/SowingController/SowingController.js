import Sowing from "../../models/Sowing";
import config from "../../src/config";
import { basename } from "path";
import formidable from "formidable";
class SowingController {
  constructor() {}
  //添加一条轮播图
  async insertOneSowing(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return next(err);
      }
      try {
        // 1. 取出普通字段
        let body = fields;
        // 2. 解析上传的文件路径, 取出文件名保存到数据库
        body.image_url = basename(files.image_url.path);
        // 3. 操作数据库
        // 操作数据库
        const sowing = {
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
        };
        const result = await Sowing.create(sowing);
        if (result) {
          res.json({
            status: 200,
            result: "添加轮播图成功"
          });
        } else {
          throw new Error("添加轮播图失败!");
        }
      } catch (error) {
        return next(error);
      }
    });
  }
  //获取轮播图列表
  async getSowingList(req, res, next) {
    try {
      const sowings = await Sowing.find(
        {},
        "_id image_title image_url image_link s_time e_time"
      );
      if (sowings) {
        // 数据返回
        res.json({
          status: 200,
          result: sowings
        });
      } else {
        throw new Error(err);
      }
    } catch (error) {
      return next(error);
    }
  }
  //获取一条轮播图 (id)
  async getSowingById(req, res, next) {
    try {
      const sowing = await Sowing.findById(
        req.params.sowingId,
        "_id image_title image_url image_link s_time e_time"
      );
      if (sowing) {
        // 数据返回
        res.json({
          status: 200,
          result: sowing
        });
      } else {
        return new Error("获取轮播图失败");
      }
    } catch (e) {
      return next(e);
    }
  }
  //根据id修改一条轮播图
  async updateSowingById(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return next(err);
      }
      try {
        // 1. 取出普通字段
        let body = fields;
        // console.log(body);
        // 2. 根据id查询文档
        const sowing = await Sowing.findById(body.id);
        if (sowing) {
          // 2.1 修改文档的内容
          // console.log(sowing);
          sowing.image_title = body.image_title;
          sowing.image_url = body.image_url || basename(files.image_url.path);
          sowing.image_link = body.image_link;
          sowing.s_time = body.s_time;
          sowing.e_time = body.e_time;
          sowing.l_edit = Date.now();
          const result = await sowing.save();
          if (result) {
            res.json({
              status: 200,
              result: "修改轮播图成功!"
            });
          }
        } else {
          return new Error("修改轮播图失败!");
        }
      } catch (e) {
        return next(e);
      }
    });
  }
  //根据id修改轮播图
  async deleteSowingById(req, res, next) {
    try {
      const sowing = await Sowing.deleteOne({ _id: req.params.sowingId });
      if (sowing) {
        // 数据返回
        res.json({
          status: 200,
          result: "成功删除轮播图!"
        });
      } else {
        return new Error(err);
      }
    } catch (e) {
      return next(e);
    }
  }
}

export default new SowingController();
