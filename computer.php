<?php

	require_once("config.php");
	require_once("function.php");
	header("Content-Type:application/json");
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	//列出所有電腦 computer.php?list
	if(isset($_GET["list"])){
		if(isset($_GET["computer"])){
			$select="SELECT c.*,sc.*,s.name AS 'software' ,s.id AS 'software_id' FROM computer AS c LEFT OUTER JOIN software_computer AS sc ON sc.computer=c.id LEFT OUTER JOIN software AS s ON sc.software=s.id WHERE c.id='".$_GET["computer"]."'";
			$query = mysqli_query($conn,$select);
			$arr = array();
			$obj = array();
			$count = 0;
			while($result = $query->fetch_assoc()){
				if($count++==0){
					$obj["id"]=$result["id"];
					$obj["room"]=$result["room"];
					$obj["position"]=$result["position"];
					$obj["os"]=json_decode($result["os"]);
					$obj["hardware"]=json_decode($result["hardware"]);
					$obj["availability"]=$result["availability"];
					$obj["description"]=$result["description"];
				}
				$software = array();
				$software["name"] = $result["software"];
				$software["id"] = $result["software_id"];
				$software["status"] = $result["status"];
				array_push($arr,$software);
			}
			$obj["softwares"]=$arr;
			$avail_arr = getAvailability($conn);
			$obj["availability"] = $avail_arr[$obj["id"]];
			
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
		else if(isset($_GET["all"])){
			$select="SELECT c.*,s.id AS 'softwareid',s.name AS 'software' FROM computer AS c LEFT OUTER JOIN software_computer AS sc ON sc.computer=c.id LEFT OUTER JOIN software AS s ON sc.software=s.id WHERE 1";
			//echo $select;
			$query = mysqli_query($conn,$select);
			$computers = array();
			$arr = array();
			$obj = array();
			$obj["id"]=false;
			$count = 0;
			
			$avail_arr = getAvailability($conn);
			while($result = $query->fetch_assoc()){
				if($result["id"]!=$obj["id"]&&$obj["id"]&&$count!=0){
					$obj["hardware"]=json_decode($obj["hardware"]);
					$obj["os"]=json_decode($obj["os"]);
					$obj["softwares"]=$arr;
					array_push($computers,$obj);
					$count = 0;
					$arr = array();
				}
				if($count++==0){
					$obj=$result;
				}
				if(isset($result["softwareid"]))
				{
					$softobj=array();
					$softobj["id"]=$result["softwareid"];
					$softobj["name"]=$result["software"];
					array_push($arr,$softobj);
				}
				$obj["availability"] = $avail_arr[$obj["id"]];
			}
			$computerobj = array();
			$computerobj["computers"]=$computers;
			echo json_encode($computerobj,JSON_UNESCAPED_UNICODE);
		}
		else if(isset($_GET["id"])){
			$select="SELECT id FROM computer";
			$query = mysqli_query($conn,$select);
			$arr = array();
			while($result = $query->fetch_assoc())
				array_push($arr,$result["id"]);
			$obj = array();
			$obj["computers"] = $arr;
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
		else if(isset($_GET["availability"])){
			$select="SELECT * FROM computer_availability";
			$query = mysqli_query($conn,$select);
			$arr = array();
			while($result = $query->fetch_assoc())
				array_push($arr,$result);
			$obj = array();
			$obj["types"] = $arr;
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
		else{
			$select="SELECT * FROM computer";
			$query = mysqli_query($conn,$select);
			$arr = array();
			$avail_arr = getAvailability($conn);
			while($result = $query->fetch_assoc()){
				$result["availability"]=$avail_arr[$result["id"]];
				array_push($arr,$result);
			}
			$obj = array();
			$obj["computers"] = $arr;
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
	}
	// 取得電腦行事曆 computer.php?calendar
	else if(isset($_GET["calendar"])){
		$obj = array();
		$obj["status"]="fail";
		if(isset($_GET["check"])){	
			if(isset($_GET["start"])&&isset($_GET["end"])&&isset($_GET["computer"])){
				$select = "SELECT * FROM computer_calendar WHERE ( end > '".$_GET["start"]."' AND start <'".$_GET["end"]."' AND computer = '".$_GET["computer"]."') ORDER BY start";
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
			else if(isset($_GET["start"])&&isset($_GET["end"])){
				$select = "SELECT computer FROM computer_calendar WHERE ( end > '".$_GET["start"]."' AND start <'".$_GET["end"]."') ORDER BY start";
				$list = "SELECT id,availability FROM computer WHERE availability = 0";
				$arr = array();
				$query = mysqli_query($conn,$list);
				while($result = $query->fetch_assoc()){
					if($result["availability"]!=-1)
						$arr[$result["id"]] = true;	
				}
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
			else if(isset($_GET["status"])){
				$select = "SELECT * FROM computer_calendar WHERE  end > '".date("Y-m-d h:i:s")."' ORDER BY start";
				$list = "SELECT id,availability FROM computer WHERE 1";
				$arr = array();
				$query = mysqli_query($conn,$list);
				while($result = $query->fetch_assoc()){
					$arr[$result["id"]] = $result["availability"];	
				}
				$query = mysqli_query($conn,$select);
				while($result = $query->fetch_assoc()){
					if(isset($arr[$result["computer"]])){
						if(strtotime($result["start"]) <time())
							$arr[$result["computer"]] = 2;
						else
							$arr[$result["computer"]] = 1;
					}
					
				}
				$arr2 = array();
				foreach($arr as $key=>$val){
					$arr3= array();
					$arr3["computer"] = $key;
					$arr3["availability"] = $val;
					array_push($arr2,$arr3);
					
				}
				$obj["computers"]=$arr2;
				$obj["status"]="ok";
			}		
			else{
				$obj["message"]="Please Specify (start,end,computer)";
			}
		}
		//更新Calendar 
		else if(isset($_GET["update"])){
			$data = (object)$_POST;
			$obj["status"] = "fail";
			if(isset($data->start)&&isset($data->end)&&isset($data->user)&&isset($data->computer)&&isset($data->email)){
				$select = "SELECT user,email FROM computer_calendar WHERE ( end > ? AND start < ? AND computer = ?) ORDER BY start ";
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
				if(!isset($data->email)) $data->email = "";
				$stmt->close();
				$data->auth = base64_encode(hash("sha256",time().$data->email.$data->user.$data->computer[0]));
				$action = "INSERT INTO computer_calendar(start,end,user,computer,email,auth) VALUES(?,?,?,?,?,?)";
				$stmt = $conn->prepare($action);
				
				$stmt->bind_param("ssssss",$data->start,$data->end,$data->user,$data->computer,$data->email,$data->auth);
				$stmt->execute();
				$stmt->store_result();
				if($stmt->affected_rows > 0){
					
					if(isset($data->id)){
						$stmt = $conn->prepare("UPDATE imacrent SET status = (SELECT id FROM computer_calendar WHERE auth = ?) WHERE id = ?");
						$stmt->bind_param("ss",$data->auth,$data->id);
						$stmt->execute();
						$stmt->store_result();
					}
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
				$select = "SELECT * FROM computer_calendar WHERE id = ".$_GET["id"];
			else
				$select = "SELECT computer,start,end FROM computer_calendar WHERE id = ".$_GET["id"];
			$query = mysqli_query($conn,$select);
			if ($result = $query->fetch_assoc()){
				$obj["event"] = $result;
				$obj["status"] = "ok";
			}
		}
		else{
			$select = "SELECT start,end,computer FROM computer_calendar";
			if(isset($_SESSION["rank"])&&$_SESSION["rank"]>0)
				$select = "SELECT * FROM computer_calendar";
			
			if(isset($_GET["start"]))
				$select = $select . " WHERE ( end > '" . $_GET["start"] . "'";
			else
				$select = $select . " WHERE ( end > '" . date("Y-m-d_h:i:s", strtotime('now')) . "'";
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
			$obj["events"] = $arr;
		}
		echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	}
	else if(isset($_GET["update"])){
		$data = (object)$_POST;
		$stmt = $conn -> prepare("INSERT INTO computer VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE position=?, os=?, hardware=?, availability=?, description=?, room=?");
		if (isset($data->os))
			$data->os = json_encode($data->os);
		else
			$data->os = "[]";
		if (isset($data->hardware))
			$data->hardware = json_encode($data->hardware);
		else
			$data->hardware = "{}";
		if (!isset($data->room))
			$data->room = "604";
		
		
		$stmt -> bind_param("sssssssssssss",$data->id,$data->position,$data->os,$data->hardware,$data->availability,$data->description,$data->room,$data->position,$data->os,$data->hardware,$data->availability,$data->description,$data->room);
		$stmt -> execute();
		$stmt -> store_result();
		if($stmt->affected_rows == -1){
			$obj = array();
			$obj["status"] = "fail";			
			echo  json_encode($obj,JSON_UNESCAPED_UNICODE);
			exit();
		}
		if (isset($data->softwares)){
			foreach ($data->softwares as $soft){
				$soft = (object) $soft;
				$stmt = $conn -> prepare("INSERT INTO software_computer VALUES(?,?,'','',?) ON DUPLICATE KEY UPDATE status=?");
				$stmt -> bind_param("ssss",$data->id,$soft->id,$soft->status,$soft->status);
				$stmt -> execute();
				$stmt -> store_result();
				if($stmt->affected_rows == -1){
					$obj = array();
					$obj["status"] = "fail";			
					echo  json_encode($obj,JSON_UNESCAPED_UNICODE);
					exit();
				}
			}
		}
		$obj = array();
		$obj["status"] = "ok";			
		echo  json_encode($obj,JSON_UNESCAPED_UNICODE);
		exit();
	}else if(isset($_GET["computer"])&&isset($_GET["software"])){
	
		$responseObject = array();
		$responseObject["status"] = "ok";
		echo  json_encode($responseObject,JSON_UNESCAPED_UNICODE);
	}
	function getAvailability($conn){
	
		$select = "SELECT * FROM computer_calendar WHERE  end > '".date("Y-m-d h:i:s")."' ORDER BY start";
		$list = "SELECT id,availability FROM computer WHERE 1";
		//$join = "SELECT cc.*,cc.* FROM computer_calendar AS cc LEFT OUTER  JOIN computer as c WHERE  cc.end > '".date("Y-m-d h:i:s")."' ORDER BY start SELECT id,availability FROM computer WHERE 1";
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
