<?php
	require_once("config.php");
	$stmt = $conn -> prepare("SELECT id FROM software WHERE 1");
	$stmt -> bind_result($id);
	$stmt -> execute();
	
	
	$softs = array();
	while ($stmt->fetch()){
		array_push($softs,$id);
	}
	
	$stmt -> prepare("SELECT id FROM computer WHERE 1");
	$stmt -> bind_result($id);
	$stmt -> execute();
	
	$coms = array();
	while ($stmt->fetch()){
		array_push($coms,$id);
	}
	foreach($softs as $soft){
		foreach($coms as $com){
			$stmt -> prepare("INSERT INTO software_computer VALUES(?,?,'','',0)");
			$stmt -> bind_param("ii",$com,$soft);
			$stmt -> execute();
			echo $com." -> ".$soft." OK";
		}
	}
	
?>
