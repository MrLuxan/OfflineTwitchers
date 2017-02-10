function GetTwitchData(url,callback)
{
	let request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.setRequestHeader('Client-ID', '9iwk2n5r4dyeevkh199jq91q9n1q2i');

	request.onload = function()
	{
		if (request.status >= 200 && request.status < 400) 
	  		callback(JSON.parse(request.responseText));
	}

	request.send();
}

function AddOfflineChannel(target,channelJson)
{
	let banner = (channelJson.video_banner == null ? chrome.extension.getURL('images/offline.png') : channelJson.video_banner);
	let logo = (channelJson.logo == null ? '' : '<a class="boxart" href="/'+channelJson.name+'"><img src="'+channelJson.logo+'"></a>');
	let name = (channelJson.display_name.toLowerCase() == channelJson.name.toLowerCase() ? channelJson.display_name : channelJson.display_name + " (" + channelJson.name + ")")

	let newelement = document.createElement('div');
	newelement.className = 'stream item';

	newelement.innerHTML =	'<div id="ember2640" class="ember-view qa-stream-preview ffz-directory-preview">'+
								'<div class="stream item">' +
									'<div class="content">' +
				    					'<div class="thumb">' +
    										'<a class="cap aspect" href="/'+channelJson.name+'">'+
          										'<img class="aspect__fill" src="'+banner+'">' +
        									'</a>' +
					        				logo +
										'</div>' +
										'<div class="meta">' +
											'<p class="title">' +
												'<a href="/'+channelJson.name+'">' +
													name +
												'</a>' +
											'</p>' +
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';

	target.insertBefore(newelement, target.firstChild);
}


function PlaceHolderString(Number)
{
	let string = "";
	for(let i = 0 ; i < 10; i++)
		string += '<div class="tower_placeholder"></div>';
	return string;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let UserName = document.querySelector(".js-username").innerHTML;
	if(UserName != null)
	{
		let element = document.getElementById('OfflineChannels');
		let url = request.data.url;

		if (typeof(element) == 'undefined' || element == null)
		{
			if(url.endsWith('directory/following/live'))
			{
			    element = document.createElement('div');
			    element.className = 'items-grid';
			    element.id = 'OfflineChannels';	    
			    element.innerHTML = '<div class="section_header"><h3 class="title">Offline channels</h3></div>' +
			    					'<div class="js-streams streams items">' +
			    						'<div id="OfflineChannelsList" class="ember-view infinite-scroll tower tower--bleed tower--240 tower--gutter-sm">'+    
			    						PlaceHolderString(0) +
			    						'</div>' +
			    					'</div>';


			    let target = document.querySelector(".streams-grid.items-grid");
			    target.appendChild(element);

				GetTwitchData('https://api.twitch.tv/kraken/users/'+UserName+'/follows/channels?limit=100' ,function(ChannelsData){
					let list = document.getElementById("OfflineChannelsList");
				    ChannelsData.follows.forEach(function(jsonElement)
				    {
				    	GetTwitchData('https://api.twitch.tv/kraken/streams/' + jsonElement.channel.name ,function(StreamData){
				    		if(StreamData.stream === null)
				    		{
				    			AddOfflineChannel(list,jsonElement.channel);
				    		}
				    	});	
					});
				});
			}
		}
		else
		{
			element.style.display = (url.endsWith('directory/following/live') ? "" : "none");
		}
	}	
});