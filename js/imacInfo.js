
var imacInfoBlank = "<h2>軟體資訊</h2>"
//main
$.get("http://vlabstaff.caece.net/auth.php?info", function(){
	imacLayout(true);
	$("#imacInfo-table").html( imacInfoBlank );
})
.fail( function(){
	imacLayout(false);
	$("#imacInfo-table").html( imacInfoBlank );
} )

function imacLayout(auth){
	$.get('computer.php?list', function( responseText ){
		var i = 0;
		var imacR604=[];
		var imacR613=[];
		var imacRN=[];
		var imacAll=[];
		var imacArr = JSON.parse( responseText ).computers;
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
			//上色
			if ( imacR604[i].availability == 0 ){
				$('#layoutR604_'+i).addClass('ava_0');//可使用
			}else if ( imacR604[i].availability == 1 ){
				$('#layoutR604_'+i).addClass('ava_1');//已預約
			}else if ( imacR604[i].availability == 2 ){
				$('#layoutR604_'+i).addClass('ava_2');//借用中
			}else{
				$('#layoutR604_'+i).addClass('ava_-1');//維修中
			}
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
			//上色
			if ( imacR613[i].availability == 0 ){
				$('#layoutR613_'+i).addClass('ava_0');//可使用
			}else if ( imacR613[i].availability == 1 ){
				$('#layoutR613_'+i).addClass('ava_1');//已預約
			}else if ( imacR613[i].availability == 2 ){
				$('#layoutR613_'+i).addClass('ava_2');//借用中
			}else{
				$('#layoutR613_'+i).addClass('ava_-1');//維修中
			}
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
				if ( imacRN[i].availability == 0 ){
					$('#layoutRN_'+i).addClass('ava_0');//可使用
				}else if ( imacRN[i].availability == 1 ){
					$('#layoutRN_'+i).addClass('ava_1');//已預約
				}else if ( imacRN[i].availability == 2 ){
					$('#layoutRN_'+i).addClass('ava_2');//借用中
				}else{
					$('#layoutRN_'+i).addClass('ava_-1');//維修中
				}
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

		console.log(imacAll);

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
	$.get('computer.php?list&computer='+id, function( responseText ){
		var i=0;
		var imacInfoJSON = JSON.parse( responseText );

		//幫電腦上色
		if ( imacInfoJSON.availability == 0 ){
			$('#imacNo').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imac').children('.fa-desktop').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imacNo').addClass('ava_0');
			$('#imac').children('.fa-desktop').addClass('ava_0');//可使用
		}else if ( imacInfoJSON.availability == 1 ){
			$('#imacNo').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imac').children('.fa-desktop').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imacNo').addClass('ava_1');
			$('#imac').children('.fa-desktop').addClass('ava_1');//已預約
		}else if ( imacInfoJSON.availability == 2 ){
			$('#imacNo').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imac').children('.fa-desktop').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imacNo').addClass('ava_2');
			$('#imac').children('.fa-desktop').addClass('ava_2');//借用中
		}else{
			$('#imacNo').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imac').children('.fa-desktop').removeClass('ava_0 ava_1 ava_2 ava_-1');
			$('#imacNo').addClass('ava_-1');
			$('#imac').children('.fa-desktop').addClass('ava_-1');//維修中
		}

		var html = '<table>';
		html += '<tbody><tr><td>電腦位置</td><td>room' + imacInfoJSON.room + '_' + imacInfoJSON.position + '</td></tr>'
			+ '<tr><td><b>電腦狀態</b></td><td>';

		if ( imacInfoJSON.availability == 0 ){
			html += '<b class="ava_0">可使用</b>';
		}else if ( imacInfoJSON.availability == 1 ){
			html += '<b class="ava_1">已預約</b>';
		}else if ( imacInfoJSON.availability == 2 ){
			html += '<b class="ava_2">借用中</b>';
		}else{
			html += '<b class="ava_-1">維修中</b>';
		}
		html+='</td></tr>' 
			+ '<tr><td>作業系統</td><td>' + imacInfoJSON.os + '</td></tr>'
		
		if( auth == true ){
			html+= '<tr><td>硬體資訊</td><td>';
			var hardwares = imacInfoJSON.hardware;
			console.log(hardwares)
			$.each(hardwares, function(index, value){
				html += '<li><b>' + index + '</b>&nbsp&nbsp' + value;

			})
			html +='</td></tr>' ;
			html+= '<tr><td>描述</td><td>' + imacInfoJSON.description + '</td></tr>';
		}
		html+= '<tr><td>軟體</td><td><ul>';
			var softwares = imacInfoJSON.softwares;
			$.each(softwares, function(index, value){
				html += '<li>' + value;
			})
		html += '</ul></td></tr>';
		html += '</tbody></table>';
		$('#imacInfo-table').html( html );
	})
	.fail( function(){
		$('#imacInfo-table').html( '讀取資訊失敗' );
	})
}
window.addEventListener("scroll", function(){
	var layoutY = $('#layout').offset().top;
	if ( window.scrollY > layoutY ){
		$('#top').show('slow');
	}else{
		$('#top').hide('slow');
	}
});
function toLayout(){
	$('html, body').animate({
		scrollTop: $('#layout').offset().top - 20
	}, 1000);
}