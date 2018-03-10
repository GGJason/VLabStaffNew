$.get("auth.php?info", function(responseText){
	var authJSON = JSON.parse(responseText)
	generateUser()
})
.fail( function(){
	window.location = 'index.html';
})


function generateUser(){
	$.get('user.php?list', function(responseText){
		var userJSON = JSON.parse(responseText).staff
		console.log(userJSON)
		var html ='<h3>交辦事項給：</h3>'
		for (var i = 0; i < userJSON.length; i++) {
			html += '<div class="user"><input class="userCheckbox" type="checkbox" name="receiver" id="' + userJSON[i].username + '" '
			+ 'value="' + userJSON[i].username + '" >'
			+ '<label for="' + userJSON[i].username + '">' + userJSON[i].name + '</label></div>'
		}
		html += '<br>'
		$('#send-form').prepend(html)
	})
}

function toAllUser(){
	$('.userCheckbox').prop('checked','true')
}


function submitNote(form){
	var postJSON = {'receiver':'','note':''}
	var receiver = []
	$usercheck = $('.userCheckbox')
	for (var i=0; i<$usercheck.length; i++){
		if ($usercheck[i].checked == true){
			receiver[receiver.length]=$usercheck[i].value;
		}
	} 
	postJSON['receiver'] =  '['
	for (var i=0; i < receiver.length ; i++ ){
		postJSON['receiver'] +=  '"' + receiver[i] + '"';
		if ( i != receiver.length-1 )
			postJSON['receiver'] +=  ',';
	}
	postJSON['receiver'] +=  ']'
	postJSON['note'] = $('#noteText').val() ;
	if ( postJSON['receiver'] == '[]' ){
		alert('選一下要送給誰嘛（´・ω・`）？')
	}else if( postJSON['note'] == '' ){
		alert('說點話嘛（´・ω・`）？')	
	}else if ( confirm('送出交辦事項？') ){
		console.log(postJSON);
		$.post('note.php?send',postJSON, function(receiveJSON){
			console.log(receiveJSON);
		})
		.done(function(){
			alert('已送出！');
			window.location = 'note.html';
		})
		.fail(function(){
			alert('沒有送出QQ')
		})
	}
	else{
		alert('取消送出ˊ_>ˋ');
	}
}