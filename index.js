// https://www.youtube.com/watch?v=O2zmHDdBZK4&t=5s
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var mangUserOnline = [];
io.on("connection",function(socket){
	console.log("Co nguoi vua ket noi , soket id la" + socket.id);
	socket.emit("server-send-du-lieu-cho-nguoi-moi",mangUserOnline);
	socket.on("client_gui_username",function(data){
		console.log("co nguoi dang ky voi ten la: " + data);
		if(mangUserOnline.indexOf(data)>=0){
			socket.emit("server-send-dangki-thatbai",data);
		}
		else{
			mangUserOnline.push(data);
			socket.Username = data;
			console.log("Username la: "+ socket.Username);
			io.sockets.emit("server-send-co-nguoi-dangki-thanhcong",data);
			socket.emit("server-send-dangki-thanhcong",data);
		};
	});
	socket.on("client_gui_message",function(data){
		console.log("Username la: "+socket.Username + "  "+ data);
		io.sockets.emit("server_gui_message",{Username:socket.Username,msg:data});
	});
	socket.on("disconnect",function(){
		console.log(mangUserOnline);
		var vitrixoa = mangUserOnline.valueOf(socket.Username);
		mangUserOnline.splice(vitrixoa,1);
		io.sockets.emit("server-send-co-nguoi-thoat",mangUserOnline);
	});
});



app.get("/",function(req,res){
	res.render("trangchu");
});
