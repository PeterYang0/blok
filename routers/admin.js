/*
* @Author: 羊驼
* @Date:   2018-10-14 09:07:36
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-29 18:36:59
*/
var express=require('express');
var router=express.Router();
// 引入用户
var User=require('../modules/user');
// 引入分类
var Category=require('../modules/category');
var Content=require('../modules/content');

//判断权限
router.use('/',function(req,res,next){
	if (!req.userInfo.isAdmin) {
		res.send('对不起，您不是管理员，无法进去后台管理系统');
		return 
	}else{
		next();
	};
});

router.get('/',function(req,res,next){
	res.render('admin/index',{userInfo:req.userInfo});
});

// 用户管理模块
// limit()限制条数
// skip()忽略条数

router.get('/user',function(req,res,next){
	var page=Number(req.query.page||1); 
	var limit=4;
	var skip;
	// 查询总条数
	User.count().then(function(count){
		// 查询所有的用户
		var pageMax =Math.ceil(count/limit);
		if (page<0) {
			page=1;
		}else if(page>=pageMax){
			page=pageMax
		};
		skip=(page-1)*limit>0?(page-1)*limit:0;
		User.find().limit(limit).skip(skip).then(function(users){
			res.render('admin/user',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				pageMax:pageMax,
				limit:limit,
				count:count
			});
		});
	});
});
//分类首页
router.get('/category',function(req,res,next){
	Category.find().then(function(categories){
		res.render('admin/category',{
			userInfo:req.userInfo,
			categories:categories
		});
	});
});
//分类添加
router.get('/category/add',function(req,res,next){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	});
});
//删除分类
router.post('/category/delete',function(req,res,next){
	var id=req.body.id||'';
	
	Category.remove({
		_id:id
	}).then(function(){
		res.json({
			code:0,
			msg:'删除成功'
		});
	});
	Content.remove({
		category:id
	}).then(function(){
		
	});
});
//编辑分类
router.post('/category/adit',function(req,res,next){
	var id=req.body.id||'';
	var name=req.body.name||'';
	Category.findOne({
		_id:id
	}).then(function(category){
		if (category) {
			if (name.toLowerCase()==category.name.toLowerCase()) {
				res.json({
					code:0,
					msg:'修改名称不能与原名称相同'
				});
				return
			}else{
				return Category.update({
					_id:id
				},{
					name:name
				});
			}
		}else{
			res.json({
				code:1,
				msg:'分类名称不存在'
			});
			return 
		}
	}).then(function(){
		res.json({
			code:0,
			msg:'修改成功',
			name:name
		});
	});
});
// 以post方式保存分类信息
router.post('/category/add',function(req,res,next){
	var category=req.body.category.toLowerCase()||'';
	if (category==='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'分类名称不能为空'
		});
		return
	}
	// 不为空，判断字段
	Category.findOne({
		name:category
	}).then(function(info){
		if (info) {//分类名称已存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				msg:'分类名称已存在'
			});
			return Promise.reject()
		}else{
			return new Category({
				name:category
			}).save();
		}
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'分类名称保存成功',
			url:'/admin/category'
		});
	});
});
//内容信息
router.get('/content',function(req,res,next){
	var page=Number(req.query.page||1); 
	var limit=4;
	var skip;
	// 查询总条数
	Content.count().then(function(count){
		// 查询所有的文章
		var pageMax =Math.ceil(count/limit);
		if (page<0) {
			page=1;
		}else if(page>=pageMax){
			page=pageMax
		};
		skip=(page-1)*limit>0?(page-1)*limit:0;
		Content.find().limit(limit).skip(skip).populate(['category','user']).then(function(contents){
			res.render('admin/content',{
				userInfo:req.userInfo,
				contents:contents,
				page:page,
				pageMax:pageMax,
				limit:limit,
				count:count,
			});
		});
	});
});
//添加文章
router.get('/content/add',function(req,res,next){
	Category.find().then(function(categories){
		res.render('admin/content_add',{
			userInfo:req.userInfo,
			categories:categories
		});
	});
});
//post添加文章信息
router.post('/content/add',function(req,res,next){
	if (req.body.title=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章标题不能为空'
		});
		return 
	}
	if (req.body.description=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章简介不能为空'
		});
		return
	}
	if (req.body.content=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章内容不能为空'
		});
		return 
	};
	//保存数据
	new Content({
		category:req.body.category,
		title:req.body.title,
		description:req.body.description,
		content:req.body.content,
		user:req.userInfo._id
	}).save().then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'文章内容保存成功',
			url:'/admin/content'
		});
	})
});
//修改文章
router.get('/content/edit',function(req,res,next){
	var id=req.query.id||'';
	var categories=[];
	Category.find().then(function(result){
		categories=result;
		return Content.findOne({_id:id}).populate({path: 'category'});
	}).then(function(content){
		res.render('admin/content_edit',{
			userInfo:req.userInfo,
			content:content,
			categories:categories
		});
	});
});
//保存修改文章
router.post('/content/edit',function(req,res){
	var id=req.query.id||'';
	if (req.body.title=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章标题不能为空'
		});
		return 
	}
	if (req.body.description=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章简介不能为空'
		});
		return
	}
	if (req.body.content=='') {
		res.render('admin/error',{
			userInfo:req.userInfo,
			msg:'文章内容不能为空'
		});
		return 
	};
	Content.update({
			_id:id
		},{
			category:req.body.category,
			title:req.body.title,
			description:req.body.description,
			content:req.body.content
		}
	).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'文章修改成功',
			url:'/admin/content'
		});
	});
});
//删除文章
router.get('/content/delete',function(req,res,next){
	var id=req.query.id||'';
	Content.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'删除成功',
			url:'/admin/content'
		});
	});
});

module.exports=router;