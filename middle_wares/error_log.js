import Error from './../models/Error.js'
export default (error,req,res,next) => {
   const error_log = new Error({
        // 错误名称
    error_nama: error.name,
    // 错误信息
    error_message: error.message,
    // 错误堆栈
    error_stack: error.stack,
    
    // 添加时间
    error_time: {type: Date, default: Date.now()},
   });
   //存储到数据库中,并且返回错误信息
   error_log.save((err,result) => {
      res.json({
          status: 500,
          result: '服务器内部错误!',
          message: error.message
      })
   })
}