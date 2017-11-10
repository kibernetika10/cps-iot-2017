var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs=require("fs");
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function() { // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Priključitev na Arduino");
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    board.digitalWrite(2,1); // initialization of digital pin 2 to rotate Left on start
    board.digitalWrite(4,0); // initialization of digital pin 2 to rotate Left on start
});
function handler(req, res){
    fs.readFile(__dirname+"/example12.html",
    function(err,data){
        if(err){
            res.writeHead(500, {"Content-type": "text/plain"});
            return res.end("Error loading html pages");
        }
        res.writeHead(200);
        res.end(data);
    })
}
http.listen(8080);
//var ValuePWM=0;

var sendValueViaSocket = function(){};
board.on("ready",function(){
    io.socket.on("sendPWM", function(pwm){
        board.analogWrite(3,pwm);

        io.socket.emit("messageToClient", "PWM set to: " + pwm);        
    });
    
    io.socket.on("left", function(value){
        board.digitalWrite(2,value.AIN1);
        board.digitalWrite(4,value.AIN2);
        io.socket.emit("messageToClient", "Direction: left");
    });
    
    io.socket.on("right", function(value){
        board.digitalWrite(2,value.AIN1);
        board.digitalWrite(4,value.AIN2);
        io.socket.emit("messageToClient", "Direction: right");
    });
    
   io.socket.on("stop", function(value){
        board.analogWrite(3,value);
        io.socket.emit("messageToClient", "STOP");
    });
    /*io.sockets.on("connection",function(socket){
        console.log("Socket id:"+socket.id);
        socket.emit("messageToClient","Src connected, board OK");
        sendValueViaSocket = function(value){
            io.sockets.emit("messageToClient",value);
        }
    });*/
    
    
    /*io.socket.on('messageToClient', function(msg) { // when we receive the message
        log(msg); // we print it to div
    });
    
    io.socket.on('disconnect', function() { // on disconnect
    log("Disconnected from server"); // we print the status to div
});*/
   
});