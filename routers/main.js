/*
* @Author: 羊驼
* @Date:   2018-10-14 09:07:51
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-30 13:41:59
*/
var express=require('express');
var router=express.Router();

var Category = require('../modules/category');
var Content = require('../modules/content');

var categories=[];
// 通用数据
router.use('/',function(req,res,next){
	categories=[];
	Category.find().then(function(cas){
		categories=cas;
		next();
	});
});
// 根目录
router.get('/',function(req,res,next){
	var page=Number(req.query.page||1); 
	var limit=3;
	var skip;
	var pageMax;
	var count;
	
	var category=req.query.category||'';
	var where={};
	if (category!='') {
		where.category=category
	};
	Content.where(where).count().then(function(ct){
		// 查询所有的用户
		count=ct;
		pageMax =Math.ceil(count/limit);
		if (page<0) {
			page=1;
		}else if(page>=pageMax){
			page=pageMax
		};
		skip=(page-1)*limit>0?(page-1)*limit:0;
		return Content.where(where).find().limit(limit).skip(skip).populate(['category','user'])
	}).then(function(contents){
		res.render('main/index',{
			userInfo:req.userInfo,
			contents:contents,
			page:page,
			pageMax:pageMax,
			limit:limit,
			categories:categories,
			category:category
		});
	});
});
//读取详情
router.get('/view',function(req,res,next){
	var id=req.query.contentid;
	Content.findOne({
		_id:id
	}).populate(['category','user']).then(function(content){
		content.views++;
		content.save();
		res.render('main/view',{
			userInfo:req.userInfo,
			categories:categories,
			content:content

		});
	})
	
});

module.exports=router;