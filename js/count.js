$("html").ready(function(){
	var today = new Date();
	$(".today").val(today.toJSON().substring(0,10));
	dateChangeListener();
});
function dateChangeListener(){
	$.ajax({
		url: "./count.php",
		type:"GET",
		data:{
			date:$("#date").val(),
		},
		success:function(response){
			$("#count").val(response);
		},
		error:function(xhr){
			console.log(xhr)
			alert("Ajax 錯誤");
		},
	});
}
function countChangeListenter (num){
	var newCount;
	if($("#count").val() == "No Record")
		newCount = 0;
	else
		var newCount = parseInt($("#count").val());
	if(num>=0){
		newCount += num;
	}
	else{
		newCount -= 1;
		if(newCount < 0){
alert("太少人啦");
newCount = 0;
		}
	}
	if($("#count").val() != "No Record" || newCount > 0){
		$("#count").val(newCount);
		$.ajax({
			url: "./count.php",
			type:"POST",
			data:{
				date:$("#date").val(),
				count:newCount,
			},
			error:function(xhr){
				alert("請登入");
				window.location="auth.php";
			},
			success:function(response){
				if(response=="403")window.location="auth.php";
			},
			statusCode:{
				403:function(){alert("請登入");},
			},
		});
	}
};
function dateChange (num){		
	countChangeListenter(0);
	var arr = $("#date").val().split("-");
	var newDate = new Date(arr[0],arr[1]-1,arr[2]);
	if(num>0){
		newDate.setDate(newDate.getDate()+2);
	}
	else{
		newDate.setDate(newDate.getDate()-0.5);
	}
	$("#date").val(newDate.toJSON().substring(0,10));
	dateChangeListener();
};
