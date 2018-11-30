/*
* @Author: 羊驼
* @Date:   2018-11-19 20:39:38
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-30 16:52:42
*/
// 连接数据库模块
var mongoose=require('mongoose');
// 用户的表的结构
module.exports = new mongoose.Schema({
	// 分类---是个关联字段
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'category'
	},
	//用户---关联字段
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user'
	},
	//添加时间
	addTime:{
		type:Date,
		default:new Date()
	},
	//访问量
	views:{
		type:Number,
		default:0
	},
	// 内容标题
	title:String,
	// 简介
	description:String,
	// 内容
	content:String,
	comments:{
		type:Array,
		default:[]
	}
}, {
usePushEach: true
});