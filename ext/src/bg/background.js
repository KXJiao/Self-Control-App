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
                        console.log((Date.now()/1000) - (timer.getStartTime()/1000 + timer.getDuration()))
                        setTimeout(checkTimer(), 50);
                    }
                    else{
                        blockPages()
                        return false
                    }
                }
            }());

            checkIfTimerIsAlive();

            sendResponse({blah:request.variable});
        }

});

function blockPages(){
    console.log("hello");

    var blocklink = "https://obscure-dawn-82138.herokuapp.com/blockpage/" // add the express routing when other stuff is figured out

    //chrome.extension.sendRequest({redirect: blocklink}); // send message to redirect

    chrome.runtime.sendMessage({redirect: blocklink}); //is not called

    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //         chrome.tabs.sendMessage(tabs[0].id, {redirect: blocklink}, function(response) {
    //             console.log("reached")
    //         });
    //     });

    console.log("function end reached");

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
            if((timer.getStartTime()/1000) + timer.getDuration() > (Date.now()/1000)){ 
                console.log((Date.now()/1000) - (timer.getStartTime()/1000 + timer.getDuration()))
                setTimeout(checkTimer(), 50);
            }
            else{
                blockPages()
                return false
            }
        }
        
    }());

    checkIfTimerIsAlive();


}



// chrome.tabs.onUpdated.addListener(function() { //This function will need to be changed
//     //console.log("ONUPDATED WAS JUST CALLED")
    
//     var tab, url;
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, function(tabs) {
//         tab = tabs[0];
//         url = tab.url;
//     });
//     console.log(tabs)
//     console.log(tab)
//     console.log(url)
//     blockPages()

// });
