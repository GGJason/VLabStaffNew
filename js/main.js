function pwd_handler(form)
{
        if (form.password.value != '')
            form.password.value = md5(form.password.value);
}
/*$("document").ready(function(){
	$.get("./homepage.php",function(data,status){
		$("#staffonly").html(data);
	});
});
$("doucuemt").ready(function(){
	$.get("./monitor.php?ask",function(data,status){
		m = jQuery.parseJSON(data);
		// Split timestamp into [ Y, M, D, h, m, s ]
		var t = m["time"].split(/[- :]/);

		// Apply each element to the Date function
		var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
		$("#monitor").html("V.Lab<br>現在溫度："+m["temp"]+"<br>現在濕度："+m["humidity"]+"%<br><small>更新時間"+d.toLocaleString("zh-Hans-TW")+"<small>");
	});
		setInterval(function(){
		$.get("./monitor.php?ask",function(data,status){
			m = jQuery.parseJSON(data);
			var timestamp =new Date(m["time"]);
			$("#monitor").html("V.Lab<br>現在溫度："+m["temp"]+"<br>現在濕度："+m["humidity"]+"%<br><small>更新時間"+timestamp+"<small>");
		});
	},60000);
});*/
$("docuemnt").ready(function(){
$.get("./auth.php?status",function(data,status){
	$("#status").html(data);
});});

function login(){
	var username = prompt("請登入使用者");
	var password = md5(prompt("密碼"));
	$.post("login.php",{"username":username,"password":password,},function(data,status){
		$("#status").html(data);
	});
	
}
function description(){
	/*$.get("./punch.php?content",function(data){
		$("[name='description']").val(data);
		var obj = JSON.parse(JSON.stringify(data));
		console.log(obj);
		alert(obj.description);
		$("[name='description']").html(obj['description']);
	});*/
	$.getJSON("./punch.php?content",function(data){$("[name='description']").html(data['description'].replace("////","\n"))});
}
$("document").ready(function(){
	var query = location.search;
	if (query.includes("embed")){
		$("#header").css("display","none");
		$("#main").css("margin-top","50px");
		$("#footer").css("display","none");
	}
	var footer = "<div class=\"inner\">"+
					"<section>"+
						"<h2>Follow</h2>"+
						"<ul class=\"icons\">"+
							"<li><a href=\"https://vlab.caece.net\" class=\"icon style2 fa-globe\"><span class=\"label\">Web Page</span></a></li>"+
							"<li><a href=\"https://www.facebook.com/vlab.ntu/\" class=\"icon style2 fa-facebook\"><span class=\"label\">Facebook</span></a></li>"+
						"</ul>"+
					"</section>"+
					"<ul class=\"copyright\">"+
						"<li>&copy; V.Lab 工程視覺化實驗室</li><li>Design: <a href=\"http://html5up.net\">HTML5 UP</a></li>"+
					"</ul>"+
				"</div>";
	$("footer").html(footer);
});
if (window.location.hostname != "localhost" && window.location.protocol != "https:"){
	window.location.protocol = "https:";
	window.reload();
}
console.log(window.location.protocol);
console.log(window.location.hostname);


