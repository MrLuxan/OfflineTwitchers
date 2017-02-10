chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"){
        if(tab.url.includes('twitch.tv/directory/following'))
        {
        	chrome.tabs.sendMessage(tabId, {data: tab}, function(response) {});
    	}
    }
});