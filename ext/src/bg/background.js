// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
var timer;
var settings = new Store("settings", {
    "sample_setting": "This is how you use Store.js to remember values",
    "test": "This is a test setting",
    "time": "3600"
});
var blockList = new Store("blockList", {
    "block": ["google.com"],
    "allow": []
});


function getTime(){
	return settings.get("time");

}

function changeTime(n){
  settings.set("time", n)
}

function t(){
  return function(minutes, seconds){
      totaltime = 60*minutes + seconds;
      changeTime(totaltime);
    };
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {


        if(!isNaN(request.variable)){
            if(timer!=null){
                timer.stop();
            }
            changeTime(request.variable);
            timer = new CountDownTimer(parseInt(getTime()));
            timer.onTick(t()).start();


            checkIfTimerIsAlive = (function checkTimer() {  //TODO: make the refresh actually resfresh again
                return function(){ 
                    if((timer.getStartTime()/1000) + timer.getDuration() > (Date.now()/1000)){
                        setTimeout(checkTimer(), 50);
                    }
                    else{
                        blockPages()
                        //setTimeout(checkTimer(), 50);
                    }
                }
            }());
            checkIfTimerIsAlive();

            sendResponse({blah:request.variable});
        }

});

function blockPages(){
    console.log("hello")


    var blocklink = "http://https://obscure-dawn-82138.herokuapp.com/blockpage/" // add the express routing when other stuff is figured out
    chrome.extension.sendRequest({redirect: blocklink}); // send message to redirect

}

document.body.onload = function(){

    if(timer!=null){
        timer.stop();
    }

    timer = new CountDownTimer(parseInt(getTime()));
    timer.onTick(t()).start();
    console.log(timer.getStartTime());

    checkIfTimerIsAlive = (function checkTimer() {  //TODO: make the refresh actually resfresh again
        return function(){ 
            // console.log(timer.getStartTime()/1000)
            // console.log(timer.getDuration())
            // console.log((timer.getStartTime()/1000) + timer.getDuration())

            if((timer.getStartTime()/1000) + timer.getDuration() > (Date.now()/1000)){ 


            setTimeout(checkTimer(), 50);
        }
        else{
            blockPages()
            //setTimeout(checkTimer(), 50);
        }
    }
        
    }());

    checkIfTimerIsAlive();
    debounce = false
    chrome.tabs.onUpdated.addListener(function() {
        if(!debounce){
            debounce = true
            console.log("ONUPDATED WAS JUST CALLED")
            blockPages()
            debounce = false
        }
        
    });
}


