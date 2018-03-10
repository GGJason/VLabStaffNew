<?php
	require_once("config.php");
	require_once("function.php");
	if(isset($_GET["calendar"])){
		header("charset=utf-8;");
		$url = "https://www.googleapis.com/calendar/v3/calendars/caece.net_v9sif4ivjgm4265i5ojjs657gc@group.calendar.google.com/events?key=AIzaSyALNnxqW3ZEtelCNw_cH6otLhaLMx22ToQ&singleEvents=true&orderBy=starttime";
		$timeMin;
		
		if(isset($_GET["timeMin"]))
			$timeMin=$_GET["timeMin"];
		else
			$timeMin=gmdate("Y-m-d\TH:i:s\Z");
		$url = $url."&timeMin=".$timeMin;
			
		if(isset($_GET["timeMax"]))
			$url = $url."&timeMax=".$_GET["timeMax"];
		$ch = curl_init($url);
		curl_exec($ch);
		curl_close($ch);
	}	
	
	else if(isset($_GET["activity"])){
		$obj = array();
		$obj["status"]="ok";
		$obj["activity"] = googleActivity();
		echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	}
	
	//2017-09-14T00:00:00-00:00
?>
