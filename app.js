const express = require('express'),
      bodyParser = require('body-parser'),
      multer = require('multer'),
	  cookieParser = require('cookie-parser')
	  fs = require('fs'),
	  app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('www'));
app.use(cookieParser());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'www/uploads')
  },
  filename: function (req, file, cb) {
  	//在req加入一个属性file 属于
  	req.file = file;
  	var name = req.cookies.name;
  	var extension = ''
  	if(file.mimetype == 'image/jpeg'){
  		extension = '.jpg'
  	}else if(file.mimetype == 'image/png'){
  		extension = '.png'
  	}else if(file.mimetype == 'image/gif'){
  		extension = '.gif'
  	}
  	cb(null, name + extension)
  }
})
var upload = multer({ storage: storage });
//---------------------------用户注册
app.post('/user/register',(req,res)=>{
	req.body.ip = req.ip;
	req.body.time = new Date().getTime();
	//注册用户对象
	var user = req.body;
	if(user.password == user.password01){
		//删除再次输入的密码字符串
		delete user.password01;
		// console.log(user)
		// 读取文件
		fs.readFile('users/user.txt',(err,data)=>{
			//字符串
			var users = data.toString().trim();
			var douhao = users.length>0?',':''
			//json对象数组
			var usersArr = JSON.parse('['+users+']');
			var isIn = usersArr.some(function(ele){
				return (user.name == ele.name);
			})
			if(isIn){
				res.status(200).json({code:"error",content:"用户名已注册!"})
			}else{
				fs.appendFile('users/user.txt',douhao+JSON.stringify(user),(err)=>{
					if(!err){
						res.status(200).json({code:"success",content:"恭喜注册成功"})
					}
				})
			}
		})
	}else{
		res.status(200).json({"code":"error","content":"密码输入不一致!"})
	}
})
//---------------------------用户登录
app.post('/user/login',(req,res)=>{
	// console.log(req.body)
	var user = req.body;
	fs.readFile('users/user.txt',(err,data)=>{
		var users = data.toString().trim();
		var usersArr = JSON.parse('['+users+']');
		var isIn = usersArr.some(function(ele){
			return (user.name == ele.name && user.password == ele.password)
		});
		if(isIn){		
			res.status(200).json({code:"success",content:"登录成功!",data:user})
		}else{
			res.status(200).json({code:"error",content:"密码或用户名不正确!"})
		}
	})
})
//---------------------------用户上传
// multer.exports = upload;
app.post('/user/photo',upload.single('photo'),(req,res)=>{
	if(req.file.mimetype == 'image/jpeg'){
		res.status(200).json({code:"success",content:"上传头像成功!"})
	}else{
		res.status(200).json({code:"error",content:"上传失败！头像必须为JPG格式"})
	}	
})
//---------------------------用户提问
app.post('/user/ask',(req,res)=>{
	// console.log(req.body)
	var user = {};
    function formatIp(val){
	if(!val){
		return '';
	}
	val = val == '::1'?'192.168.3.207':val;
	if(val.startsWith('::ffff')){
		val = val.substring(7);
	}
	return val;
    }
	user.content =req.body.content
	user.name = req.cookies.name
	user.ip = formatIp(req.ip);
	user.time = new Date().getTime();
	// console.log(user);
	var txtName = user.time + '.txt'
	fs.appendFile('questions/'+txtName,JSON.stringify(user),(err,data)=>{
		res.status(200).json({code:'success',content:'提问成功提交!'})
	})
})
//---------------------------用户回答
app.post('/user/answer',(req,res)=>{
	var answer = req.body;
	answer.name = req.cookies.name;
	answer.ip = req.ip;
	answer.time = new Date().getTime();
	fs.readFile('questions/'+answer.question+'.txt',(err,data)=>{		
	    if(!err){
	       //当前问题的对象
		   var askObj= JSON.parse(data.toString());
		   if( (typeof askObj.answer) == 'object'){
		   	 askObj.answer.push(answer)
		   }else{
		   	askObj.answer = [];
		   	askObj.answer.push(answer)
		   }
		   fs.writeFile('questions/'+answer.question+'.txt',JSON.stringify(askObj),(err)=>{
		   	if(!err){
		   		console.log(answer)
		   		res.status(200).json({code:'success',content:'回答成功'})
		   	}
		   })		   
	    }
	})
})
//---------------------------问答列表
app.get('/questions',(req,res)=>{
	//读取一个目录
	//files 所有的文件数组
	fs.readdir('questions',(err,files)=>{
	    var questions = [];		
		if(!err){
			//排序
			files.reverse();
			// console.log(files)
			//循环读取文件内容，加入questins数组里
			files.forEach(function(file){
				fs.readFile('questions/'+file,(err,data)=>{
					if(!err){
						questions.push(JSON.parse(data.toString().trim()));
						if(questions.length == files.length){
							// console.log(questions);
							res.status(200).json({code:'success',data:questions})
						}
					}									
				})
		    })		   
		}		
	})
})

app.listen(3000, () => {
  console.log('服务器正常起动');
})
