// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
var timer;
var settings = new Store("settings", {
    "sample_setting": "This is how you use Store.js to remember values",
    "test": "This is a test setting",
    "time": "3600"
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
  	// chrome.pageAction.show(sender.tab.id);
   //  sendResponse();

//current work:
    // if (request.msg.includes("timerChange")){
    //   timerChange(request.msg.indexOf("timerChange"));
    // }

    if(!isNaN(request.variable)){
      if(timer!=null){
        timer.stop();
      }
      changeTime(request.variable);
      timer = new CountDownTimer(parseInt(getTime()));
      timer.onTick(t()).start();

      sendResponse({blah:request.variable});
    }

});

document.body.onload = function(){

  if(timer!=null){
    timer.stop();
  }

  timer = new CountDownTimer(parseInt(getTime()));
  timer.onTick(t()).start();

  
}