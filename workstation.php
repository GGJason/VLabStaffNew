<?php

	require_once("config.php");
	require_once("function.php");
	header("Content-Type:application/json");
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	// 取得電腦行事曆 computer.php?calendar
	if(isset($_GET["calendar"])){
		$obj = array();
		$obj["status"]="fail";
		if(isset($_GET["check"])){	
			/*if(isset($_GET["start"])&&isset($_GET["end"])){
				$select = "SELECT * FROM workstation_calendar ORDER BY start";
				$query = mysqli_query($conn,$select);
				if($query->num_rows > 0)
					$obj["message"]="Occupied";
				else
					$obj["message"]="Empty";
				$obj["status"]="ok";
				$occupiedEvent = array();
				foreach(googleActivity() as $event){
					if ( strtotime($event["start"]) < strtotime($_GET["end"]) && strtotime($event["end"]) > strtotime($_GET["start"]) ){	
						$obj["message"]= "Occupied";
						$event["start"] = date("Y/m/d h:i:s",strtotime($event["start"]));
						$event["end"] = date("Y/m/d h:i:s",strtotime($event["end"]));
						array_push($occupiedEvent,$event);
					}
				}
				$obj["event"] = $occupiedEvent;
			}
			else */if(isset($_GET["start"])&&isset($_GET["end"])){
				$select = "SELECT computer FROM workstation_calendar WHERE ( end > '".$_GET["start"]."' AND start <'".$_GET["end"]."') ORDER BY start";
				$arr = array();
				$query = mysqli_query($conn,$select);
				while($result = $query->fetch_assoc())
					if(isset($arr[$result["computer"]]))
						unset($arr[$result["computer"]]);
				$arr2 = array();
				foreach($arr as $key=>$val)
					array_push($arr2,$key);
				$obj["computers"]=$arr2;
				$obj["status"]="ok";
						
				$occupiedEvent = array();
				foreach(googleActivity() as $event){
					if ( strtotime($event["start"]) < strtotime($_GET["end"]) && strtotime($event["end"]) > strtotime($_GET["start"]) ){	
						$obj["message"]= "Occupied";
						$event["start"] = date("Y-m-d h:i:s",strtotime($event["start"]));
						$event["end"] = date("Y-m-d h:i:s",strtotime($event["end"]));
						array_push($occupiedEvent,$event);
					}
				}
				$obj["event"] = $occupiedEvent;
				$obj["computers"]=array();
			}		
			else{
				$obj["message"]="Please Specify (start,end)";
			}
		}
	
		if(isset($_GET["update"])){
			$data = (object)$_POST;
			$obj["status"] = "fail";
			if(isset($data->start)&&isset($data->end)&&isset($data->user)&&isset($data->email)){
				$select = "SELECT user,email FROM workstation_calendar WHERE ( end > ? AND start < ? AND computer = ?) ORDER BY start ";
				$stmt= $conn->prepare($select);
				$stmt->bind_param("ssi",$data->start,$data->end,$data->computer);
				$stmt->bind_result($user,$email);
				$stmt->execute();
				$stmt->fetch();
				$stmt->store_result();
				if ($stmt->num_rows > 0 && $user != $data->user && $email != $data->email){
			
					$obj["message"]="computer occupied";
					echo json_encode($obj,JSON_UNESCAPED_UNICODE);
					exit();
			
				}
				$stmt->close();
				$data->auth =base64_encode hash("sha256",time().$data->email.$data->user.$data->computer[0]));
				$action = "INSERT INTO workstation_calendar(start,end,user,computer,email,auth) VALUES(?,?,?,?,?,?)";
				$stmt = $conn->prepare($action);
		
				$stmt->bind_param("ssssss",$data->start,$data->end,$data->user,$data->computer,$data->email,$data->auth);
				$stmt->execute();
				$stmt->store_result();
				if($stmt->affected_rows > 0){
			
					$obj["status"] = "ok";
					$obj["message"]="ok";
			
				}			
			}
			else{
				$obj["message"]="Please Post (start,end,user,computer)";
			}

		}
		else if(isset($_GET["id"])){
			$select = "";
			if(isset($_SESSION["rank"])&&$_SESSION["rank"]>0)
				$select = "SELECT * FROM workstation_calendar WHERE id = ".$_GET["id"];
			else
				$select = "SELECT computer,start,end FROM workstation_calendar WHERE id = ".$_GET["id"];
			$query = mysqli_query($conn,$select);
			if ($result = $query->fetch_assoc()){
				$obj["event"] = $result;
				$obj["status"] = "ok";
			}
		}
		else{
			$select = "SELECT start,end,computer FROM workstation_calendar";
			if(isset($_SESSION["rank"])&&$_SESSION["rank"]>0)
				$select = "SELECT * FROM workstation_calendar";
	
			if(isset($_GET["start"]))
				$select = $select . " WHERE ( end > '" . $_GET["start"] . "'";
			else
				$select = $select . " WHERE ( end > '" . date("Y-m-d_h:i:s", strtotime('-1 year')) . "'";
			if(isset($_GET["end"]))
				$select = $select . " AND start <'" . $_GET["end"] . "')";
			else
				$select = $select . " AND start <'" . date("Y-m-d_h:i:s", strtotime('+1 year')) . "')";
	
			$select = $select . " ORDER BY start";
	
			$query = mysqli_query($conn,$select);
			$arr = array();
			while($result = $query->fetch_assoc()){
				array_push($arr,$result);
			}
			$obj["status"]="ok";
			$obj["computers"] = $arr;
		}
	}
	echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	function getAvailability($conn){
	
		$select = "SELECT * FROM workstation_calendar WHERE  end > '".date("Y-m-d h:i:s")."' ORDER BY start";
		$list = "SELECT id,availability FROM computer WHERE 1";
		//$join = "SELECT cc.*,cc.* FROM workstation_calendar AS cc LEFT OUTER  JOIN computer as c WHERE  cc.end > '".date("Y-m-d h:i:s")."' ORDER BY start SELECT id,availability FROM computer WHERE 1";
		$arr = array();
		$query = mysqli_query($conn,$list);
		while($result = $query->fetch_assoc()){
			$arr[$result["id"]] = $result["availability"];	
		}
		$query = mysqli_query($conn,$select);
		while($result = $query->fetch_assoc()){
			if(isset($arr[$result["computer"]])){
				if(strtotime($result["start"]) <time())
					$arr[$result["computer"]] = "2";
				else
					$arr[$result["computer"]] = "1";
			}
			
		}
		$arr2 = array();
		foreach($arr as $key=>$val){
			$arr3= array();
			$arr3["computer"] = $key;
			$arr3["availability"] = $val;
			array_push($arr2,$arr3);
			
		}
		return $arr;
	
	}
?>
