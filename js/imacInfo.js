
//main
$.get("./auth.php?info", function(){
	imacLayout(true);
})
.fail( function(){
	imacLayout(false);
} )

function imacLayout(auth){
	$.get('computer.php?list', function( responseJSON ){

		var i = 0;
		var imacR604=[];
		var imacR613=[];
		var imacRN=[];
		var imacAll=[];
		var imacArr = responseJSON.computers;
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
			$('#layoutR604_'+i).addClass('layoutImacClickable');
			$('#layoutR604_'+i).addClass('ava_'+imacR604[i].availability); //上色
			//存
			imacAll.push( imacR604[i] )
		}
		//put id into layout //R613
		for (i=0; i<imacR613.length; i++){
			if ( i==0 )
				$('#R613').append('<h2>613室</h2>')
			$('#R613').append('<div class="layoutImac-class" id="layoutR613_'+ i +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>');
			$('#layoutR613_'+i).children('.layoutId').append(imacR613[i].id);
			$('#layoutR613_'+i).addClass('layoutImacClickable');
			$('#layoutR613_'+i).addClass('ava_'+imacR613[i].availability); //上色
			//存
			imacAll.push( imacR613[i] )
		}
		if ( auth == true ){
			//put id into layout //R-NONE //need login
			for (i=0; i<imacRN.length; i++){
				if ( i==0 )
					$('#RN').append('<h2>其他</h2>')
				$('#RN').append('<div class="layoutImac-class" id="layoutRN_'+ i +'"><div class="layoutId"></div><i  class="fa fa-desktop" aria-hidden="true"></i></div>');
				$('#layoutRN_'+i).children('.layoutId').append(imacRN[i].id);
				$('#layoutRN_'+i).addClass('layoutImacClickable');
				//上色
				$('#layoutRN_'+i).addClass('ava_'+imacRN[i].availability); //上色
			//存
				imacAll.push( imacRN[i] );
			}
		}
		//預設顯示
		imacId(imacAll[0].id, imacAll, auth);

		//按layout的時候
		$('.layoutImacClickable').click(function(){
			var id = $(this).children('.layoutId').html();
			imacId(id, imacAll, auth);
			$('html, body').animate({
				scrollTop: $('#imac').offset().top - 20
			}, 1000);
		})
		//console.log(imacAll);
	})
	.fail( function(){
		 $('#layout').html("無法讀取電腦資訊，請重新整理試試。");
	})
}

//呈現電腦id
function imacId( id, imacAll, auth ){
	var no = 0;
	var i = 0;
	var imacLen = imacAll.length;
	//找到正確流水號
	$.each(imacAll, function(index, json){
		if (json.id == id)
			no = index;
	})
	$('#imacNo').html( imacAll[no].id ); //填入id
	imacInfo(imacAll[no].id, auth); ////查詢電腦詳細資訊 放進imacInfo-table
	//左右按鈕
	$('#left').click(function(){
		no--;
		if ( no<0 ){
			no = imacLen-1;
		}
		$('#imacNo').html( imacAll[no].id ); //填入id
		imacInfo(imacAll[no].id, auth); ////查詢電腦詳細資訊 放進imacInfo-table
	})
	$('#right').click(function(){
		no++;
		if ( no>imacLen-1 ){
			no = 0;
		}
		$('#imacNo').html( imacAll[no].id ); //填入id
		imacInfo(imacAll[no].id, auth); ////查詢電腦詳細資訊 放進imacInfo-table
	})

}

