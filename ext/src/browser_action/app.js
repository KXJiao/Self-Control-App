
var box = document.getElementById("box")
var output= document.getElementById("output")
if(box){
    box.addEventListener('input', function (e) {
        console.log(e.target.value);
        if(output){
            $(output).text(e.target.value);
            chrome.storage.sync.set({ "text" : e.target.value }, function() {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    }, false);
}

function format(display) { //formatter for the 
    return function (minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
    };
}

document.body.onload = function() {

    var timerDisplay = document.querySelector('#timeDisplay');
    var timer;

    var settings = chrome.extension.getBackgroundPage().settings;
    timerDisplay.textContent = settings.get("time");

    (function refreshTimer() {
        timerDisplay.textContent = settings.get("time");
        setTimeout(refreshTimer, 100);
    }());

    chrome.storage.sync.get("text", function(items) {
        if (!chrome.runtime.error) {
            console.log(items);
            $(output).text(items.text);
            $(box).val(items.text);
        }
    });

    chrome.storage.sync.get("data", function(items) {
        if (!chrome.runtime.error) {
            console.log(items);
            document.getElementById("data").innerText = items.data;
        }
    });
    document.getElementById("close").onclick = function(){
        window.close()
    }
    document.getElementById("set").onclick = function() {
        var d = document.getElementById("text").value;
        chrome.storage.sync.set({ "data" : d }, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    }
    console.log(chrome.extension.getBackgroundPage());

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////Stuff below may be moved to the settings page/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.getElementById("setTime").onclick = function() { //When setTime button clicked, sets the timer to be the value from the #time box.
        var time = $('#time').val();
        if(timer!=null){
            timer.stop();
        }
            timer = new CountDownTimer(time);
            timer.onTick(format(timerDisplay)).start(); 

        
    }

    document.getElementById("time").onkeypress = function(e){ //When text is typed into the #time box, checks if it is a number, else returns false
        var charCode = (e.which) ? e.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }





}
