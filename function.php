<?php
	require_once("config.php");
	function ggmail($receiver,$subject,$message="",$header=""){
	$toURL = "http://test.ggjason.tw/mail.php";
	$post = array(
		"auth"=>"1ff1df870e9961093d0817878db8cc95",
		"receiver"=>$receiver,
		"subject"=>$subject,
		"message"=>$message,
		"header"=>$header,
	);
	$ch = curl_init();
	$options = array(
		CURLOPT_URL=>$toURL,
		CURLOPT_HEADER=>0,
		CURLOPT_VERBOSE=>0,
		CURLOPT_RETURNTRANSFER=>true,
		CURLOPT_POST=>true,
		CURLOPT_POSTFIELDS=>http_build_query($post),
		);
		curl_setopt_array($ch, $options);

		$result = curl_exec($ch); 
		curl_close($ch);
		echo $result;
	}
	function WorkRecord($type,$content,$conn){
		$select = "SELECT punchid FROM staff WHERE staff.username = '".$_SESSION["username"]."'";
		$query = mysqli_query($conn,$select);
		$result = $query->fetch_assoc();
		if($result["punchid"]==0)
		{
			return "{status:'Not in job'}";
		}
		$select = "SELECT punch.description,punch.id FROM staff INNER JOIN punch ON staff.punchid = punch.id WHERE staff.username = '".$_SESSION["username"]."'";
		$query = mysqli_query($conn,$select);
		$result = $query->fetch_assoc();
		$new = $type.",".$content."\n";
		$description = $result["description"];
		if(strpos($description,$new)==False)
		{
			$description = $description.$new;	
			$update = "UPDATE punch SET description = '".$description."' WHERE id = '".  $result["id"]."'";
			$query = mysqli_query($conn,$update);
			if($query)
				return "{status:'ok',description:'".$description."'}";
			else
				return "{status:'Record Error'}";
		}
		else
			return "{status:'No new jobs'}";
	}
	function routine($conn) {
		$select = "SELECT username FROM punch WHERE punchout is NULL AND punchin < '".date("Y-m-d")."'";
		$query = mysqli_query($conn,$select);
		while($result = $query->fetch_assoc())
		{
			$update = "UPDATE staff SET punchid='0'  WHERE username = '".$result["username"]."'";
			mysqli_query($conn,$update);
		}
		$update = "UPDATE punch SET punchout='".date("Y-m-d",strtotime("-1 day"))." 23:59:59'  WHERE punchout IS NULL AND punchin < '".date("Y-m-d")."'";
		$query = mysqli_query($conn,$update);
	}
	
	function googleActivity() {
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
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data = curl_exec($ch);
		curl_close($ch);
		$arr = array();
		foreach (json_decode($data)->items as $event){
			$save = array();
			$save["start"] = $event->start->dateTime;
			$save["end"] = $event->end->dateTime;
			$save["name"] = $event->summary;
			array_push($arr,$save);
		}
		return $arr;
	}	
?>
