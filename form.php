<?php
/*if (extension_loaded('mysqli')) { 
    echo 'extension mysqli is loaded'; //works 
} 
if (extension_loaded('mysqlnd')) { 
    echo 'extension mysqlnd is loaded'; //works 
} */
	require("config.php");
//	ini_set('display_errors', 1); 
	Header("Content-Type:application/json");
	if (isset($_GET["imac"])){
		if(isset($_GET["list"])){
			$start = "2010/1/1T00:00:00Z";
			$end = "2019/1/1T00:00:00Z";
			if(isset($_GET["start"])){
				$start = $_GET["start"];
			}
			if(isset($_GET["end"])){
				$end = $_GET["end"];
			}
			
			$select = "SELECT * FROM imacrent WHERE timestamp BETWEEN ? AND ?";
			$mysqli = $conn->prepare($select);
			$mysqli->bind_param("ss",$start,$end);
			$mysqli->execute();
			$results = array();
			
			$mysqli->bind_result($id,$timestamp,$type,$start,$end,$computer,$os,$software,$professor,$purpose,$name,$phone,$email,$ps,$status);
			while($mysqli->fetch()){
				array_push($results,array("id"=>$id,"timestamp"=>$timestamp,"type"=>$type,"start"=>$start,"end"=>$end,"computer"=>json_decode($computer),"os"=>$os,"software"=>json_decode($software),"professor"=>$professor,"purpose"=>$purpose,"name"=>$name,"phone"=>$phone,"email"=>$email,"ps"=>$ps,"status"=>$status));
			}
			echo json_encode($results,JSON_UNESCAPED_UNICODE);
		}
		else{
			$data = (object)$_POST;
			$software = json_encode($data->software,JSON_UNESCAPED_UNICODE);
			$computer = json_encode($data->computer,JSON_UNESCAPED_UNICODE);
			$start = $data->startDate."_".$data->startTime;
			$end = $data->endDate."_".$data->endTime;
			$mysqli = $conn->prepare("INSERT INTO imacrent VALUES(DEFAULT,DEFAULT,?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT);");
			$mysqli->bind_param("ssssssssssss",$data->type,$start,$end,$computer,$data->os,$software,$data->professor,$data->purpose,$data->name,$data->phone,$data->email,$data->ps);
			$mysqli->execute();
		
			$message="親愛的 ".$data->name." 您好：\n我們已經收到您的iMac借用申請，我們將會盡快處理，若有任何問題請來信vlab@caece.net詢問，謝謝！\n\nV.Lab bot 上";
			$header="FROM: V.Lab管理員<vlab@caece.net>\nBCC:gracecatrabbit@gmail.com,csps50404@gmail.com,ggjason.tw@gmail.com";

			mail($data->email,"[V.Lab]iMac借用收件通知",$message,$header);
			$message="各位V.Lab管理員您們好： \n 有新的電腦借用申請：\n借用人：".$data->name."\n借用人email：".$data->email."\n借用目的：".$data->purpose."\n指導老師：".$data->professor."\n開始時間：".$start."\n結束時間：".$end."\n\n若同意請至以下連結進行登記 https://vlabstaff.caece.net/LentiMacResult.html\nV.Lab bot 上";
			$header="FROM: V.Lab管理員<vlab@caece.net>";

			mail("vlabstaff@caece.net","[V.Lab]iMac借用收件通知",$message,$header);
			
			
		}
	}
	
	else if (isset($_GET["software"])){
		if(isset($_GET["list"])){
			Header("Content-Type:application/json");
			$start = "2010/1/1T00:00:00Z";
			$end = "2019/1/1T00:00:00Z";
			if(isset($_GET["start"])){
			}
			if(isset($_GET["end"])){
			}
			
			$select = "SELECT * FROM softwareform WHERE timestamp BETWEEN ? AND ?";
			$mysqli = $conn->prepare($select);
			$mysqli->bind_param("ss",$start,$end);
			$mysqli->execute();
			$results = array();
			
			$mysqli->bind_result($id,$timestamp,$purpose,$teacher,$teacherID,$start,$end,$software,$name,$phone,$email,$memo,$status);
			while($mysqli->fetch()){
				array_push($results,array("id"=>$id,"timestamp"=>$timestamp,"start"=>$start,"end"=>$end,"software"=>json_decode($software),"teacher"=>$teacher,"purpose"=>$purpose,"name"=>$name,"phone"=>$phone,"email"=>$email,"memo"=>$memo,"status"=>$status));
			}
			echo json_encode($results,JSON_UNESCAPED_UNICODE);
		}
		else{
			$data = (object)$_POST;
			$start = $data->startDate;
			$end = $data->endDate;
			$software = json_encode($data->software,JSON_UNESCAPED_UNICODE);
			$mysqli = $conn->prepare("INSERT INTO softwareform VALUES(DEFAULT,DEFAULT,?,?,NULL,?,?,?,?,?,?,?,DEFAULT);");
			$mysqli->bind_param("sssssssss",$data->purpose,$data->teacher,$start,$end,$software,$data->name,$data->phone,$data->email,$data->memo);
			$mysqli->execute();
		
			$message="親愛的 ".$data->name." 您好：\n我們已經收到您的軟體安裝申請，我們將會盡快處理，若有任何問題請來信vlab@caece.net詢問，謝謝！\n\nV.Lab bot 上";
			$header="FROM: V.Lab管理員<vlab@caece.net>\nBCC:gracecatrabbit@gmail.com,csps50404@gmail.com,ggjason.tw@gmail.com";
			print_r( $mysqli);
			//mail($data->email,"[V.Lab]iMac借用收件通知",$message,$header);
			
			
		}
	}
	else if (isset($_GET["workstation"])){
		if(isset($_GET["list"])){
			Header("Content-Type:application/json");
			$start = "2010/1/1T00:00:00Z";
			$end = "2019/1/1T00:00:00Z";
			if(isset($_GET["start"])){
			}
			if(isset($_GET["end"])){
			}
			
			$select = "SELECT * FROM workstationrent WHERE timestamp BETWEEN ? AND ?";
			$mysqli = $conn->prepare($select);
			$mysqli->bind_param("ss",$start,$end);
			$mysqli->execute();
			$results = array();
			
			$mysqli->bind_result($id,$timestamp,$start,$end,$os,$software,$professor,$purpose,$name,$phone,$email,$ps,$status);
			while($mysqli->fetch()){
				array_push($results,array("id"=>$id,"timestamp"=>$timestamp,"start"=>$start,"end"=>$end,"os"=>$os,"software"=>json_decode($software),"professor"=>$professor,"purpose"=>$purpose,"name"=>$name,"phone"=>$phone,"email"=>$email,"ps"=>$ps,"status"=>$status));
			}
			echo json_encode($results,JSON_UNESCAPED_UNICODE);
		}
		else{
			$data = (object)$_POST;
			$software = json_encode($data->software,JSON_UNESCAPED_UNICODE);
			$start = $data->startDate."_".$data->startTime;
			$end = $data->endDate."_".$data->endTime;
			$mysqli = $conn->prepare("INSERT INTO workstationrent VALUES(DEFAULT,DEFAULT,?,?,?,?,?,?,?,?,?,?,DEFAULT);");
			$mysqli->bind_param("ssssssssss",$start,$end,$data->os,$software,$data->professor,$data->purpose,$data->name,$data->phone,$data->email,$data->ps);
			$mysqli->execute();
		
			$message="親愛的 ".$data->name." 您好：\n我們已經收到您的iMac借用申請，我們將會盡快處理，若有任何問題請來信vlab@caece.net詢問，謝謝！\n\nV.Lab bot 上";
			$header="FROM: V.Lab管理員<vlab@caece.net>\nBCC:gracecatrabbit@gmail.com,csps50404@gmail.com,ggjason.tw@gmail.com";

			//mail($data->email,"[V.Lab]iMac借用收件通知",$message,$header);
			
			
		}
	}
	else if(isset($_GET["public"])){
		
		$data = (object)$_GET;
		if (isset($data->id)&&isset($data->auth)&&isset($data->type)&&$data->type=="imac"){
			$stmt = $conn->prepare("SELECT * FROM computer_calendar WHERE id = ? AND auth = ?");
			$stmt->bind_param("ss",$data->id,$data->auth);
			$stmt->execute();
			$res = new stdClass();
			$stmt->bind_result($res->id,$res->timestamp,$res->start,$res->end,$res->user,$res->computer,$res->email,$res->auth);
			unset($res->auth);
			if($stmt->fetch()){
				if(strtotime($res->end)>strtotime("now")){
					echo json_encode($res,JSON_UNESCAPED_UNICODE);
				}else{
					$resp = new stdClass();
					$resp->status = "fail";
					$resp->message = "out of date";
					echo json_encode($resp,JSON_UNESCAPED_UNICODE);
				}
			}
			else{
				$resp = new stdClass();
				$resp->status = "fail";
				$resp->message = "info error";
				echo json_encode($resp,JSON_UNESCAPED_UNICODE);
			}
			
		}
	}
?>
