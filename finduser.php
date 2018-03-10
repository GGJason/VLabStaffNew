<?php
	require_once("config.php");
	$return = array();
	$return["status"]="fail";
	if(isset($_GET["email"])){
		$select = "SELECT * FROM user WHERE email = '".$_GET["email"]."'";
		$query = mysqli_query($conn,$select);
		$user = array();
		while ($result = $query->fetch_assoc() ){
			array_push($user,$result);
		}
		$return["status"]="ok";
		$return["users"]=$user;
	}
	else if(isset($_GET["professor"])&&isset($_GET["name"])){
		if($_GET["name"]==""){
			$user = array();	
			$return["status"]="fail";
			$return["users"]=$user;
		}
		else{
			$query = mysqli_query($conn,"SELECT * FROM user WHERE name LIKE CONCAT('%','".$_GET["name"]."','%') AND type >= 20");
			$user = array();	
			while ($result = $query->fetch_assoc() ){
				array_push($user,$result);
			}
			$result["status"]="ok";
			$result["users"]=$user;
		}
	}
	else if(isset($_GET["student"])&&isset($_GET["name"])){
		if($_GET["name"]=="") exit;
		$query = mysqli_query($conn,"SELECT * FROM user WHERE name LIKE CONCAT('".$_GET["name"]."','%') AND type BETWEEN 10 AND 19");
		
		$user = array();	
		while ($result = $query->fetch_assoc() ){
			array_push($user,$result);
		}
		$result["status"]="ok";
		$result["users"]=$user;
	}
	echo json_encode($result,JSON_UNESCAPED_UNICODE);
?>
