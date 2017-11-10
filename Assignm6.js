var http = require("http").createServer(handler); // on req - hand
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    console.log("Enabling analog Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 12");
    board.pinMode(12, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});

function handler(req, res) {
    fs.readFile(__dirname + "/Assignm6.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }

    res.writeHead(200);
    res.end(data);
    })
}

var desiredValue = 0; // desired value var
var actualValue = 0; // variable for actual value (output value)



board.on("ready", function() {
    
    board.analogRead(0, function(value){
        desiredValue = value; // continuous read of analog pin 0
    });
    board.analogRead(1, function(value) {
        actualValue = value; // continuous read of pin A1
            if (desiredValue < actualValue) {
                console.log("LED OFF");
                board.digitalWrite(13, board.LOW);
                //console.log("value = 0, LED OFF");
            }
            else {
                console.log("LED ON");
                board.digitalWrite(13, board.HIGH);
                console.log("LED OFF");
                board.digitalWrite(12, board.LOW);
                console.log("LED OFF");
                board.digitalWrite(8, board.LOW);
                //console.log("value = 1, LED lit");
            }
            if (desiredValue > actualValue) {
                console.log("LED OFF");
                board.digitalWrite(8, board.LOW);
                //console.log("value = 0, LED OFF");
            }
            else {
                console.log("LED ON");
                board.digitalWrite(8, board.HIGH);
                //console.log("value = 1, LED lit");
                 console.log("LED OFF");
                board.digitalWrite(12, board.LOW);
                console.log("LED OFF");
                board.digitalWrite(13, board.LOW);
            }
             if (desiredValue != actualValue) {
                console.log("LED OFF");
                board.digitalWrite(12, board.LOW);
                //console.log("value = 0, LED OFF");
            }
            else {
                console.log("LED ON");
                board.digitalWrite(12, board.HIGH);
                 console.log("LED OFF");
                board.digitalWrite(13, board.LOW);
                console.log("LED OFF");
                board.digitalWrite(8, board.LOW);
                //console.log("value = 1, LED lit");
            }
    });
    
    io.sockets.on("connection", function(socket) {
    
        socket.emit("messageToClient", "Server connected, board ready.");
        setInterval(sendValues, 40, socket); // na 40ms we send message to client
    }); // end of sockets.on connection
    if (desiredValue < actualValue) {
                console.log("LED OFF");
                board.digitalWrite(13, board.LOW);
                //console.log("value = 0, LED OFF");
            }
            else {
                console.log("LED ON");
                board.digitalWrite(13, board.HIGH);
                //console.log("value = 1, LED lit");
            }
    
}); // end board.digitalRead on pin 2

http.listen(8080); // server will listen on port 8080

function sendValues (socket) {
    socket.emit("clientReadValues",
    {
    "desiredValue": desiredValue,
    "actualValue": actualValue
    });
};