function refresh(){
	$.getJSON("./note.php?check",function(data){
		for (var k in data["notes"]){
		
		
			$("#note tr:last").after("<tr><td>"+data["notes"][k]["time"]+"</td><td>"+data["notes"][k]["sender"]+"</td><td>"+data["notes"][k]["note"]+"</td><td><button onclick=\"readnote("+data["notes"][k]["id"]+");\">已讀</button></td></tr>");
		

		}
	});
}

function readnote(id){
	$.post("./note.php?read",{"id":+id}).done(function(){
		alert("已讀");
	});
	$("#note tbody").html("<tr><th>時間</th><th>傳送者</th><th>紀錄內容</th><th>已讀</th></tr>");
	refresh();
}
refresh()
