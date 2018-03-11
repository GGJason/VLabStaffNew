//main
$('#editAndSave-div').hide()
$('#softwareInfo-table').hide()
var imac_isEditing = false
$.get("./auth.php?info", function(){
	softwareList(true);
})
.fail( function(){
	softwareList(false);//not logged in
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
			console.log( $(this).text() );
			softwareByName($(this).text(), loggedIn);
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
	 	// 顯示table
	 	$('#softwareInfo-table').show()
	 	//填資料
		$('#soft_name').html('<b>'+softwareJSON.softwares[0].name+'</b>')
	 	$('#soft_company').html(softwareJSON.softwares[0].company)
	 	$('#soft_usageDue').html(softwareJSON.softwares[0].usageDue)
	 	var os = softwareJSON.softwares[0].os
	 	var soft_os_html = ''
	 	for ( i in os ){
	 		soft_os_html += '<li>' + os[i] + '</li>'
	 	}
	 	$('#soft_os').html(soft_os_html)
	 	// 登入才能看
	 	if (loggedIn == true){
	 		$('.loggedIn_true').show()
	 		// 加入修改按鈕
	 		$('#editAndSave-div').html('<input id="edit-button" type="button" onclick="editSoftware()" value="修改"></input>')
	 		// 一些資訊
	 		$('#soft_id').html(softwareJSON.softwares[0].id)
	 		$('#soft_licenseDue').html(softwareJSON.softwares[0].licenseDue)
	 		$('#soft_userid').html(softwareJSON.softwares[0].userid)
	 		$('#soft_user').html(softwareJSON.softwares[0].user)
	 		$('#soft_description').html(softwareJSON.softwares[0].description)
	 	}else{
	 		$('.loggedIn_true').hide()
	 	}
	 	// LOGO image
	 	if ( softwareJSON.softwares[0].image != null ){
	 		$('#soft_image').show()
	 		$('#soft_image').html('<img src="' + softwareJSON.softwares[0].image +'" style="height:50px;">')
	 	}else{
			$('#soft_image').hide()
	 	}
	 	// scroll
	 	$('html, body').animate({
			scrollTop: $('#softwareInfo-table').offset().top - 20
		}, 1000);

	 	if(!imac_isEditing){
	 		if(loggedIn){
	 			$('#editAndSaveImac-div').html('<input id="editImac-button" type="button" onclick="editImac(\''+softwareName+'\')" value="修改iMac" class="small">')
	 		}
			// 把iMac定位和顯示軟體安裝狀態（status 0 1 2）
			var R613_h2 = false
			var RN_h2 = false
			for( i in computers ){
				var p = computers[i].position
				if( computers[i].room == "604" ){
					$('#layoutR604_'+p).children('.layoutId').html(computers[i].computer)
					$('#layoutR604_'+p).addClass('layoutImac_stat_'+computers[i].status)
					$('#layoutR604_'+p).addClass('layoutImac_editable')
				}else if( computers[i].room == "613" ){
					if( R613_h2 == false ){
						$('#R613').html('<h2>613室</h2>')
						R613_h2 = true
					}
					$('#R613').append('<div class="layoutImac-class" id="layoutR613_'+ p +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>')
					$('#layoutR613_'+p).children('.layoutId').html(computers[i].computer)
					$('#layoutR613_'+p).addClass('layoutImac_stat_'+computers[i].status)
					$('#layoutR613_'+p).addClass('layoutImac_editable')
				}else{
					if( RN_h2 == false ){
						$('#RN').html('<h2>其他</h2>')
						RN_h2 = true
					}
					$('#RN').append('<div class="layoutImac-class" id="layoutRN_'+ p +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>')
					$('#layoutRN_'+p).children('.layoutId').html(computers[i].computer)
					$('#layoutRN_'+p).addClass('layoutImac_stat_'+computers[i].status)
					$('#layoutRN_'+p).addClass('layoutImac_editable')
				}
			}
		}
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
function editSoftware(){
	// 調整按鈕顯示
	var softwareName = $('#soft_name').text()
	$('#edit-button').prop('disabled', true);
	$('#editAndSave-div').append('<input id="save-button" type="button" onclick="postEdit()" value="儲存修改" class="special"></input>');
	$('#editAndSave-div').append('<input id="cancel-button" type="button" onclick="cancleEdit(\''+softwareName+'\')" value="取消修改"></input>')
	$.get("software.php?name=" + softwareName, function( softwareJSON ){
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

	 	if ( softwareJSON.softwares[0].image != null ){
	 		$('#soft_image').show()
	 		$('#soft_image').html('<img src="' + softwareJSON.softwares[0].image +'" style="height:50px;">')
	 	}else{
			$('#soft_image').hide()
	 	}
		// 預設為原本的答案
		$('#soft_name').html('<input type="text" name="name" value="' + softwareJSON.softwares[0].name +'">');
		$('#soft_company').html('<input type="text" name="company" value="' + softwareJSON.softwares[0].company + '">');
		$('#soft_licenseDue').html(licenseDueHtml);
		$('#soft_usageDue').html(usageDueHtml);
		$('#soft_user').html(softUser);
		$('#soft_os').html(osHtml)
		$('#soft_description').html('<input type="text" name="description" value="' +softwareJSON.softwares[0].description+'">');
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
	var postJSON = {id:"1",name:"",company:"",licenseDue:"",usageDue:"",userid:"1",os:[],description:""}
	//先不管image
	postJSON.id = $('#soft_id').text()
	postJSON.name = $('input[name$="name"]').val()
	postJSON.company = $('input[name$="company"]').val()
	postJSON.licenseDue = $('input[name$="licenseDueY"]').val() + '-' + $('input[name$="licenseDueM"]').val() + '-' + $('input[name$="licenseDueD"]').val()
	postJSON.usageDue = $('input[name$="usageDueY"]').val() + '-' + $('input[name$="usageDueM"]').val() + '-' + $('input[name$="usageDueD"]').val()
	postJSON.userid = $('#soft_userid').text()
	$('input[name$="os"]:checked').each(function(){
		postJSON.os.push( $(this).val() )
	})
	postJSON.description = $('input[name$="description"]').val()
	console.log(postJSON);
	postJSON_string = JSON.stringify(postJSON)
	if ( confirm('送出修改？\n'+postJSON_string) ){
		console.log(postJSON);
		$.post('./software.php?update&software',postJSON, function(receiveJSON){
			console.log(receiveJSON);
			var receive = receiveJSON
			if (receive.status != 'ok'){
				alert('送出的東西好像有哪裡錯了>A<\n' + JSON.stringify(receiveJSON))
			}else{
				alert('已送出！')
			}
		})
		.done(function(){
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
	imac_isEditing = true
	//顯示
	$('#editImac-button').prop('disabled', true);
	$('#editAndSaveImac-div').prepend('<h2 id="editImac_warning">請選擇有安裝此軟體的iMac，編輯結束記得按下方儲存iMac</h2>');
	$('#editAndSaveImac-div').append('<input id="saveImac-button" type="button" onclick="postEditImac()" value="儲存iMac" class="special small"></input>');
	$('#editAndSaveImac-div').append('<input id="cancel-button" type="button" onclick="cancleEditImac(\''+softwareName+'\')" value="取消修改iMac" class="small"></input>');
	//預設
	$('.layoutImac_editable').each(function(){
		$(this).append('<div class="select-wrapper"><select class="layoutImac-select" name="'+ $(this).children('.layoutId').text() +'"><option value="0">未安裝</option><option value="1">正常</option><option value="2">異常</option></select></div>')
		if( $(this).hasClass("layoutImac_stat_0") ){
			$(this).find('select').val('0')
		}else if( $(this).hasClass("layoutImac_stat_1") ){
			$(this).find('select').val('1')
		}else if( $(this).hasClass("layoutImac_stat_2") ){
			$(this).find('select').val('2')
		}
	})
	$('.layoutImac-select').change(function(){
		var val = $(this).val()
		$(this).parents('.layoutImac_editable').removeClass("layoutImac_stat_0 layoutImac_stat_1 layoutImac_stat_2")
		$(this).parents('.layoutImac_editable').addClass("layoutImac_stat_"+val)
	})

}
function postEditImac(){
	var postJSON = {id:"",computers:[]}
	postJSON.id = $('#soft_id').text()
	$('.layoutImac_editable').each(function(){
		var computerJSON = {computer:"",status:""}
		computerJSON.computer = $(this).find('.layoutId').text()
		computerJSON.status = $(this).find('.layoutImac-select').find(':selected').val()
		postJSON.computers.push(computerJSON)
	})
	console.log(postJSON);
	postJSON_string = JSON.stringify(postJSON)
	if ( confirm('送出iMac修改？\n'+postJSON_string) ){
		console.log(postJSON);
		$.post('./software.php?update&computer&software',postJSON, function(receiveJSON){
			console.log(receiveJSON)
			imac_isEditing = false
			var receive = receiveJSON
			if (receive.status != 'ok'){
				alert('送出的東西好像有哪裡錯了>A<\n' + JSON.stringify(receiveJSON))
			}else{
				alert('已送出！')
			}
		})
		.done(function(){
			//更新顯示
			imac_isEditing = false
			cancleEditImac(postJSON.name)
		})
		.fail(function(){
			alert('沒有送出QQ')
		})
	}


}
//取消修改iMac
function cancleEditImac(softwareName){
	imac_isEditing = false
	//remove edit
	$('#editImac_warning').remove();
	$('#editAndSaveImac-div').html('<input id="editImac-button" type="button" onclick="editImac(\''+softwareName+'\')" value="修改iMac" class="small">')
	//re get software info imac part
	$('.layoutImac_editable').each(function(){
		$(this).removeClass().addClass('layoutImac-class layoutImac_editable')
		$(this).find('.select-wrapper').remove()

	})
	$.get("./software.php?name=" + softwareName, function( softwareJSON ){
		var computers = softwareJSON.softwares[0].computers;
	    // 把iMac定位和顯示軟體安裝狀態（status 0 1 2）
		var R613_h2 = false
		var RN_h2 = false
		for( i in computers ){
			var p = computers[i].position
			if( computers[i].room == "604" ){
				$('#layoutR604_'+p).children('.layoutId').html(computers[i].computer)
				$('#layoutR604_'+p).addClass('layoutImac_stat_'+computers[i].status)
				$('#layoutR604_'+p).addClass('layoutImac_editable')
			}else if( computers[i].room == "613" ){
				if( R613_h2 == false ){
					$('#R613').html('<h2>613室</h2>')
					R613_h2 = true
				}
				$('#R613').append('<div class="layoutImac-class" id="layoutR613_'+ p +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>')
				$('#layoutR613_'+p).children('.layoutId').html(computers[i].computer)
				$('#layoutR613_'+p).addClass('layoutImac_stat_'+computers[i].status)
				$('#layoutR613_'+p).addClass('layoutImac_editable')
			}else{
				if( RN_h2 == false ){
					$('#RN').html('<h2>其他</h2>')
					RN_h2 = true
				}
				$('#RN').append('<div class="layoutImac-class" id="layoutRN_'+ p +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>')
				$('#layoutRN_'+p).children('.layoutId').html(computers[i].computer)
				$('#layoutRN_'+p).addClass('layoutImac_stat_'+computers[i].status)
				$('#layoutRN_'+p).addClass('layoutImac_editable')
			}

		}
	})
}