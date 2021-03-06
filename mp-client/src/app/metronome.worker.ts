/// <reference lib="webworker" />

var timerID=null;
var interval=100;

addEventListener('message', ({ data }) => {
	if (data=="start") {
		timerID=setInterval(function(){postMessage("tick");},interval)
	}
	else if (data.interval) {
		console.log("setting interval");
		interval=data.interval;
		console.log("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval)
		}
	}
	else if (data=="stop") {
		clearInterval(timerID);
		timerID=null;
	}
});
