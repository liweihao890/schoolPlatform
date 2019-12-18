import express from 'express'
const router = express.Router({});
import SowingController from './../controller/SowingController/SowingController'

/**************************接口API********************************/
/*添加一条新轮播图*/
router.post('/back/sowing/api/add', SowingController.insertOneSowing);

/*获取所有的轮播图列表*/

router.get('/back/sowing/api/list', SowingController.getSowingList);

/* 获取一条轮播图 (id)*/

router.get('/back/sowing/api/singer/:sowingId', SowingController.getSowingById);

/* 根据id去修改一条轮播图*/
router.post('/back/sowing/api/edit', SowingController.updateSowingById);


/*** 根据id删除一条记录*/
router.get('/back/sowing/api/remove/:sowingId', SowingController.deleteSowingById);



/**************************页面路由********************************/
/*** 加载轮播图列表 */
router.get('/back/s_list', (req, res, next)=>{
    res.render('back/sowing_list.html');
});

/*** 加载添加轮播图*/
router.get('/back/s_add', (req, res, next)=>{
    res.render('back/sowing_add.html');
});

/** * 加载修改轮播图*/
router.get('/back/s_edit', (req, res, next)=>{
    res.render('back/sowing_edit.html');
});

export default router;