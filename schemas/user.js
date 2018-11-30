/*
* @Author: 羊驼
* @Date:   2018-10-14 09:33:39
* @Last Modified by:   羊驼
* @Last Modified time: 2018-10-15 22:15:13
*/

// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 用户名
	username:String,
	// 密码
	password:String,
	// 判断是否为管理员
	isAdmin:{
		type:Boolean,
		default:false
	}
});

