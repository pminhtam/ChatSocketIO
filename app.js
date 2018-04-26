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
io.on("connection",function(socket){	//mỗi kết nối có một biến socket riêng
	console.log("Co nguoi vua ket noi , soket id la" + socket.id);
	socket.emit("server-send-du-lieu-cho-nguoi-moi",mangUserOnline);	// gửi toàn bộ danh sách user cho người vừa truy cập
	socket.on("client_gui_username",function(data){
		console.log("co nguoi dang ky voi ten la: " + data);
		if(mangUserOnline.indexOf(data)>=0){
			socket.emit("server-send-dangki-thatbai",data);//đăng ký trùng tên
		}
		else{
			mangUserOnline.push(data);
			socket.Username = data;
			console.log("Username la: "+ socket.Username);
			io.sockets.emit("server-send-co-nguoi-dangki-thanhcong",data);//gửi tên người vừa đăng ký cho tất cả mọi người khác
			socket.emit("server-send-dangki-thanhcong",data);	//sự kiện để ẩn ô đăng ký đi
		};
	});
	socket.on("client_gui_message",function(data){
		console.log("Username la: "+socket.Username + "  "+ data);
		io.sockets.emit("server_gui_message",{Username:socket.Username,msg:data});
		console.log("Vua nhan tin nhan thi :  "+ mangUserOnline);

	});
	socket.on("disconnect",function(){	//Khi thoát thì xóa tên người đó khỏi danh sách user
		console.log("Truoc xoa   "+mangUserOnline);
		var vitrixoa = mangUserOnline.indexOf(socket.Username);	//tìm vị trí của phần tử có tên socket.Username
		console.log("Vi tri xoa    "+vitrixoa);
		mangUserOnline.splice(vitrixoa,1);	//xóa 1 phần tử ở vitrixoa
		io.sockets.emit("server-send-co-nguoi-thoat",mangUserOnline);
		console.log("Sau xoa   "+mangUserOnline);
	});
});



app.get("/",function(req,res){
	res.render("trangchu");
});
