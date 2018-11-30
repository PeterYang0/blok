/*
* @Author: 羊驼
* @Date:   2018-10-13 22:59:51
* @Last Modified by:   羊驼
* @Last Modified time: 2018-11-09 15:53:27
*/
// 加载express
var express = require('express');
// 加载模板处理模块
var swig = require('swig');
// 加载数据库模块
var mongoose=require('mongoose');
// 加载body-parser处理提交的数据；
var bodyParser=require('body-parser');
// 加载cooike模块
var Cookies=require('cookies');
// 创建app => Node.js Http.createServer();
var app = express();
// 引入用户
var User=require('./modules/user');

// 配置模板；
// 定义当前使用的模板引擎；
// 第一个参数的名称是名称，也是后缀；
// 第二个参数定义解析的方法；
app.engine('html',swig.renderFile);
// 设置模板路径,第一个参数固定写死的views，第二个参数是路径位置
app.set('views','./views/');
// 注册使用的模板引擎，第一个必须是'view engine'，第二个参数和定义的后缀要一致
app.set('view engine','html');
// 开发过程中要取消模板的缓存，每次都重新渲染
swig.setDefaults({cache:false});

//静态文件的托管
// 当访问的url以public开始，就放回此目录下的文件
app.use('/public',express.static(__dirname+'/public'));
// bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));
// 当访问时配置cookies
app.use(function(req,res,next){
	req.cookies=new Cookies(req,res);
	// 登录信息
	req.userInfo={};
	if (req.cookies.get('userInfo')) {
		try{
			req.userInfo=JSON.parse(req.cookies.get('userInfo'));
			// 判断是否为管理员
			User.findOne({_id:req.userInfo._id}).then(function(userInfo){
				req.userInfo.isAdmin=userInfo.isAdmin;
				next();
			});
		}catch(e){
			next();
			console.log('error')
		}
	}else{
		next();
	}
});

// 分三个模块、、后台、、接口、、前台
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
// req=>request对象，//res输出对象 、//next 函数

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27018/blok',function(err){
		if (err) {
			console.log('数据库连接失败');
		}else{
			console.log('数据库连接成功');
			// 监听端口
			app.listen(8081,function(){});
		}
});


// 用户发送http请求=》url=》解析路由=》找到匹配规则=》执行绑定函数=》返回相应内容
// 以/public开头的就是静态文件，直接返回指定文件，其他的是动态的》处理业逻辑》加载模板》解析模板》最后返回数据