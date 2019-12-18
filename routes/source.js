import express from "express";
import SourceController from './../controller/SourceController/SourceController'
const router = express.Router({});

/**************************接口API********************************/
/****获取文章的总文档数接口 */
router.get('/back/source/api/count',SourceController.getSourceCount)

/*****获取文章列表接口 */
router.get('/back/source/api/list',SourceController.getSourceList)

/**** 添加图片接口* **/
router.post("/back/source/api/add_img", SourceController.addSourceImg);

/****** 添加文章接口*/
router.post("/back/source/api/add",SourceController.addSource);

/***** 根据id查询文章接口*/
router.get("/back/source/api/singer/:sourceId",SourceController.findSourceById);

/***** 根据id修改文章接口*/
router.post("/back/source/api/edit", SourceController.updateSourceById);

/*** 根据id删除一篇文章接口 */
router.get("/back/source/api/remove/:sourceId", SourceController.deleteSourceById);

/*****前端获取文章总数接口 */
router.get('/web/source/api/count',SourceController.getSourceCountByClient)

/****前端获取文章列表接口 */
router.get('/web/source/api/list',SourceController.getSourceListByClient)

/****前端获取文章详情接口 */
router.get('/web/source/api/content/:sourceId',SourceController.getSourceDetailByClient)




/**************************页面路由********************************/
/** * 加载文章资源列表*/
router.get('/back/source_list',(req,res,next)=>{
    res.render('back/source_list.html')
})

/***** 加载添加文章页面*/
router.get("/back/source_add", (req, res, next) => {
  res.render("back/source_add.html");
});

/**** * 加载编辑文章页面*/
router.get("/back/source_edit", (req, res, next) => {
  res.render("back/source_edit.html");
});
export default router;
