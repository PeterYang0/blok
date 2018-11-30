/*
* @Author: 羊驼
* @Date:   2018-11-19 20:44:26
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-19 20:45:05
*/
var mongoose=require('mongoose');

// 加载user结构
var contentSchema = require('../schemas/content.js');

// 创建category模型
module.exports = mongoose.model('content',contentSchema);