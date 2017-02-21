chrome.runtime.onMessage.addListener(function(message, sender){
	console.log("hello part 2")
	if(message.redirect){
		chrome.tabs.update({url: message.redirect}); //sender.url.id
		console.log("redirect end")
		return true
	}
});