header =
"	<div class='inner'> " + 
"		<!-- Logo -->" + 
"			<a href='/' class='logo'>" + 
"				<span class='symbol'><img src='images/logo.svg' alt='' /></span><span class='title'>V.Lab Staff</span>" + 
"			</a>" + 
"		<!-- 登入狀態 -->" + 
"			<div id='welcome' style='margin:0 0 2em 0' ></div> " +
"		<!-- Nav -->" + 
"			<nav>" + 
"				<ul>" + 
"				<li><a href='#menu'>Menu</a></li>" + 
"				</ul>" + 
"			</nav>" + 
"	</div>" 

$.get('auth.php?info', function( responseText ){
	var authJSON = JSON.parse( responseText );
	$("#header").append(header) ;
	var hello = "<p align='right' >" + authJSON.rankname + " ★ " + authJSON.name + " 主人，您好</p>";
	$("#welcome").append(hello) ;
	checkPunch();
})
.fail(function(){
	$("#header").append(header) ;
	notLogin = "<p align='right' > ～歡迎光臨V.Lab～ <br> 主人請<a href='login.html'>登入</a>唷</p>";
	$("#welcome").append(notLogin)
})

function checkPunch(){
	$.get('punch.php?check', function(responseText){
		var punchJSON = JSON.parse(responseText);
		console.log(punchJSON);
		if ( punchJSON.status == 'ok' ){
			if ( punchJSON.workstatus == 'Working' ){
				$("#welcome").children().append( '<br>上班要加油唷(=OωO)ﾉ');
			}else{
				$("#welcome").children().append( '<br>下班請好好休息ヽ(●´∀`●)<br>上班請記得<a href="Punch.html">打卡</a>');
			}
		}else{
			$("#welcome").children().append( '<br>薛丁格的打卡@H@');
		}
	})
}
