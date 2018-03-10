$("body").ready(function(){
	d3.csv("./data/people.csv",function(error,data){
		d3.select("#chart").data(data).enter().append("g");
	});
});
