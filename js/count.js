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
$("#showContent").ready(function(){

	var svg = d3.select("svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var x = d3.scaleTime()
		.rangeRound([0, width]);
	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);
	var line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.count); });
	d3.json("./count.php?show&month",function(error, data) {
  		var dateFmt = d3.timeFormat('%Y-%m-%d');
		data.forEach(function(d) {
    		d.date = new Date(d.date);
    		d.count = +d.count;
    		console.log(d.date);
		});
		if (error) throw error;
		x.domain([d3.min(data, function(d) { return d.date; }),d3.max(data, function(d) { return d.date; })]);
		y.domain([0,d3.max(data, function(d) { return d.count; })]);

		g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
.select(".domain")
  .remove();

		g.append("g")
  .call(d3.axisLeft(y))
.append("text")
		  	.attr("fill", "#000")
		  	.attr("transform", "rotate(-90)")
		  	.attr("y", 6)
		  	.attr("dy", "0.71em")
		  	.attr("text-anchor", "end")
		  	.text("People");

	  	g.append("path")
		  	.datum(data)
		  	.attr("fill", "none")
		  	.attr("stroke", "steelblue")
		  	.attr("stroke-linejoin", "round")
		  	.attr("stroke-linecap", "round")
		  	.attr("stroke-width", 1.5)
		  	.attr("d", line);
	});
});