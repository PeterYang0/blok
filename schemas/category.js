/*
* @Author: 羊驼
* @Date:   2018-11-11 21:40:32
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-11 21:41:56
*/
// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 分类名称
	name:String,
});
