/*
* @Author: 羊驼
* @Date:   2018-10-30 16:45:59
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-20 19:26:36
*/
$(function(){
	adminPage.init();
});

var adminPage={
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){
		var _this=this;
		//编辑按钮
		$(document).on('click','.categoryAdit',function(){
			var name=window.prompt('请输入修改的分类名称');
			if (name) {
				var id=$(this).data('id');
				_this.categoryAdit(id,name);
			};
		});
		//删除按钮
		$(document).on('click','.categoryDelete',function(){
			var id=$(this).data('id');
			if(confirm('确认删除吗？')){
				_this.categoryDelete(id);
			};
		})
	},
	categoryAdit:function(id,name){
		var data={
			id:id,
			name:name
		};
		var _this=this;
		$.ajax({
				url:'/admin/category/adit',
				type:'post',
				data:data,
				dataType:'json',
				success:function(res){
					alert(res.msg);
					window.location.reload();
				},
				error:function(){
					alert('编辑失败')
				}
		})
	},
	categoryDelete:function(id){
		var data={
			id:id
		};
		var _this=this;
		$.ajax({
				url:'/admin/category/delete',
				type:'post',
				data:data,
				dataType:'json',
				success:function(res){
					alert(res.msg);
					window.location.reload();
				},
				error:function(){
					alert('删除失败')
				}
		})
	}
}