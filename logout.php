<?php
	require_once("config.php");
	foreach($_SESSION as $ele)
		$ele = "";
	$_SESSION["auth"]="";
	$_SESSION["username"]="";
	$_SESSION["name"]="";
	$_SESSION["rank"]="";
	$_SESSION["rankname"]="";
	$_SESSION["profile"]="";
	$_SESSION["punch"]="";
	$_SESSION["punchin"]="";
	$obj = array();
	$obj["status"]="ok";
	echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	if(isset($_GET["redirect"])){
		header("Location: ".$_GET["redirect"]);
	}
?>
