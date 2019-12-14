const express = require("express");
const router = express.Router({});
import Sowing from "./../models/Sowing.js";

/********************后台界面*********** */
router.get("/back", (req, res) => {
  res.render("back/index.html");
});

/********************前端界面*********** */
router.get("/", (req, res) => {
  res.redirect("/web");
});
router.get("/web", (req, res) => {
  res.render("web/index.html");
});

router.get("/web/res", (req, res) => {
  Sowing.find(
    {},
    "_id image_title image_url image_link s_time e_time",
    (err, sowings) => {
      if (err) {
        return next(err);
      }
      let classNames = ["one", "two", "three", "four"];
      for (let i = 0; i < classNames.length; i++) {
        //追加类名字段
        sowings[i].className = classNames[i]
      }
      res.render("web/resources.html",{sowings});
    }
  );
  
});
router.get("/web/res_c", (req, res) => {
  res.render("web/resources_content.html");
});

module.exports = router;
