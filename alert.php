<?php
	function systemVariableAlert($name,$value,$receiver,$title,$message){
		require("config.php");
		$stmt = $conn->prepare("SELECT * FROM system_variable WHERE name = ?");
		$stmt -> bind_param("s",$name);
		$stmt -> execute();
		$stmt -> bind_result($id,$nam,$val);
		$stmt -> store_result();
		$stmt->fetch();
		if ($value == $val ){
			$stmt->close();
			//echo "Alerted Today";
			return;
		}else{
			//echo "Alert Now";
			mail($receiver,$title,$message,"FROM: V.Lab管理系統<vlabstaff@caece.net>");
			//var_dump($stmt);
			if ($stmt->num_rows > 0){
				$stmt->close();
				$stmt = $conn->prepare("UPDATE system_variable SET value = ? WHERE name = ?");
				$stmt -> bind_param("ss",$value,$name);
				$stmt -> execute();
				$stmt -> store_result();
				if ($stmt->affected_rows == 1){
				//	echo "UPDATE";
				}
			}else{
				$stmt->close();
				$stmt = $conn->prepare("INSERT INTO system_variable VALUES (DEFAULT,?,?)");
				$stmt -> bind_param("ss",$name,$value);
				$stmt -> execute();
				$stmt -> store_result();
				if ($stmt->affected_rows == 1){
				//	echo "INSERT";
				}
			
			}
		}
	}
	function checkCountDate(){
		require("config.php");
		$stmt = $conn->prepare("SELECT MAX(date) AS date FROM count ");
		$stmt -> execute();
		$stmt -> bind_result($max);
		$stmt -> store_result();
		$stmt -> fetch();
		if (strtotime($max) < strtotime("-7 days")){
			//echo "need alert";
			systemVariableAlert("COUNT_ALERT_LAST_DATE",$max,"vlabstaff@caece.net","人數統計已超過七天未點（".$max."）","親愛的V.Lab工讀生您好：\n\n從".$max."開始已經超過七天未點人數，請儘快去點喔～ \n\n\n\nV.Lab bot 敬上");
		}
	}
	checkCountDate();

?>
