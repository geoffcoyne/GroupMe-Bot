var http = require('http');
var HTTPS = require('https');

var botID = "Put Bot ID here";

var promptRegEx = /\?prompt/i;
var commandRegEx = {
    say: / -say /
};

server = http.createServer(function (req, res) {
    req.on('data', function(data) {
        parsedData = JSON.parse(data);
        console.log("recieved data \n \n" + data + "\n\n" + parsedData.sender_type);
        if (parsedData.text.search(promptRegEx) != -1 && parsedData.sender_type != "bot"){
            if(parsedData.text.search(commandRegEx.say) != -1){
                var location = parsedData.text.search(commandRegEx.say);
                postMessage(parsedData.text.slice(location + 6));
            } 
            else {
                console.log("string contains ?prompt = true");
                postMessage("Possible commands are: \n \n ?prompt : prints this text \n \n prompt -say TEXT : prints the text that follows -say \n \n More command coming soon!");
            }
        } 
    });
});

function postMessage(message){
    var options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };
    var body = {
        "bot_id": botID,
        "text" : message
    }
    
    console.log ("Sending "+ message + " to " + botID);

    var botReq = HTTPS.request(options, function(res){
        console.log("statusCode: " + res.statusCode);
    });

    botReq.end(JSON.stringify(body));
}

server.listen(5000);
