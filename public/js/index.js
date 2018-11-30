/*
* @Author: 羊驼
* @Date:   2018-10-14 13:44:23
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-30 18:02:20
*/
var indexPage={
	init:function(){
		this.bindEvent();
		this.loginStatus();
		//获取评论
		if ($('#messageContent').data('id')) {
			this.loadComment({
				contentId:$('#messageContent').data('id')
			});
		}
		
	},
	renderHTML:function(template,data){
		var html=Hogan.compile(template).render(data);
		return html;
	},
	loginStatus(){//判断登录状态
		var userInfo= $.cookie('userInfo');
		if (userInfo) {
			$('#user_box').show().siblings().hide();
			$('#user_box').find('.username').html(JSON.parse(userInfo).username);	
		}else{
			$('#login_box').find('.err_tips').hide();
			$('#login_box').find('input').val('');
			$('#login_box').show().siblings().hide();
		};
	},
	bindEvent:function(){
		var _this=this;
		$(document).on('click','#toRegister',function(){
			$('#login_box').hide();
			$('#register_box').show();
			$('#login_box').find('input').val('');
			$('.err_tips').hide();
		});
		$(document).on('click','#toLogin',function(){
			$('#register_box').hide();
			$('#login_box').show();
			$('#register_box').find('input').val('');
			$('.err_tips').hide();
		});
		// 返回上一页
		$(document).on('click','#return',function(){
			window.history.back();
		});
		// 注册事件
		$(document).on('click','.register_btn',function(){
			$('#register_box').find('.err_tips').hide();
			var data={
				username:$.trim($('#register_username').val()),
				password:$.trim($('#register_password').val()),
				repassword:$.trim($('#register_password_s').val())
			};
			var result=_this.dataVilidata(data);
			if (result.status) {
				_this.register(data);
			}else{
				$('#register_box').find('.err_tips').show().html(result.msg);
			}
		});
		//登录事件
		$(document).on('click','.login_btn',function(){
			$('#login_box').find('.err_tips').hide();
			var data={
				username:$.trim($('#login_username').val()),
				password:$.trim($('#login_password').val())
			};
			var result=_this.dataVilidata(data);
			if (result.status) {
				_this.login(data);
			}else{
				$('#login_box').find('.err_tips').show().html(result.msg);
			}
		});
		// 退出
		$(document).on('click','#logOut',function(){
			_this.logOut();
		});
		//提交评论
		$(document).on('click','#messageBtn',function(){
			if ($('#messageContent').val()=='') {
				alert('内容不能为空')
			}else{
				var data={
					contentId:$('#messageContent').data('id'),
					content:$('#messageContent').val()
				};
				_this.commentPost(data);
			};
		});
		
	},
	//初始化评论列表
	loadComment:function(data){
		var _this=this;
		$.ajax({
				url:'/api/comment',
				type:'get',
				dataType:'json',
				data:data,
				success:function(res){
					_this.commentList(res.data);
				},
				error:function(){
					alert('评论失败');
				}
			})
	},
	commentList:function(data){
		var template=`
		{{#data}}
			<div class="msg">
        		<p class="msg_line">
        			<span class="msg_user">{{username}}</span>
        			<span class="msg_time">{{postTime}}</span>
        		</p>
        		<p class="msg_content">{{content}}</p>
        	</div>
		{{/data}}
		`;
		var html=this.renderHTML(template,{data:data});
		$('.messageList').html(html);
		$('#messageCount').html(data.length);
	},
	dataVilidata:function(data){
		var result={
			status:true,
			msg:''
		};
		if (data.username==='') {
			return result={
				status:false,
				msg:'用户名不能为空'
			};
		}
		if (data.password==='') {
			return result={
				status:false,
				msg:'密码不能为空'
			};
		}
		if (data.password.length<6) {
			return result={
				status:false,
				msg:'密码不能少于6位'
			};
		}
		if (data.repassword) {
			if (data.repassword==='') {
				return result={
					status:false,
					msg:'确认密码不能为空'
				};
			}
			if (data.repassword!=data.password) {
				return result={
					status:false,
					msg:'两次密码不一致'
				};
			}
		};
		
		return result;
	},
	register:function(data){
		var _this=this;
		$.ajax({
				url:'/api/user/register',
				type:'post',
				data:data,
				dataType:'json',
				success:function(res){
					if (res.code===0) {
						$('#register_box').find('.err_tips').show().html(res.msg);
						setTimeout(function(){
							_this.loginStatus();
						},800);
					}else{
						$('#register_box').find('.err_tips').show().html(res.msg);
					}
				},
				error:function(){
					alert('注册失败')
				}
			})
	},
	login:function(data){
		var _this=this;
		$.ajax({
				url:'/api/user/login',
				type:'post',
				data:data,
				dataType:'json',
				success:function(res){
					if (res.code===0) {
						$('#login_box').find('.err_tips').show().html(res.msg);
						setTimeout(function(){
							$('#login_box').hide();
							$('#user_box').show().find('.username').html(res.userInfo.username);
							$('#login_box').find('.err_tips').hide();
							window.location.reload();
						},600);
					}else{
						$('#login_box').find('.err_tips').show().html(res.msg);
					};
				},
				error:function(){
					alert('登录失败');
				}
			})
	},
	logOut:function(){
		var _this=this;
		$.ajax({
				url:'/api/user/logout',
				type:'get',
				dataType:'json',
				success:function(res){
					_this.loginStatus();
					alert(res.msg);
					window.location.reload();
				},
				error:function(){
					alert('退出失败');
				}
			})
	},
	commentPost:function(data){
		var _this=this;
		$.ajax({
				url:'/api/comment/post',
				type:'post',
				dataType:'json',
				data:data,
				success:function(res){
					alert(res.msg);
					$('#messageContent').val('');
					_this.commentList(res.data);
				},
				error:function(){
					alert('评论失败');
				}
			})
	}
};

$(function(){
	indexPage.init();
})