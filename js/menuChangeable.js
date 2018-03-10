showMenu();
var intv = setInterval(showMenu, 120000)

function showMenu(){
	console.log('showMenu');
	var menu = 
		"<h2>Menu</h2>" +
		"<div id='user'></div>" +
	  	"<ul> " +
			" <li><a href='./index.html'>首頁</a></li> " +
			" <li><b>工作區域</b><li> " +
			" <li><a href='./punch.html'>打卡</a></li> " +
			" <li><a href='./Dashboard.html'>儀表板</a></li> " +
			" <li><a href='./count.html'>人數統計工具</a></li> " +
			" <li><a href='./note.html'>交辦事項</a></li> " +
			" <li><a href='./computerCalendarPrivate.html'>電腦借用登記</a></li> " +
			" <li><a href='./UpdateInfo.html'>個人資料更新</a></li> " +
			" <li><a href='./SelfService.html'>工讀生自助區</a><li> " +
			" <li><b>公開區域</b><li> " +
			" <li><a href='./software.html'>軟體查詢</a><li> " +
			" <li><a href='./computercalendar.html'>電腦借用查詢</a><li> " +
			" <li><a href='./imacInfo.html'>iMac軟硬體資訊</a><li> " +
			" <li><a href='./countshow.html'>人數統計</a><li> " +
			" <li><a href='./logout.php?redirect=./index.html'><b>登出</b></a></li> " +
		"</ul> ";
	var menu_NoAuth = 
		"<h2>Menu</h2>" +
		"<ul> " +
			" <li><a href='./index.html'>首頁</a></li> " +
			" <li><a href='./software.html'>軟體查詢</a><li> " +
			" <li><a href='./computercalendar.html'>電腦借用查詢</a><li> " +
			" <li><a href='./imacInfo.html'>iMac軟硬體資訊</a><li> " +
			" <li><a href='./countshow.html'>人數統計</a><li> " +
		"</ul> ";
	$.get('auth.php?info',)
	.done(function(responseText){
		var authJSON = JSON.parse(responseText);
		console.log('menu auth done')
		$("#menu").children().first().html(menu)
		userInfo = "<img  src=" + authJSON.profile + " alt='圖呢QAQ' >"+
			"<p>" + authJSON.name + " 主人<br>您現在的職等是 Rank " + authJSON.rank + " ★ "+ authJSON.rankname + "</p>";
			 		$("#user").html(userInfo);
	})
	.fail(function(){
		console.log('menu auth fail')
		$("#menu").children().first().html(menu_NoAuth)
	})
}