(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Touch?
			if (skel.vars.mobile)
				$body.addClass('is-touch');

		// Forms.
			var $form = $('form');

			// Auto-resizing textareas.
				$form.find('textarea').each(function() {

					var $this = $(this),
						$wrapper = $('<div class="textarea-wrapper"></div>'),
						$submits = $this.find('input[type="submit"]');

					$this
						.wrap($wrapper)
						.attr('rows', 1)
						.css('overflow', 'hidden')
						.css('resize', 'none')
						.on('keydown', function(event) {

							if (event.keyCode == 13
							&&	event.ctrlKey) {

								event.preventDefault();
								event.stopPropagation();

								$(this).blur();

							}

						})
						.on('blur focus', function() {
							$this.val($.trim($this.val()));
						})
						.on('input blur focus --init', function() {

							$wrapper
								.css('height', $this.height());

							$this
								.css('height', 'auto')
								.css('height', $this.prop('scrollHeight') + 'px');

						})
						.on('keyup', function(event) {

							if (event.keyCode == 9)
								$this
									.select();

						})
						.triggerHandler('--init');

					// Fix.
						if (skel.vars.browser == 'ie'
						||	skel.vars.mobile)
							$this
								.css('max-height', '10em')
								.css('overflow-y', 'auto');

				});

			// Fix: Placeholder polyfill.
				$form.placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Menu.
			var $menu = $('#menu');

			$menu.wrapInner('<div class="inner"></div>')

			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menu
				.appendTo($body)
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.按X=>回到目前這頁
						if (href == '#menu')
							return;

						window.setTimeout(function() {
							window.location.href = href;
						}, 350);

				})
				.append('<a class="close" href="#menu">Close</a>');

				


			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});

	});

})(jQuery);


function pwd_handler(form)
{
        if (form.password.value != '')
            form.password.value = md5(form.password.value);
}
$("document").ready(function(){
	$.get("./homepage.php",function(data,status){
		$("#staffonly").html(data);
	});
});
$("doucuemt").ready(function(){
	$.get("./monitor.php?ask",function(data,status){
		m = jQuery.parseJSON(data);
		// Split timestamp into [ Y, M, D, h, m, s ]
		var t = m["time"].split(/[- :]/);

		// Apply each element to the Date function
		var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
		$("#monitor").html("V.Lab<br>現在溫度："+m["temp"]+"<br>現在濕度："+m["humidity"]+"%<br><small>更新時間"+d.toLocaleString("zh-Hans-TW")+"<small>");
	});
		setInterval(function(){
		$.get("./monitor.php?ask",function(data,status){
			m = jQuery.parseJSON(data);
			var timestamp =new Date(m["time"]);
			$("#monitor").html("V.Lab<br>現在溫度："+m["temp"]+"<br>現在濕度："+m["humidity"]+"%<br><small>更新時間"+timestamp+"<small>");
		});
	},60000);
});
$("docuemnt").ready(function(){
$.get("./auth.php?status",function(data,status){
	$("#status").html(data);
});});

function login(){
	var username = prompt("請登入使用者");
	var password = md5(prompt("密碼"));
	$.post("login.php",{"username":username,"password":password,},function(data,status){
		$("#status").html(data);
	});
	
}
function description(){
	/*$.get("./punch.php?content",function(data){
		$("[name='description']").val(data);
		var obj = JSON.parse(JSON.stringify(data));
		console.log(obj);
		alert(obj.description);
		$("[name='description']").html(obj['description']);
	});*/
	$.getJSON("./punch.php?content",function(data){$("[name='description']").html(data['description'].replace("////","\n"))});
}
$("document").ready(function(){
	var query = location.search;
	if (query.includes("embed")){
		$("#header").css("display","none");
		$("#main").css("margin-top","50px");
		$("#footer").css("display","none");
	}
	var footer = "<div class=\"inner\">"+
					"<section>"+
						"<h2>Follow</h2>"+
						"<ul class=\"icons\">"+
							"<li><a href=\"https://vlab.caece.net\" class=\"icon style2 fa-globe\"><span class=\"label\">Web Page</span></a></li>"+
							"<li><a href=\"https://www.facebook.com/vlab.ntu/\" class=\"icon style2 fa-facebook\"><span class=\"label\">Facebook</span></a></li>"+
						"</ul>"+
					"</section>"+
					"<ul class=\"copyright\">"+
						"<li>&copy; V.Lab 工程視覺化實驗室</li><li>Design: <a href=\"http://html5up.net\">HTML5 UP</a></li>"+
					"</ul>"+
				"</div>";
	$("footer").html(footer);
});
