function CurrentVLab(divid){
	$.get("./google.php?calendar",function(data){
		var obj = JSON.parse(data);
		var status = {"status":"無借用","activity":"","busy":false};
		for(i in obj["items"]){
			var item = obj["items"][i];
			console.log(item);
			start = new Date(item["start"]["dateTime"]);
			end = new Date(item["end"]["dateTime"]);
			if(start < new Date()){
				status["status"]="借用中";
				status["activity"]=item["summary"];
				status["busy"]=true;
			}
		}
		var content = "<div style='margin:10px;padding:10px;border:1px solid'><h2>V.Lab狀態即時報</h2><h3>"+status["status"]+"</h3>";
		if(status["busy"])
			content+="<p>借用活動："+status["activity"]+"</p></div>";
		$("#"+divid).html(content);
	});
}
