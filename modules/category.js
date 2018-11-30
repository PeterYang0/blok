/*
* @Author: 羊驼
* @Date:   2018-11-11 21:40:48
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-19 21:57:08
*/
var mongoose=require('mongoose');

// 加载分类结构
var categorySchema = require('../schemas/category.js');

// 创建category模型
module.exports = mongoose.model('category',categorySchema);