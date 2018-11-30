/*
* @Author: 羊驼
* @Date:   2018-10-14 09:07:42
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-30 17:59:17
*/
var express=require('express');
var router=express.Router();

var User=require('../modules/user');
var Category=require('../modules/category');
var Content=require('../modules/content');

// 统一返回数据格式
var resData={};
router.use(function(req,res,next){
	resData={
		code:0,
		msg:''
	};
	next();
});

router.post('/user/register',function(req,res,next){
	var username=req.body.username;
	var password=req.body.password;
	User.findOne({
		username:username
	}).then(function(userInfo){
		if (userInfo) {
			// 如果有，说明被注册了
			resData={
				code:1,
				msg:'用户名已被注册'
			};
			res.json(resData);
			return 
		}else{
			// 没被注册就保存数据
			var user=new User({
				username:username,
				password:password
			});
			return user.save();
		}
	}).then(function(newUserInfo){
		resData.msg='注册成功';
		res.json(resData);
	});
});
//登录
router.post('/user/login',function(req,res,next){
	var username=req.body.username;
	var password=req.body.password;
	User.findOne({
		username:username
	}).then(function(userInfo){
		if (userInfo) {
			User.findOne({
				username:username,
				password:password
			}).then(function(userInfo){
				if (userInfo) {
					resData.msg='登录成功';
					resData.userInfo={
						_id:userInfo._id,
						username:userInfo.username,
						isAdmin:userInfo.isAdmin
					};
					// 设置cookie，存储登录状态
					req.cookies.set('userInfo',JSON.stringify({
						_id:userInfo._id,
						username:userInfo.username
					}),{httpOnly: false});
					res.json(resData)
				}
			})
		}else{
			resData.code=1;
			resData.msg='用户名不存在';
			res.json(resData)
		}
	})
});
//退出
router.get('/user/logout',function(req,res,next){
	req.cookies.set('userInfo',null);
	resData.msg='退出成功';
	res.json(resData)
});
// 提交评论
router.post('/comment/post',function(req,res,next){
	var contentId=req.body.contentId||'';
	var commentData={
		username:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content||''
	};
	
	Content.update({
		_id:contentId
	},{ $addToSet: { comments: commentData} } ).then(function(){
		return Content.findOne({
			_id:contentId
		})
	}).then(function(content){
		resData.code=0;
		resData.msg='评论成功';
		resData.data=content.comments;
		res.json(resData)
	});
});
//获取评论
router.get('/comment',function(req,res,next){
	var contentId=req.query.contentId||'';
	Content.findOne({
		_id:contentId
	}).then(function(content){
		resData.code=0;
		resData.msg='获取成功';
		resData.data=content.comments;
		res.json(resData)
	});
});

module.exports=router;