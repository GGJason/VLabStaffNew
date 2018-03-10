//main
$.get("auth.php?info", function(){
	softwareList(true);
	$('#softwareInfo-table').hide()
})
.fail( function(){
	softwareList(false);//not logged in
	$('#softwareInfo-table').hide()
})

//取得軟體清單
function softwareList( loggedIn ){
	$.get( "software.php?list", function( responseText ) {
		var softListJSON = responseText.softwares;
		var html = ""
		for ( i in softListJSON ){
			html += "<tr class='softwareListTr'><td class='softwareListTd'>" + softListJSON[i].name + "</td></tr>";
		}
		$("#software-table").html(html);
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
	$.get("./software.php?name=" + softwareName, function( softwareJSON ){
		var computers = softwareJSON.softwares[0].computers;
	 	var image = '';
	 	if (loggedIn == true){
	 		$('#soft_id').parent().show()
	 		$('#soft_id').html('softwareJSON.softwares[0].id')
	 	}
	 	if ( softwareJSON.softwares[0].image != null ){
	 		image = '<br><img src="' + softwareJSON.softwares[0].image +'" style="height:50px;">'
	 	}
	 	txt += '<tr><td>軟體名稱</td><td id="soft_name">' + softwareJSON.softwares[0].name + image + '</td></tr>' +
			'<tr><td>公司</td><td id="soft_company">' + softwareJSON.softwares[0].company + '</td></tr>' +
			'<tr><td>申請使用到期時間</td><td id="soft_usageDue">' + softwareJSON.softwares[0].usageDue + '</td></tr>' +
			'<tr><td>作業系統</td><td><ul id="soft_os">';
		os = softwareJSON.softwares[0].os;
	 	for ( i in os ){
	 		txt += '<li>' + os[i];
	 	}
	 	//iMacLayout
	 	txt+='<tr><td>iMac</td><td id="imacLayout">'
	 	if (loggedIn == true){
	 		//修改imac
	 		txt+='<div><input id="editImac_button" type="button" onclick="editImac(\''+softwareName+'\')" value="修改iMac" class="small"></input></div>';
	 		txt+=imacLayout+'<div id="editAndSaveImac_div"></div></td></tr>'
	 	}else{
	 		txt+=imacLayout+'</td></tr>'
	 	}
	 	

	 	if (loggedIn == true){
	 		txt_edit = '<div id="editAndSave_div"><input id="edit_button" type="button" onclick="editSoftware(\''+softwareName+'\')" value="修改"></input></div>';
		 	txt += '</ul></td></tr>' +
			'<tr><td>授權到期時間</td><td id="soft_licenseDue">' + softwareJSON.softwares[0].licenseDue + '</td></tr>' +
			'<tr><td>申請人userid</td><td id="soft_userid">' + softwareJSON.softwares[0].userid + '</td></tr>' +
		 	'<tr><td>申請人</td><td id="soft_user">' + softwareJSON.softwares[0].user + '</td></tr>' +
		 	'</tbody></table>';
		 } else{
		 	txt +='</ul></td></tr>' + '</tbody></table>';
		 }

	 	$("#softwareInfo-table").html( txt_edit+txt );
	 	$('html, body').animate({
        scrollTop: $('#softwareInfo-table').offset().top - 20
    	}, 1000);

    	// imacLayout ID
		$.get('computer.php?list', function( responseText ){
			var i = 0;
			var imacR604=[];
			var imacR613=[];
			var imacRN=[];
			var imacAll=[];
			var imacArr = responseText.computers;
			//example color
			$('#imacLayout')
			//put id into arrays
			for ( i=0; i<imacArr.length; i++ ){
				if ( imacArr[i].room == 604 ){
					imacR604[ imacArr[i].position ]= imacArr[i];
				}else if ( imacArr[i].room == 613 ){
					imacR613.push( imacArr[i] );
				}else{
					imacRN.push( imacArr[i] );
				}
			}
			//put id into layout //R604
			for ( i=1; i<=15; i++ ){
				$('#layoutR604_'+i).children('.layoutId').append(imacR604[i].id);
				//存
				imacAll.push( imacR604[i] )
			}
			//put id into layout //R613
			for (i=0; i<imacR613.length; i++){
				if ( i==0 )
					$('#R613').append('<h2>613室</h2>')
				$('#R613').append('<div class="layoutImac-class" id="layoutR613_'+ i +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>');
				$('#layoutR613_'+i).children('.layoutId').append(imacR613[i].id);
				//存
				imacAll.push( imacR613[i] )
			}
			if ( loggedIn == true ){
				//put id into layout //R-NONE //need login
				for (i=0; i<imacRN.length; i++){
					if ( i==0 )
						$('#RN').append('<h2>其他</h2>')
					$('#RN').append('<div class="layoutImac-class" id="layoutRN_'+ i +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>');
					$('#layoutRN_'+i).children('.layoutId').append(imacRN[i].id);
					$('#'+imacRN[i].id).prop('disabled',true)
				//存
					imacAll.push( imacRN[i] );
				}
			}
			$('.layoutId').each(function(){
				console.log($(this).html())
			})

		})
		.fail( function(){
			 $('#layout').html("無法讀取電腦資訊，請重新整理試試。");
		})
		///imacLayout ID end
	} )
	.fail( console.log( "soft info fail" ) )
	
}

//查軟體
function filterByName(){
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
}

//「修改」按鈕
function editSoftware(softwareName){
	// 調整按鈕顯示
	$('#edit_button').prop('disabled', true);
	$('#editAndSave_div').append('<input id="save_button" type="button" onclick="postEdit()" value="儲存修改" class="special"></input>');
	$('#editAndSave_div').append('<input id="cancel_button" type="button" onclick="cancleEdit(\''+softwareName+'\')" value="取消修改"></input>')

	$.get("software.php?name=" + softwareName, function( responseText ){
		var softwareJSON = responseText ;
		var osHtml = '<input type="checkbox" name="os" value="MacOS" id="os_MacOS"><label for="os_MacOS">MacOS</label> '
						+  '<input type="checkbox" name="os" value="Windows 10" id="os_Windows_10"><label for="os_Windows_10">Windows 10</label> ';
		var usageDueHtml = '<div class="YMD 2u"><input type="text" name="usageDueY" placeholder="YYYY" maxLength=4></div>'
						+ '<div class="YMD 1u"><input type="text" name="usageDueM" placeholder="MM" maxLength=2></div>'
						+ '<div class="YMD 1u"><input type="text" name="usageDueD" placeholder="DD" maxLength=2></div>'
		var licenseDueHtml =  '<div class="YMD 2u"><input type="text" name="licenseDueY" placeholder="YYYY" maxLength=4></div>'
						+ '<div class="YMD 1u"><input type="text" name="licenseDueM" placeholder="MM" maxLength=2></div>'
						+ '<div class="YMD 1u"><input type="text" name="licenseDueD" placeholder="DD" maxLength=2></div>'
		var softUser = '<input type="radio" id="softUser_-1" name="user" ><label for="softUser_-1">停用</label><br>'
					+'<input type="radio" id="softUser_0" name="user" ><label for="softUser_0">長駐軟體</label><br>'
					+'<div class="dropdown">'
					+'<input type="radio" id="softUser_" name="user" ><label for="softUser_">'
					+'<input type="text" name="softUser_name" placeholder="搜尋申請人" style="display: inline-block;" onkeyup="dropdown()">'
					+'<div class="dropdown-content findUserResult"><div id="findUserResult_prof"></div>'
					+'<div id="findUserResult_stu"></div></div></div>'
		var image = '';
	 	if ( softwareJSON.softwares[0].image != null ){
	 		image = '<br><img src="' + softwareJSON.softwares[0].image +'" style="height:50px;">'
	 	}
		// 預設為原本的答案
		$('#soft_name').html('<input type="text" name="name" value="' + softwareJSON.softwares[0].name +'">' +image);
		$('#soft_company').html('<input type="text" name="company" value="' + softwareJSON.softwares[0].company + '">');
		$('#soft_usageDue').html(usageDueHtml);
		$('#soft_os').html(osHtml)
		$('#soft_licenseDue').html(licenseDueHtml);
		$('#soft_user').html(softUser);
		// 預設 #soft_os 勾選
		os = softwareJSON.softwares[0].os;
		for (i in os){
			if (os[i] == 'Windows 10'){
				$('#os_Windows_10').prop('checked',true)
			}
			if (os[i] == 'MacOS'){
				$('#os_MacOS').prop('checked',true)
			}
		}
		// 預設日期 #soft_usageDue #soft_licenseDue
		usageDue = softwareJSON.softwares[0].usageDue
		if ( usageDue=='無' ){
			$( 'input[name$="usageDueY"]' ).val( '0000' );
			$( 'input[name$="usageDueM"]' ).val( '00' );
			$( 'input[name$="usageDueD"]' ).val( '00' );
		}
		else{
			$( 'input[name$="usageDueY"]' ).val( usageDue.split("-")[0] );
			$( 'input[name$="usageDueM"]' ).val( usageDue.split("-")[1] );
			$( 'input[name$="usageDueD"]' ).val( usageDue.split("-")[2] );
		}
		licenseDue = softwareJSON.softwares[0].licenseDue
		if ( licenseDue=='無' ) {
			$( 'input[name$="licenseDueY"]' ).val( '0000' );
			$( 'input[name$="licenseDueM"]' ).val( '00' );
			$( 'input[name$="licenseDueD"]' ).val( '00' );
		}
		else{
			$( 'input[name$="licenseDueY"]' ).val( licenseDue.split("-")[0] );
			$( 'input[name$="licenseDueM"]' ).val( licenseDue.split("-")[1] );
			$( 'input[name$="licenseDueD"]' ).val( licenseDue.split("-")[2] );
		}
		// 預設申請人 #soft_user
		userid = softwareJSON.softwares[0].userid;
		if ( userid == '-1' ){
			$('#softUser_-1').prop('checked', true);
		}
		else if ( userid =='0' ){
			$('#softUser_0').prop('checked', true);
		}
		else{
			$('#softUser_').prop('checked', true);
		}
		// 申請人id更改
		$('#soft_user').click(function(){
			if ($('#softUser_-1').prop('checked')){
				$('#soft_userid').html('-1')
			}
			else if ($('#softUser_0').prop('checked')){
				$('#soft_userid').html('0')
			}
		})
	})





}
//儲存修改post
function postEdit(){
	var postJSON = {id:'',	name:'', company:'', license:'', usage:'', os:''} 
	//大竹看這裡// //先不管image, description //userid好像無法post //company post出去不會改
	postJSON.id = $('#soft_id').html()
	postJSON.name = $('input[name$="name"]').val()
	postJSON.company = $('input[name$="company"]').val()
	postJSON.license = $('input[name$="licenseDueY"]').val() + '-' + $('input[name$="licenseDueM"]').val() + '-' + $('input[name$="licenseDueD"]').val()
	postJSON.usage = $('input[name$="usageDueY"]').val() + '-' + $('input[name$="usageDueM"]').val() + '-' + $('input[name$="usageDueD"]').val()
	//postJSON.userid = $('#soft_userid').html()
	var $os = $( 'input[name$="os"]' )
	var os = []
	for (var i=0; i<$os.length; i++){
		if ($os[i].checked == true){
			os[os.length]=$os[i].value;
		}
	} 
	postJSON.os =  '['
	for (var i=0; i < os.length ; i++ ){
		postJSON.os +=  '"' + os[i] + '"';
		if ( i != os.length-1 )
			postJSON.os +=  ',';
	}
	postJSON.os +=  ']'
	console.log(postJSON);
	postJSON_string = JSON.stringify(postJSON)
	if ( confirm('送出修改？\n'+postJSON_string) ){
		console.log(postJSON);
		$.post('./software.php?update&software',postJSON, function(receiveJSON){
			console.log(receiveJSON);
			var receive = receiveJSON
			if (receive.status != 'ok'){
				alert('送出的東西好像有哪裡錯了>A<\m' + JSON.stringify(receiveJSON))
			}
		})
		.done(function(){
			alert('已送出！')
			//更新顯示
			softwareByName(postJSON.name, true)
			softwareList(true)

		})
		.fail(function(){
			alert('沒有送出QQ')
		})
	}

}
function cancleEdit(softwareName){
	softwareByName(softwareName, true);
}

//搜尋申請者老師和學生的
//選單 
function dropdown(){
	var txt = $('input[name$="softUser_name"]').val()
	if (txt!=''){
		console.log('!')
		$('.dropdown-content').show()
		findUser(txt)
		$('#softUser_').prop('checked', true);
	}else{
		$('.dropdown-content').hide()
	}
}
function findUser(findUserInput){
	if (findUserInput !=''){
		//搜尋並列出教職員
		$('#findUserResult_prof').html('')
		var findUserResult_html = ''
		$.get('./finduser.php?professor&name='+findUserInput, function(findUserText){
			var findUserJSON = JSON.parse(findUserText)
			$('#findUserResult_prof').html('')
			if ( findUserJSON.status == 'ok' ){
				if (findUserJSON.users.length == 0){
					$('#findUserResult_prof').append('<a href="#soft_userid" id="no_teacher">沒有符合搜尋的教職員</a>')
				}else{
					$('#no_prof').remove()
					findUserResult_html += '<a href="#">教職員</a>'
					findUserJSON.users.forEach(function(element){
						$('#findUserResult_prof').append('<a href="#soft_userid" class="softUser_name_teacher" id="softUser_name_'+element.id+'">' + element.name + '</a>')
					})

				}
			}
			else{
				$('#findUserResult').append('教職員搜尋失敗')
			}
			$('.softUser_name_teacher').click(function(){
				console.log(this)
				var id = this.id.substr(14)
				var name = this.text
				$('#soft_userid').html(id)
				$( 'input[name$="softUser_name"]' ).val(name)
				$('.dropdown-content').hide()
			})
		})
		//搜尋並列出學生
		$.get('./finduser.php?student&name='+findUserInput, function(findUserText){
			var findUserJSON = JSON.parse(findUserText)
			$('#findUserResult_stu').html('')
			if ( findUserJSON.status == 'ok' ){
				if (findUserJSON.users.length == 0){
					$('#findUserResult_stu').append('<a href="#soft_userid" id="no_stu">沒有符合搜尋的學生</a>')
				}else{
					$('#no_stu').remove()
					findUserResult_html += '<a href="#">學生</a>'
					findUserJSON.users.forEach(function(element){
						$('#findUserResult_stu').append('<a href="#soft_userid" class="softUser_name_student" id="softUser_name_'+element.id+'">' + element.name + '</a>')
					})
				}
			}
			else{
				$('#findUserResult').append('學生搜尋失敗')
			}
			$('.softUser_name_student').click(function(){
				console.log(this)
				var id = this.id.substr(14)
				var name = this.text
				$('#soft_userid').html(id)
				$( 'input[name$="softUser_name"]' ).val(name)
				$('.dropdown-content').hide()
			})

		})
		
	}
}

//修改imac
function editImac(softwareName){
	//顯示
	$('#editImac_button').prop('disabled', true);
	$('#imacLayout').prepend('<h2 id="iMacEdit_warning">請選擇有安裝此軟體的iMac，編輯結束記得按下方儲存iMac</h2>');
	$('#editAndSaveImac_div').append('<input id="saveImac_button" type="button" onclick="postEditImac()" value="儲存iMac" class="special small"></input>');
	$('#editAndSaveImac_div').append('<input id="cancel_button" type="button" onclick="cancleEditImac(\''+softwareName+'\')" value="取消修改iMac" class="small"></input>');
	//預設勾選//用checkbox做
	$('.layoutImac-class').each(function(){
		$(this).children('input').prop('disabled',false)
	})
}
function postEditImac(){

}
//
function cancleEditImac(softwareName){
	//remove edit
	$('.layoutImac-class').removeClass('layoutImac-class_installed');
	$('.layoutImac-class').removeClass('layoutImac-class_edit');
	$('.layoutImac-class_').removeClass('layoutImac-class_edit_installed');
	$('#iMacEdit_warning').remove();
	$('#editImac_button').prop('disabled', false);
	$('#editAndSaveImac_div').empty();
	$('.layoutImac-class').each(function(){
		$(this).children('input').prop('disabled',true)
	})

	//re get software info imac part
	$.get("./software.php?name=" + softwareName, function( responseText ){
		var softwareJSON = responseText;
		var computers = softwareJSON.softwares[0].computers;
	    // imacLayout ID
		$.get('computer.php?list', function( responseText ){
			var i = 0;
			var imacR604=[];
			var imacR613=[];
			var imacRN=[];
			var imacAll=[];
			var imacArr = responseText.computers;
			//put id into arrays
			for ( i=0; i<imacArr.length; i++ ){
				if ( imacArr[i].room == 604 ){
					imacR604[ imacArr[i].position ]= imacArr[i];
				}else if ( imacArr[i].room == 613 ){
					imacR613.push( imacArr[i] );
				}else{
					imacRN.push( imacArr[i] );
				}
			}
			//put id into layout //R604
			for ( i=1; i<=15; i++ ){
				//存
				imacAll.push( imacR604[i] )
			}
			//put id into layout //R613
			for (i=0; i<imacR613.length; i++){
				$('#layoutR613_'+i).children('.layoutId').html(imacR613[i].id);
				//存
				imacAll.push( imacR613[i] )
			}
			//put id into layout //R-NONE //need login
			for (i=0; i<imacRN.length; i++){
				$('#layoutRN_'+i).children('.layoutId').html(imacRN[i].id);
			//存
				imacAll.push( imacRN[i] );
			}
			console.log(imacAll);

		})
		.fail( function(){
			 $('#layout').html("無法讀取電腦資訊，請重新整理試試。");
		})
		///imacLayout ID end
	})
}