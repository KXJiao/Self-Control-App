
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

            //$('#test').attr('alt', e.target.value);
            //output.innerHTML = e.target.value
        }
    }, false);
}



var cool = document.getElementById("cool")
if(cool){ //please move to the onLoad
    cool.addEventListener("click", getRandomColor);
}


function change(color) { //changes the background to the given color
	document.body.style.backgroundColor = color;
}

function closeWindow(){
    window.close()
}

function getRandomColor() { //gets a random color and changes background to that color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
   	}
    change(color)
    cs('color', color, 3650)
    chrome.storage.sync.set({'color': color}, function() {
          console.log('Settings saved');
        });
    return color;
}

/////////////////////////////////////////////////////////////////////////////////////////
//cookies will be removed

function cs(n, v, t){ //sets cookie
    var d = new Date();
    d.setTime(d.getTime() + (t*24*60*60*1000));
    var e = "expires="+ d.toUTCString();
    document.cookie = n + "=" + v + ";" + e + ";path=/";
}

function gc(n){ //gets cookie
    var nm = n + "="
    var ca = document.cookie.split(';')
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(nm) == 0) {
            return c.substring(nm.length,c.length);
        }
    }
    return "";
}
/////////////////////////////////////////////////////////////////////////////////////////

function format(display) { //formats the displayed time for the timer
    return function (minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
    };
}

document.body.onload = function() {
    change(gc('color')) //sets the current color to the stored color value

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
        closeWindow()
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
