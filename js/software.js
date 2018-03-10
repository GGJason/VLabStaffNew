
var softwareInfoBlank = "<h2>選擇下方軟體來查詢軟體資訊</h2>"

var searchSoftHtml = '<i class="fa fa-search" aria-hidden="true"></i>' + 
'<input type="text" id="searchInput" onkeyup="filterByName()" placeholder="輸入想要查詢的軟體名稱">'

//main
$.get("auth.php?info", function(){
	softwareList(true);
	$("#softwareInfo-table").html( softwareInfoBlank );
	$("#searchSoft").html( searchSoftHtml );
})
.fail( function(){
	softwareList(false);//not logged in
	$("#softwareInfo-table").html( softwareInfoBlank );
	$("#searchSoft").html( searchSoftHtml );
})

//取得軟體清單
function softwareList( loggedIn ){
	$.get( "software.php?list", function( responseText ) {
		var softListJSON = responseText.softwares;
		var html = "<table><tbody>"
		for ( i in softListJSON ){
			html += "<tr class='softwareListTr'><td class='softwareListTd'>" + softListJSON[i].name + "</td></tr>";
		}
		html += "</tbody></table>";
		$("#software-table").html(html);
		$('#filter-software-table').html(html);
		$('#filter-software-table').hide();
		$(".softwareListTd").click(function(){
			console.log( $(this).html() );
			softwareByName($(this).html(), loggedIn);
		})
	})
	.done( console.log( "soft list done" ) )
	.fail( console.log( "soft list fail" ) )
}

//取得單一軟體資訊
function softwareByName(softwareName, loggedIn){
	$.get("software.php?name=" + softwareName, function( responseText ){
		var txt = "<table>";
		var softwareJSON = responseText ;
	 	var image = '';
	 	if ( softwareJSON.softwares[0].image != null ){
	 		image = '<br><img src="' + softwareJSON.softwares[0].image +'" alt="' + softwareJSON.softwares[0].name + '的商標" style="height:50px;">'
	 	}
	 	txt = '<table><tbody>' + 
			'<tr><td>軟體名稱</td><td><b>' + softwareJSON.softwares[0].name + '</b>' + image + '</td></tr>' +
			'<tr><td>公司</td><td>' + softwareJSON.softwares[0].company + '</td></tr>' +
			'<tr><td>申請使用到期時間</td><td>' + softwareJSON.softwares[0].usageDue + '</td></tr>' +
			'<tr><td>作業系統</td><td><ul id="os">';
		os = softwareJSON.softwares[0].os;
	 	for ( i in os ){
	 		txt += '<li>' + os[i];
	 	}
	 	if (loggedIn == true){
		 	txt += '</ul></td></tr>' +
			'<tr><td>授權到期時間</td><td>' + softwareJSON.softwares[0].liscenseDue + '</td></tr>' +
			'<tr><td>userid</td><td>' + softwareJSON.softwares[0].userid + '</td></tr>' +
		 	'<tr><td>申請人</td><td>' + softwareJSON.softwares[0].user + '</td></tr>' +
		 	'</tbody></table>';
		 } else{
		 	txt +='</ul></td></tr>' + '</tbody></table>';
		 }


	 	$("#softwareInfo-table").html( txt );
	 	$('html, body').animate({
        scrollTop: $('#softwareInfo-table').offset().top - 20
    	}, 1000);
	} )
	.fail( console.log( "soft info fail" ) )
}

//查軟體
function filterByName(){
	$('#searchInput').keyup(function(){
		var input = $('#searchInput').val();
		if ( input != '' ){
			var filter = input.toUpperCase();
			$(".softwareListTd").each(function(){
				if ( $(this).text().toUpperCase().indexOf(filter) > -1 ) {
					$(this).show();
					$(this).addClass('show');
				} else {
					$(this).hide();
				}
			});
		} else{
			$(".softwareListTd").each(function(){
				$(this).show();
				$(this).removeClass('show');
			})
		}
	});
}