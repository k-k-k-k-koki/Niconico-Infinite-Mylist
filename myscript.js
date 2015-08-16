var urlnum="";
	//すでに登録されている動画の数を取得
	(function(){chrome.storage.local.get(['urlnum'],function(item){
		urlnum = item.urlnum;
		//動画が登録されていない場合は登録動画数を０に設定
		if(urlnum == undefined){
			urlnum = 0;
		}
		console.log(urlnum);
	});
})();


$("#addnim").on("click",function(){
	chrome.tabs.getSelected(null,function(tab){

		var item = Object();
		var key = urlnum;
		//動画ＵＲＬから「sm～」だけをkeyに設定
		item[key] = document.createTextNode(tab.url).nodeValue.match(/sm[0-9]+/)[0];//後ろにnodeValueという方法に気付かなくて苦労したｗ
		//console.log(urlnum);
		// localstorageへ保存
		chrome.storage.local.set(item,function(){
    		console.log(item);
    		console.log("item saved");
  		});
  		urlnum++;
  		var item2 = {
  			'urlnum' : urlnum
  		};
  		chrome.storage.local.set(item2,function(){
  			console.log("saved movies："+urlnum);
  		});
	});
});


$("#gonim").on("click",function(){
	window.open("NIM.html");
});

$("#remove").on("click",function(){
	for(var i=0;i<urlnum;i++){
	var key = String(i);
	chrome.storage.local.remove(key,function(items){
		//var geturl = item.value;
		console.log(items);
		//console.log('item:'+item);
	});
}
var item3 = {
  			'urlnum' : 0
  		};
  		chrome.storage.local.set(item3,function(){
  			console.log("saved movies："+urlnum);
  		});
  		urlnum = 0;
});

$("#getnim").on("click",function(){
	var count = urlnum-1;
	//新しく追加した順に表示
	for(var i=urlnum-1;i>=0;i--){
	var key = String(i);
	console.log(key);
	chrome.storage.local.get(key,function(items){
		//console.log(items[count]);
		var reqURL = "http://ext.nicovideo.jp/api/getthumbinfo/"+items[count];
		$.ajax({
			url:reqURL,
			dataType:"xml",
			success:function(data){
				var title = $(data).find("title").text();
				var thumbnail_url = $(data).find("thumbnail_url").text();
				var nicourl = "http://www.nicovideo.jp/watch/"+$(data).find("video_id").text();
				var plays = $(data).find("view_counter").text();
				var comments = $(data).find("comment_num").text();
				var mylists = $(data).find("mylist_counter").text();
				//console.log(title+thumbnail_url);
				//画像の周りに文字を回り込ませるには<BR clear="left">っていうのを使う
				$("p").append("<img align='"+"left"+"'' src='"+thumbnail_url+"'><a target='"+"_blank"+"' href='"+nicourl+"'>"+title+"</a><br>plays : "+plays+"<br>comments : "+comments+"<br>mylists : "+mylists+"<BR clear='"+"left"+"'><br>");
			}
		});
		//$("p").append("");
		//console.log('item:'+item);
		count--;
		});
	}
});




