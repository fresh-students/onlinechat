const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http, { cors: true })
var name = ""
var count = 0
app.all('*', function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
});  
app.get('/',(req,res)=>{
  // 保存用户的名称
  name = req.query.username
  // 返回状态码，通过状态码执行客户端页面跳转
  res.send({state:200})
  // res.sendFile(__dirname + '/index.html')
})
//入口函数，连接进程
io.on('connection', function (socket) {
  // 每建立连接一次，在线人数减一
  count++
  //这里是发送消息
  // on用来监听客户端message事件，回调函数处理。
  socket.on('message', function (msg) {
    // 如果在这里通过url解析的username来改变下面33行即将渲染的name，会出现异步问题。name还没有赋值就被传到客户端
    // 所以通过ajax请求，先让后端拿到username，然后再做提示信息的渲染
    console.log(msg.username+':'+ msg.inpval);
    // 将客户端发送来的消息中转给所有客户端
    io.emit('message', msg)
  });
  // loginin是自定义事件，第二个参数返回数据对象用于渲染，用于登陆后向客户端发送用户登录信息
  io.emit('loginin',{count,des:'温馨提示：'+name+'加入聊天室'})
  //登陆后向客户端发送用户退出信息
  socket.on('disconnect', function () {
    // loginout是自定义事件，第二个参数返回数据对象用于渲染
    count--
    io.emit('loginout',{count,des:'温馨提示：'+name+'用户退出聊天室'})
    // 连接每断开一次，在线人数减一
  })
});
http.listen(3000, function () {
  console.log('listening:3000')
})