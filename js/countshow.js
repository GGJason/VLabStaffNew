function range(start, stop, step) {
	if (typeof stop == 'undefined') {
		// one param defined
		stop = start;
		start = 0;
	}

	if (typeof step == 'undefined') {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	var result = [];
	for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
};

function range(start, stop, step) {
	if (typeof stop == 'undefined') {
		// one param defined
		stop = start;
		start = 0;
	}

	if (typeof step == 'undefined') {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	var result = [];
	for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
};
var heatData = {}	
var color = {}		
var maxCount = 0	
var div = d3.select("body").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);
var svg = d3.select("svg"),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var innerWidth = width - 40
var x = d3.scaleLinear()
	.rangeRound([40, width],.1);
var y = d3.scaleLinear()
    .rangeRound([height, 0]);
var center;
var yearColor = d3.scaleLinear()
	.interpolate(d3.interpolateRgb)
 	.range(["#2c7fb8","#7fcdbb"])
d3.json("./count.php?show&month",function(error, data) {
	var dateFmt = d3.timeFormat('%Y-%m-%d');
	minDate = new Date();
	data.months = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	
	minYear = new Date().getFullYear();
	
	data.forEach(function(d) {
		d.date = new Date(d.date);
		d.year = d.date.getFullYear();
		if(d.year < minYear) minYear = d.year;
		d.month = d.date.getMonth()+1;
		if(d.date<minDate)
			minDate = d.date;
		d.count = +d.count;
		d.bottom = data.months[d.month];
		data.months[d.month]+=d.count;
		d.top = data.months[d.month];
	});
	thisYear = new Date().getFullYear();
	yearColor.domain([minYear,thisYear])
	yearGap = thisYear - minYear; 
	if (error) throw error;
	barwidth = innerWidth / 15 / (Math.floor((new Date()-minDate )/365/24/60/60/1000)+1);
	//console.log(barwidth);
	center = Math.floor((new Date()-minDate )/365/24/60/60/1000/2+minDate.getFullYear()-1);
	//x.domain([d3.min(data, function(d) { return d.date; }),d3.max(data, function(d) { return d.date; })]);
	dataSave = data;
	list();
});
$.get("./count.php?show&day",function(data){
					console.log(data);
	heatData = data;
	var dateFmt = d3.timeFormat('%Y-%m-%d');
	mD = new Date();
	var minYear = maxYear = new Date().getFullYear();
	maxYear += 1
	heatData.forEach(function(d) {
		d.date = new Date(d.date);
		d.dt = d.date.getDate();
		d.month = d.date.getMonth()+1;
		d.year = d.date.getFullYear();
		if (minYear > d.year) minYear = d.year;
		if (maxCount < d.count) maxCount = parseInt(d.count);
		var timestamp = new Date().setFullYear(d.year,0,1);
		var yearFirstDay = Math.floor(timestamp/86400000);
		d.day = Math.ceil(d.date/86400000) - yearFirstDay;
	});
	color = d3.scaleLinear().domain([0,maxCount])
 		.interpolate(d3.interpolateRgb)
      	.range(["#edf8b1","#7fcdbb","#2c7fb8"])
})
function list(){
	g.selectAll("g").remove()
	g.selectAll("text").remove()
	barwidth = innerWidth / 15 / yearGap ;
	data = dataSave;
	g.selectAll("g").remove();
	g.selectAll("rect").remove();
	x.domain([0.5,12.5])
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
	 g.selectAll("rect")
	 	.data(data)
	 	.enter()
	 	.append("rect")
	 	.attr("x",function(d){
	 		change = d.date; 
	 		
	 		var years = Math.floor((change-new Date().setFullYear(center))/365/24/60/60/1000); 
	 		
	 		
	 		return x(d.month)+((d.year-minYear)-yearGap/2)*barwidth;})
	 	.attr("width",barwidth)
	 	.attr("y",function(d){return y(d["count"]);})
	 	.attr("height",function(d){return height - y(d["count"]);})
	 	.attr("fill",function(d){return yearColor(d.year)})
	 	.attr("class",function(d){return "bar"+d.year;})
	 	.on("mouseover", function(d) {		
			div.transition()		
				.duration(200)		
				.style("opacity", .9);		
			div	.html(d.year+"年"+d.month+"月<br>"+d.count)	
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 40) + "px");	
			})					
		.on("mouseout", function(d) {		
			div.transition()		
				.duration(500)		
				.style("opacity", 0);	
		});
	 	
 	
}
function heat(){
	color.domain([0,maxCount/2,maxCount]);
	barwidth = innerWidth/420;
	
	var celheight = height/(maxYear-minYear);
	
	//console.log(barwidth);
	center = Math.floor((new Date()-mD )/365/24/60/60/1000/2+mD.getFullYear()-1);



	g.selectAll("g").remove()
	g.selectAll("text").remove()
	g.selectAll("rect").remove();
	y.domain([minYear-0.5,maxYear-0.5]);
	y.tickFormat(d3.format("d"));
	y.ticks(yearGap);
	x.domain([0.5,12.5]);
	console.log([minYear,maxYear]);

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.select(".domain")
		.remove();

	g.append("g")
		.call(d3.axisLeft(y).tickFormat(d3.format("d")).ticks(yearGap))
		.append("text")
	  	.attr("fill", "#000")
	  	.attr("transform", "rotate(-90)")
	  	.attr("y", 6)
	  	.attr("dy", "0.71em")
	  	.attr("text-anchor", "end")
	  	.text("Year");

	 g.selectAll("rect")
	 	.data(heatData)
	 	.enter()
	 	.append("rect")
	 	.attr("x",function(d){return x(d.month-0.5)+d.dt*barwidth;})
	 	.attr("width",barwidth)
	 	.attr("y",function(d){return y(d.year-0.5) - celheight;})
	 	.attr("height",celheight)
	 	.attr("style",function(d){return "fill:"+ color(d.count);})
		.on("mouseover", function(d) {		
			div.transition()		
				.duration(200)		
				.style("opacity", .9);		
			div	.html(d.year+"年"+d.month+"月"+d.dt+"日<br>"+d.count)	
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 40) + "px");	
			})					
		.on("mouseout", function(d) {		
			div.transition()		
				.duration(500)		
				.style("opacity", 0);	
		});
	
	var legendData = range(maxCount/10+1)
	for(var i in legendData){
		legendData[i] *= 10
	}
	console.log(legendData)
	g.append("g")
		.selectAll("rect")
		.data(legendData)
		.enter()
		.append("rect")
			.attr("x",function(d,i){return width - 400 +i*30;})
			.attr("y",10)
			.attr("width",30)
			.attr("height",10)
			.attr("fill",function(d){return color(d)})
	g.append("g")
		.selectAll("text")
		.data(legendData)
		.enter()
		.append("text")
			.attr("x",function(d,i){return width - 400 +i*30;})
			.attr("y",10)
			.attr("width",30)
			.text(function(d){return d})

	

}
function monthheat(){
	maxValue = 0;
	minValue = 100000;
	dataSave.forEach(function(d){
		if (d.count > maxValue)
			maxValue = d.count
		if (d.count < minValue)
			minValue = d.count
	})
	console.log((maxValue+minValue)/2)
	color.domain([minValue,(maxValue+minValue)/2,maxValue]);
	barwidth = innerWidth/13;
	
	var celheight = height/(maxYear-minYear);
	
	//console.log(barwidth);
	center = Math.floor((new Date()-mD )/365/24/60/60/1000/2+mD.getFullYear()-1);



	g.selectAll("g").remove()
	g.selectAll("text").remove()
	g.selectAll("rect").remove();
	y.domain([minYear-0.5,maxYear-0.5]);
	y.tickFormat(d3.format("d"));
	y.ticks(yearGap);
	x.domain([0.5,12.5]);
	console.log([minYear,maxYear]);

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.select(".domain")
		.remove();

	g.append("g")
		.call(d3.axisLeft(y).tickFormat(d3.format("d")).ticks(yearGap))
		.append("text")
	  	.attr("fill", "#000")
	  	.attr("transform", "rotate(-90)")
	  	.attr("y", 6)
	  	.attr("dy", "0.71em")
	  	.attr("text-anchor", "end")
	  	.text("Year");

	 g.selectAll("rect")
	 	.data(dataSave)
	 	.enter()
	 	.append("rect")
	 	.attr("x",function(d){return x(d.month-0.5);})
	 	.attr("width",barwidth)
	 	.attr("y",function(d){return y(d.year-0.5) - celheight;})
	 	.attr("height",celheight)
	 	.attr("style",function(d){return "fill:"+ color(d.count);})
		.on("mouseover", function(d) {		
			div.transition()		
				.duration(200)		
				.style("opacity", .9);		
			div	.html(d.year+"年"+d.month+"月<br>"+d.count)	
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 40) + "px");	
			})					
		.on("mouseout", function(d) {		
			div.transition()		
				.duration(500)		
				.style("opacity", 0);	
		});
	
	var legendData = range(minValue/2,maxValue/2)
	var legendAxisData = range(minValue/60,maxValue/60+1)
	for(var i in legendData){
		legendData[i] *= 2
	}
	for(var i in legendAxisData){
		legendAxisData[i] *= 60
	}
	console.log(legendData)
	g.append("g")
		.selectAll("rect")
		.data(legendData)
		.enter()
		.append("rect")
			.attr("x",function(d,i){return width - 400 +i;})
			.attr("y",10)
			.attr("width",1)
			.attr("height",10)
			.attr("fill",function(d){return color(d)})
	g.append("g")
		.selectAll("text")
		.data(legendAxisData)
		.enter()
		.append("text")
			.attr("x",function(d,i){return width - 400 +i*30;})
			.attr("y",10)
			.attr("width",30)
			.text(function(d){return d})

	

}
function stacked (){
	x.domain([1,12.5]);
	barwidth=innerWidth/14;
	tempMonths = dataSave.months;
	//console.log(dataSave);
	y.domain([0,d3.max(dataSave.months,function(d){return d;})]);
	g.selectAll("g").remove()
	g.selectAll("text").remove()
	g.append("g")
		.call(d3.axisLeft(y))
		.append("text")
	  	.attr("fill", "#000")
	  	.attr("transform", "rotate(-90)")
	  	.attr("y", 6)
	  	.attr("dy", "0.71em")
	  	.attr("text-anchor", "end")
	  	.text("People");
	  	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.select(".domain")
		.remove();
	g.selectAll("rect")
		.remove();
	g.selectAll("rect")
	  	.data(dataSave)
	  	.enter()
	  .append("rect")
	  	.attr("x",function(d){
	 		change = d.date; 
	 		
	 		var years = Math.floor((change-new Date().setFullYear(center))/365/24/60/60/1000); 
	 		
	 		return x(d.month)-barwidth/2;})
	 	.attr("width",barwidth)
	 	.attr("y",function(d){ return y(d.top);})
	 	.attr("height",function(d){return y(d.bottom)-y(d.top);})
	 	.attr("fill",function(d){return yearColor(d.year)})
	 	.attr("class",function(d){return "bar"+d.year;})
	 	
		 	.on("mouseover", function(d) {		
				div.transition()		
					.duration(200)		
					.style("opacity", .9);		
				div	.html(d.year+"年"+d.month+"月<br>"+d.count)	
					.style("left", (d3.event.pageX) + "px")		
					.style("top", (d3.event.pageY - 40) + "px");	
				})					
			.on("mouseout", function(d) {		
				div.transition()		
					.duration(500)		
					.style("opacity", 0);	
			});
	 	
 	g.selectAll("text .data")
	 	.data(dataSave)
	 	.enter()
	   .append("text")
	  	.text(function(d){return d["count"];})
	  	.attr("text-anchor","middle")
	 	.attr("x",function(d){	 		
	 		var years = Math.floor((d.date-new Date().setFullYear(center))/365/24/60/60/1000); 
	 		return x(d.month);})
	 	.attr("y",function(d){return  (y(d.top)+y(d.bottom))/2 + 3 ;})
}
function exportImg(){

	var svg = d3.select("svg")
	var svgString = getSVGString(svg.node());
	svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

	function save( dataBlob, filesize ){
		saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
	}
}

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (var i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];
			
			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}
		

		return extractedCSSText;

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css"); 
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}


function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});

		
	};

	image.src = imgsrc;
}

