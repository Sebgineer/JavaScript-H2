var messages;
var messageID = 0;
var button = document.getElementById("button");

//  kalder api'en i Get metode
function GetChatJson() {
    $.ajax({
        type: "GET",
        url: "http://chillyskye.dk/api/",
        data: { "amount": 10 },
        dataType: "json",
        success: function (response) {
            //gir apien json til showMessages metoden
            showMessages(response);
        }
    });
}

//sender en post til apien.
function sendMessege(name, message) {
    $.ajax({
        type: "POST",
        url: "http://chillyskye.dk/api/",
        data: { name: name, message: message },
    });
}

function showMessages(messages) {
    messages.forEach(element => {
        if (element.id > messageID) {
            messageID = parseInt(element.id)
            let time = new Date(element.timestamp * 1000);
            createMessage(element.name, element.message, getDateString(time));
            scrolldown();
        }
    });
}

//scroll down to newest message
function scrolldown() {
    let element = document.getElementById("MessageBox");
    element.scrollTop = element.scrollHeight;
}

// create messege element in html
function createMessage(name, message, date) {
    let element = document.getElementById("MessageBox");
    element.innerHTML += "<article class=\"message\"><span class=\"time\">" + date + "</span><p><span>" + name +"</span>: <span>" + message + "</span></p></article>"
}

button.addEventListener("click", clickEnterMessage, false);

document.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        clickEnterMessage();
    }
    else if (document.activeElement !== document.getElementById("name")){
        document.getElementById("message").focus();
    }
});

function clickEnterMessage() {
    let name = document.getElementById("name");
    let message = document.getElementById("message");
    if (!isEmptyOrSpaces(name.value)) {
        localStorage.name = name.value;
        if (!isEmptyOrSpaces(message.value)) {
            sendMessege(name.value, message.value);
            GetChatJson();
            message.value = "";
        }
        else {
            alert("You need to type a message before send");
        }
    }
    else {
        alert("You need a name to type");
    }
}

//
function getDateString(date = Date) {
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

//checks if string is empty.
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

window.onload = function() {
    //sets a timer to refresh
    console.log(localStorage.name);
    
    //
    document.getElementById("name").value = localStorage.name;


    setInterval(function() {
        GetChatJson();
        console.log("ping");
    }, 5000);
    GetChatJson();
}