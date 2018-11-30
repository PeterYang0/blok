/*
* @Author: 羊驼
* @Date:   2018-10-15 22:14:25
* @Last Modified by:   羊驼
* @Last Modified time: 2018-10-15 22:14:27
*/
var mongoose=require('mongoose');

// 加载user结构
var userSchema = require('../schemas/user.js');

// 创建user模型
module.exports = mongoose.model('user',userSchema);