
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

function timeFormat(time) {
    if(!isNaN(time)){
        hr = parseInt(time / 3600, 10);
        min = parseInt((time % 3600) / 60);
        sec = parseInt((time % 3600) % 60);
        
        hr = hr < 10 ? "0" + hr : hr;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;

        return hr + ":" + min + ":" + sec;
    }
}


document.body.onload = function() {

    var timerDisplay = document.querySelector('#timeDisplay');
    var timer;

    var settings = chrome.extension.getBackgroundPage().settings;

    console.log(settings.get("time"));
    timerDisplay.textContent = timeFormat(settings.get("time"));

    var refresh;
    refresh = (function refreshTimer() {  //TODO: make the refresh actually resfresh again
        return function(){ 
            timerDisplay.textContent = timeFormat(settings.get("time"));
            if(!parseInt(settings.get("time")) <= 0)
                setTimeout(refreshTimer(), 50);
        
        }
        
    }());
    refresh()

    //refreshTimer();



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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////Stuff below may be moved to the settings page/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.getElementById("setTime").onclick = function() { //When setTime button clicked, sets the timer to be the value from the #time box.
        var time = $('#time').val();
        if(time <= 1440){
            time = time * 60;
            chrome.runtime.sendMessage({variable: time},
                function (response){
                    newTime = response.blah;
                    $("#test").text(timeFormat(newTime));
                    refresh();
            });
        }

        
    }

    document.getElementById("time").onkeypress = function(e){ //When text is typed into the #time box, checks if it is a number, else returns false
        var charCode = (e.which) ? e.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }





}
