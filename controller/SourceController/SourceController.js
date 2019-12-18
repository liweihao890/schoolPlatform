import Source from "../../models/Source";
import config from "../../src/config";
import { basename } from "path";
import formidable from "formidable";
class SourceController {
  constructor() {}
  /****获取文章的总文档数接口 */
  async getSourceCount(req, res, next) {
    try {
      const count = await Source.countDocuments();
      if (count) {
        res.json({
          status: 200,
          result: count
        });
      } else {
        return new Error(err);
      }
    } catch (e) {
      return next(e);
    }
  }

  /*****获取文章列表接口 */
  async getSourceList(req, res, next) {
    try {
      //获取客户端发过来的当前页码和总页数
      let page = Number.parseInt(req.query.page, 10) || 1;
      let pageSize = Number.parseInt(req.query.pageSize, 10) || 3;
      const sources = await Source.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .exec();
      if (sources) {
        res.json({
          status: 200,
          result: sources
        });
      } else {
        return new Error(err);
      }
    } catch (e) {
      return next(e);
    }
  }

  /**** 添加图片接口* **/
  async addSourceImg(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, async (err, fields, files) => {
      try {
        //检测到上传图片
        if (files.image_url) {
          //取出上传图片后再服务器的位置
          let image_url = "uploads/" + basename(files.image_url.path);
          //返回数据
          res.json({
            status: 200,
            result: image_url
          });
        } else {
          //上传失败
          res.json({
            status: 1,
            result: "上传图片失败"
          });
        }
      } catch (e) {
        return next(err);
      }
    });
  }

  /****** 添加文章接口****/
  async addSource(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, async (err, fields, files) => {
      try {
        // 1. 获取普通数据
        let body = fields;
        //2. 解析图片的路径,取出缩略图片图片的名字
        body.small_img = basename(files.small_img.path);
        //3. 生成数据文档
        const source = new Source({
          title: body.title,
          author: body.author,
          small_img: body.small_img,
          price: body.price,
          content: body.content
        });
        const result = await source.save();
        if (result) {
          res.json({
            status: 200,
            result: {
              message: "添加文章成功!"
            }
          });
        } else {
          throw new Error("添加文章失败");
        }
      } catch (err) {
        return next(err);
      }
    });
  }

  /***** 根据id修改文章接口*/
  async updateSourceById(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, async (err, fields, files) => {
      try {
        // 1. 获取普通数据
        let body = fields;

        //2. 根据id查询数据库
        const source = await Source.findById(body.id);
        if (source) {
          //修改数据
          source.title = body.title;
          source.author = body.author,
          source.small_img = body.small_img || basename(files.small_img.path);
          source.price = body.price;
          source.content = body.content;
          //3. 保存到数据库
          const result =await source.save();
          if (result) {
            //返回结果给客户端
            res.json({
              status: 200,
              result: {
                message: "修改文章成功!"
              }
            });
          }
        } else {
          throw new Error("修改文章失败");
        }
      } catch (error) {
        return next(error);
      }
    });
  }

  /***** 根据id查询文章接口*/
  async findSourceById (req, res, next) {
      try {
          const source = await Source.findById(req.params.sourceId);
          if(source){
              // 数据返回
            res.json({
                status: 200,
                result: docs
            });
          }else{
              throw new Error('查询文章失败!')
          }
      } catch (error) {
          return next(error)
      }
    
  }

  /*** 根据id删除一篇文章接口 */
  async deleteSourceById(req, res, next){
      try {
          const result = await Source.deleteOne({ _id: req.params.sourceId });
          if(result){
             // 数据返回
             res.json({
                status: 200,
                result: "成功删除文章!"
              });
          }else{
              throw new Error('删除文章失败')
          }
      } catch (error) {
          return next(error)
      }
    
  }

  /*****前端获取文章总数接口 */
  async getSourceCountByClient(req,res,next){
      try {
          const count = await Source.countDocuments();
          if(count){
            res.json({
                status: 200,
                result: count
            })
          }else{
              throw new Error('暂时没有文章哟!')
          }
      } catch (error) {
          return next(error)
      }
    
 }

 /****前端获取文章列表接口 */
 async getSourceListByClient(req,res,next) {
    //获取前端传过来的page,pageSize,排序规则
    let {page,pageSize,sortBy} = req.query;
    page = Number.parseInt(page, 10) || 1;
     pageSize = Number.parseInt(pageSize, 10) || 100;
     // 2. 数据查询规则
     let sortObj;
    //按照价格排序,高到低排序
    if(sortBy === 'price'){
         sortObj = {'price': -1}
    }else{
        //按照阅读量排序,高到低排序
         sortObj = {'read_count': -1}
    }
    try {
        const sources =await Source.find({}, 'title small_img price').sort(sortObj).skip((page - 1) * pageSize ).limit(pageSize).exec();
        if(sources){
            res.json({
                status: 200,
                result: sources
            });
        }else{
            throw new Error('获取文章失败')
        }
    } catch (error) {
        return next(error)
    }
   
 }

 /****前端获取文章详情接口 */
 async getSourceDetailByClient(req,res,next) {
     try {
         const source = await Source.findById(req.params.sourceId)
         if (source) {
              // 1. 取出要修改的数据,阅读次数+1
            source.read_count += 1;
            const result =await source.save();
            if(result){
                   //根据id查询数据库
             const detail = Source.findById(req.params.sourceId,"title author read_count add_time content");
             if (detail) {
                res.json({
                    status: 200,
                    result: source
                })
             }
            }
         }
     } catch (error) {
         return next(error)
     }
 }
}

export default new SourceController();
