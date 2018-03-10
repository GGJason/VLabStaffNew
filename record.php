<?php
	/*--- 載入基本設定檔 ---*/
	require_once("config.php");
	/*--- 設定資料擷取起始時間 ---*/
	$start;$end;
	if(!isset($_GET["start"]))$start="2017-01-01 00:00:00";
	else $start = $_GET["start"];
	if(!isset($_GET["end"]))$end=$today;
	else $end = $_GET["end"];
	/*--- 資料庫指令設定與執行 ---*/
	$record_action = "SELECT * FROM punch WHERE username = '".$_SESSION["username"]."' AND (punchin BETWEEN '".$start."' AND '".$end."')";
//	echo $record_action;
	$query = mysqli_query($conn,$record_action);
	/*--- 資料庫取得資料後進行處理，並輸出成json形式 ---*/
	$record = $query->fetch_assoc();
	$str ="{";
	$count = 0;
	while($record!=NULL){
		if($count!=0) $str = $str.",";
/*		foreach($record as $key => $value){
			echo $value."<br>";
		}*/
		$str = $str.json_encode($record,JSON_UNESCAPED_UNICODE);
		$record = $query->fetch_array();
		$count += 1;
	}
	echo $str."}";
?>