//查詢電腦詳細資訊 放進imacInfo-table
function imacInfo(id, auth){
	$.get('./computer.php?list&computer='+id, function( imacInfoJSON ){
		var i=0;

		// 幫電腦上色
		colorClass(imacInfoJSON.availability)
		// 電腦位置
		$('#info_room_pos').html('room' + imacInfoJSON.room + '_' + imacInfoJSON.position)
		// 電腦狀態
		if ( imacInfoJSON.availability == 0 ){
			$('#info_ava').html('<b class="ava_0">可使用</b>')
		}else if ( imacInfoJSON.availability == 1 ){
			$('#info_ava').html('<b class="ava_1">已預約</b>')
		}else if ( imacInfoJSON.availability == 2 ){
			$('#info_ava').html('<b class="ava_2">借用中</b>')
		}else{
			$('#info_ava').html('<b class="ava_-1">維修中</b>')
		}
		var os_html ='<ul>'
		for( i in imacInfoJSON.os){
			os_html += '<li>' +imacInfoJSON.os[i]
		}
		os_html += '</ul>'
		$('#info_os').html(os_html)
		//登入才有
		if( auth == true ){
			$('#editAndSave-div').html('<input id="edit-button" type="button" onclick="edit(\''+id+'\')" value="修改">')
			$('.loggedIn_true').show()
			var hardware_html =''
			$.each(imacInfoJSON.hardware, function(key, value){
				hardware_html += '<li><b>' + key + '</b>&nbsp&nbsp' + value;
			})
			$('#info_hardware').html(hardware_html)
			$('#info_description').html(imacInfoJSON.description)
		}else{
			$('.loggedIn_true').hide()
		}
		//軟體
		var softwares = imacInfoJSON.softwares
		var softwares_html =''
		for (i in softwares){
			if ( softwares[i].status == 1 ){
				softwares_html += '<li class="softwares-li status_1"><span class="soft_name">' + softwares[i].name +'</span>&nbsp&nbsp&nbsp<span class="soft_stat"><b>正常</b></span>' 
			}else if( softwares[i].status == 2 ){
				softwares_html += '<li class="softwares-li status_2"><span class="soft_name">' + softwares[i].name +'</span>&nbsp&nbsp&nbsp<span class="soft_stat"><b>異常</b></span>'
			}else{
				softwares_html += '<li class="softwares-li status_0"><span class="soft_name">' + softwares[i].name +'</span>&nbsp&nbsp&nbsp<span class="soft_stat"><b>未安裝</b></span>'
			}
		}
		$('#info_softwares').html(softwares_html)
	})
	.fail( function(){
		$('#imacInfo-table').html( '讀取資訊失敗' );
	})
}
// 修改 按鈕
function edit(id){
	$('#edit-button').prop('disabled', true);
	$('#editAndSave-div').append('<input id="save-button" type="button" onclick="postEdit()" value="儲存修改" class="special"></input>');
	$('#editAndSave-div').append('<input id="cancel-button" type="button" onclick="cancleEdit(\''+id+'\')" value="取消修改"></input>')
	$.get('./computer.php?list&computer='+id, function( imacInfoJSON ){
		// 幫電腦上色
		colorClass(imacInfoJSON.availability)
		// 電腦位置
		var room_select_html = '<div class="select-wrapper 2u" style="display:inline-block"><select name="room" disabled><option value="604">604</option>'
							+ '<option value="613">613</option><option value="601">601</option></select></div>'
		var pos_input_html = '<div class="2u" style="display:inline-block"><input type="text" name="pos" placeholder="pos" maxLength=3 disabled></div>'
		$('#info_room_pos').html('room&nbsp&nbsp' + room_select_html + '\nposition&nbsp&nbsp' + pos_input_html)
		$( 'select[name="room"]').val( imacInfoJSON.room )
		$( 'input[name$="pos"]' ).val( imacInfoJSON.position )

		// 電腦狀態
		var ava_select_html = '<div class="select-wrapper"><select name="ava"><option value="0">可使用</option></option><option value="-1">維修中</option>'
		+'</select></div>'
		$('#info_ava').html()
		if ( imacInfoJSON.availability == 0 ){
			$('#info_ava').html(ava_select_html)
			$( 'select[name="ava"]').val( imacInfoJSON.availability )
		}else if ( imacInfoJSON.availability == 1 ){
			$('#info_ava').html('<b class="ava_1">已預約</b>')
		}else if ( imacInfoJSON.availability == 2 ){
			$('#info_ava').html('<b class="ava_2">借用中</b>')
		}else{
			$('#info_ava').html(ava_select_html)
			$( 'select[name="ava"]').val( imacInfoJSON.availability )
		}
		$('#info_ava').append('借用請移至<a href="./lentimac.html" target="_blank">「借用」</a>')
		$('select[name="ava"]').change(function(){
				colorClass($(this).val())
		})
		
		// os
		var os_check_html = '<input type="checkbox" name="os" value="MacOS" id="os_MacOS"><label for="os_MacOS">MacOS</label> '
						+  '<input type="checkbox" name="os" value="Windows 10" id="os_Windows_10"><label for="os_Windows_10">Windows 10</label> ';
		$('#info_os').html(os_check_html)
		// 預設 #info_os 勾選
		var os = imacInfoJSON.os;
		for (i in os){
			if (os[i] == 'Windows 10'){
				$('#os_Windows_10').prop('checked',true)
			}
			if (os[i] == 'MacOS'){
				$('#os_MacOS').prop('checked',true)
			}
		}
		//hardware
		$('#info_hardware').empty()
		$.each(imacInfoJSON.hardware, function(key, value){
			$('#info_hardware').append('<li><b>' + key + '</b>&nbsp&nbsp' + '<input type="text" name="'+key+'" placeholder="請依照原本格式填寫" value="'+value+'">')
		})
		//description
		$('#info_description').html('<input type="text" name="description" placeholder="description">')
		$('input[name$="description"]').val(imacInfoJSON.description)			
		//軟體
		$('#info_softwares').empty()
		var softwares = imacInfoJSON.softwares
		for (i in softwares){
			var id = softwares[i].id
			var name = softwares[i].name
			var stat = softwares[i].status
			var soft_stat_select_html = '<div class="select-wrapper 4u" style="display:inline-block"><select class="soft-select" name="soft_stat_'+name+'"><option value="0">未安裝</option>'
			+'<option value="1">正常</option><option value="2">異常</option></select></div>'
			$('#info_softwares').append('<li class="softwares-li status_'+stat+'"><input style="display:none" class="soft_id" value="'+id+'"/><span class="soft_name">' + name +'</span>&nbsp&nbsp&nbsp<span class="soft_stat">'+soft_stat_select_html+'</span>')
			$( 'select[name="soft_stat_'+softwares[i].name+'"]').val( softwares[i].status )
			$('.soft-select').change(function(){
				var val = $(this).val()
				$(this).parents('.softwares-li').removeClass("status_0 status_1 status_2")
				$(this).parents('.softwares-li').addClass("status_"+val)
			})
		}
		$('#info_softwares').wrapInner('<ul></ul>')
	})
	.fail( function(){
		console.log('edit - read info fail')
	})
}
function cancleEdit(id){
	imacInfo(id, true);
}
function postEdit(){
	var postJSON = {id:"1701",room:"604",position:"15",os:[],hardware:{"mac":""},availability:"",description:"",softwares:[]}
	postJSON.id = $('#imacNo').text()
	postJSON.room = $('select[name$="room"]').val()
	postJSON.position = $('input[name$="pos"]').val()
	$('input[name$="os"]:checked').each(function(){
		postJSON.os.push( $(this).val() )
	})
	postJSON.hardware.mac = $('input[name$="mac"]').val()
	postJSON.availability = $('select[name$="ava"]').val()
	postJSON.description = $('input[name$="description"]').val()
	$('.softwares-li').each(function(){
		var softwareJSON = {name:"",status:""}
		softwareJSON.id = $(this).find('.soft_id').val()
		softwareJSON.name = $(this).find('.soft_name').text()
		softwareJSON.status = $(this).find('select').prop('selected',true).val()
		postJSON.softwares.push(softwareJSON)
	})

	console.log(postJSON);
	postJSON_string = JSON.stringify(postJSON)
	if ( confirm('送出修改？') ){
		console.log(postJSON);
		$.post('./computer.php?update',postJSON, function(receiveJSON){
			////不知道要post去哪RRRRRRR///////////////////////////////
			console.log(receiveJSON)
			var receive = receiveJSON
			if (receive.status != 'ok'){
				alert('送出的東西好像有哪裡錯了>A<\n' + JSON.stringify(receiveJSON))
			}else{
				alert('已送出！')
				window.location.reload();
			}
		})
		.done(function(){
			//更新顯示
			cancleEdit(postJSON.id)
		})
		.fail(function(){
			alert('沒有送出QQ')
		})
	}

}


//把#imac裡面電腦加上顏色的class
function colorClass(availability){
	$('#imacNo').removeClass('ava_0 ava_1 ava_2 ava_-1');
	$('#imac').children('.fa-desktop').removeClass('ava_0 ava_1 ava_2 ava_-1');
	$('#imacNo').addClass('ava_'+availability);
	$('#imac').children('.fa-desktop').addClass('ava_'+availability);//可使用
}



//往上的按鈕
window.addEventListener("scroll", function(){
	var layoutY = $('#layout').offset().top;
	if ( window.scrollY > layoutY ){
		$('#top').show('slow');
	}else{
		$('#top').hide('slow');
	}
});
//往上的按鈕作用
function toLayout(){
	$('html, body').animate({
		scrollTop: $('#layout').offset().top - 20
	}, 1000);
}
