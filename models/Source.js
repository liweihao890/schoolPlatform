import mongoose from 'mongoose'

// 创建资源的模式对象
const sourceSchema = mongoose.Schema({
    // 标题
    title: {type: String, required: true},
    // 作者
    author: {type: String, default: '撩课学院'},
    // 缩略图
    small_img: {type: String,  required: true},
    // 是否收藏  0 不收藏 1 收藏
    is_store: {type: String, default: '0'},
    // 价格 0 免费
    price: {type: Number, default: 0},
    // 阅读次数
    read_count: {type: Number, default: 1},
    // 添加日期
    add_time: {type: Date, default: Date.now},
    // 文章内容
    content: {type: String, required: true},
    // 最后编辑时间
    l_time: {type: Date, default: Date.now}
});

const Source = mongoose.model('Source', sourceSchema);
export default Source;
