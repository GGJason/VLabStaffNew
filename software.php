<?php

	require_once("config.php");
	header("Content-Type:application/json")

/*-----------Non-Auth Function-----------*/
	if(isset($_GET["list"])){
	
		if(isset($_GET["computer"])){
			$select = "SELECT S.*,SC.*,C.position,C.room FROM software AS S LEFT OUTER JOIN software_computer AS SC ON S.id = SC.software RIGHT OUTER JOIN computer AS C ON SC.computer = C.id WHERE 1 ORDER BY S.id";
		
			$query = mysqli_query($conn,$select);
			while($result = $query->fetch_assoc())
				var_dump($result);
		}
		else{
			$select = "SELECT id,name FROM software WHERE 1 ORDER BY CASE WHEN name = '' THEN 1 ELSE 2 END DESC, name ASC";
			if(isset($_GET["all"]))
			{
				require("auth.php");
				$select = "SELECT s.*,u.name AS user,u.id AS userid, u.phone,u.email FROM software AS s LEFT OUTER JOIN user AS u ON s.user=u.id  WHERE 1 ORDER BY s.name";
				
			}
			$query=mysqli_query($conn,$select) or die("Database Not Work!");
			$obj = array();
			$obj["status"] = "fail";
			if($query->num_rows==0)
				$obj["status"] = "No Softwares";
			else{
				$obj["status"] = "ok";
				$arr = array();
				while($record=$query->fetch_assoc()){
					array_push($arr,$record);
				$obj["softwares"] = $arr;
			
				}
			}
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
	}
	
	else if(isset($_GET["name"])){
		$query;
		$select;	
		$result = array();
		if(isset($_SESSION["rank"])&&$_SESSION["rank"]>=10)
			$select = "SELECT s.id,s.name,s.company,s.licenseDue,s.usageDue,s.user AS userid, s.image,s.os,
			u.name AS user,
			sc.computer,sc.description,sc.status,
			c.room,c.position
			FROM software AS s 
			LEFT OUTER JOIN user AS u ON s.user=u.id 
			LEFT OUTER JOIN software_computer AS sc ON s.id = sc.software 
			LEFT OUTER JOIN computer AS c ON sc.computer = c.id
			WHERE s.name LIKE '%".$_GET["name"]."%'";
		else
			$select="SELECT s.name,s.company,s.licenseDue,s.usageDue,s.os,
			c.room,c.position,
			sc.computer,sc.status 
			FROM software AS s 
			LEFT OUTER JOIN software_computer AS sc ON s.id = sc.software 
			LEFT OUTER JOIN computer AS c ON sc.computer = c.id
			WHERE s.name LIKE '%".$_GET["name"]."%'";
			
		$query=mysqli_query($conn,$select) or die("Database Not Work!");
		if($query->num_rows==0)
			echo ("Software not found");
		else{
			$obj = array();
			$arr = array();
			$computers = array();
			while($record=$query->fetch_assoc()){
				
					
				
				if($record["usageDue"]=="0000-00-00")
					$record["usageDue"]="無";
				else if (!($_SESSION["rank"] > 0)&& strtotime($record["usageDue"]) < strtotime("now"))
					$record["usageDue"]="已過期";
				
					
				if($record["licenseDue"]=="0000-00-00")
					$record["licenseDue"]="無";
				else if (!($_SESSION["rank"] > 0)&& strtotime($record["licenseDue"]) < strtotime("now"))
					$record["licenseDue"]="已過期";
				$record["os"]=json_decode($record["os"]);
				$computerObject = array();
				$computerObject["computer"] = $record["computer"];
				$computerObject["status"] = $record["status"];
				$computerObject["room"] = $record["room"];
				$computerObject["position"] = $record["position"];
				array_push($computers,$computerObject);
				$obj=$record;
			}
			if($computers[0]==null)
				$computers[0]="0";
			$obj["computers"]=$computers;
			unset($obj["computer"]);
			unset($obj["status"]);
			unset($obj["room"]);
			unset($obj["position"]);
			array_push($arr,$obj);
			
			$result["softwares"]=$arr;
			
			echo json_encode($result,JSON_UNESCAPED_UNICODE);
		}
	}
	else if(isset($_GET["update"])&&isset($_GET["software"])&&isset($_GET["computer"])){
		//require_once("auth.php");
		$response=array();
			$obj = (object)$_POST;
			
			$arr = $obj->computers;
			foreach((array)$arr as $ele){
				$ele = (object)$ele;
				if(count($ele->computer)==1&&$ele->computer[0]=="*"){
					$computers = array();
					$select="SELECT id FROM computer";
					$query = mysqli_query($conn,$select);
					while($result = $query->fetch_assoc())
						array_push($computers,$result["id"]);
					$ele->computer=$computers;
				}
				foreach((array)$ele->computer as $coms){
					//foreach((array)$ele->software as $sofs){
						
						$update="INSERT INTO software_computer(computer,software) VALUES('".$coms."','".$obj->id."') ON DUPLICATE KEY UPDATE computer = '".$coms."',software = '".$obj->id."',status = '".$ele->status."'";
						$query = mysqli_query($conn,$update);
						$rec=array();
						$rec["computer"]=$coms;
						$rec["software"]=$obj->id;
						$rec["status"]="ok";
						if(!$query)$rec["status"]="fail";
						array_push($response,$rec);
						
					//}
				}
			}
			$obj = array();
			$obj["status"]="ok";
			$obj["computers"]=$response;
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		//}
		/*else{
			$obj = array();
			$obj["status"]="fail";
			$obj["softwarestatus"]="POST DATA NOT SET";
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}*/
		
	
	}else if (isset($_GET["update"])&&isset($_GET["software"])){
		$data = (object)$_POST;
		if (isset($data->name)){
			$stmt = $conn -> prepare("INSERT INTO software VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name = ?, company = ?,licenseDue = ?, usageDue = ?, user = ?, os = ?, image = ?, description = ?");
			if (isset($data->id))
				$id = $data->id;
			else
				$id = "DEFAULT";
			$name = $data->name;
			$company = $data->company;
			$license = $data->licenseDue;
			$usage = $data->usageDue;
			$user = $data->userid;
			$os = json_encode($data->os);
			$des = $data->description;
			$stmt -> bind_param("sssssssssssssssss",$id,$name,$company,$license,$usage,$user,$os,$image,$des,$name,$company,$license,$usage,$user,$os,$image,$des);
			$stmt -> execute();
			$stmt -> store_result();
		
			$obj = array();
			if ($stmt->affected_rows != -1){
				$obj["status"] = "ok";
				$obj["message"] = "success update ".$name;
			}else if($stmt->affected_rows == 0){
				$obj["status"] = "ok";
				$obj["message"] = $name." is the same";		
			}else{
				$obj["status"] = "fail";
				$obj["message"] = "something wrong";
			}
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}else{
		
			$obj = array();
			$obj["status"] = "fail";
			$obj["message"] = "please specified data";
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
	}
	/*else if(isset($_GET["update"])&&isset($_GET["software"])){
		$return = array();
		$values = array();
		$return["status"]="fail";
		$return["softstatus"]="Empty Name and No Specified Id";	
		$new = true;
		$str="";
		$action="";
		if(isset($_POST["name"])){
			$check="SELECT * FROM software WHERE name = '".$_POST["name"]."'";
			$query = mysqli_query($conn,$check);
			if($query->num_rows!=0){
				$return["status"]="ok";
				$return["softstatus"]="exist software";	
				$new = false;
				
			}
			else{
				$return["status"]="ok";
				$return["softstatus"]="new";	
			}
			$values["name"]=$_POST["name"];
		}
		if(isset($_POST["id"])){
			$check="SELECT * FROM software WHERE id = '".$_POST["id"]."'";
			$query = mysqli_query($conn,$check);
			if($query->num_rows!=0){
				$return["status"]="ok";
				$return["softstatus"]="exist software";	
				$new = false;
				
			}
			else{
				$return["status"]="ok";
				$return["softstatus"]="new software";	
			}
			$values["name"]=$_POST["name"];
		}
		
		if(isset($_POST["company"]))
			$values["name"]=$_POST["name"];
		if(isset($_POST["license"]))
			$values["licenseDue"]=$_POST["license"];
		if(isset($_POST["usage"]))
			$values["usageDue"]=$_POST["usage"];
		if(isset($_POST["userid"])){
			$select = "SELECT * FROM user WHERE id = '".$_POST["userid"]."'";
			$query = mysqli_query($conn,$select);
			if($query){
				if($query->num_rows == 1){
					$values["userid"]=$_POST["userid"];
				}
				else
					$return["softstatus"] = $return["softstatus"].", user not exist";
			}
		}
		
		if(isset($_POST["os"]))
			$values["os"]=$_POST["os"];
		if(isset($_POST["image"]))
			$values["image"]=$_POST["image"];
		if(isset($_POST["description"]))
			$values["description"]=$_POST["description"];
		if($new){
			$action="INSERT INTO software(";
			$tail="VALUES(";
			$count = 0;
			foreach($values as $key=>$val){
				if($count++!=0){
					$action = $action.",";
					$tail = $tail.",";
					
				}
				$action = $action.$key;
				$tail = $tail."'".$val."'";
			}
			$action = $action . ") ". $tail . ") ";
				
		}
		else{
			$action="UPDATE software SET ";
			$count = 0;
			foreach($values as $key=>$val){
				if($count++!=0)$action = $action.",";
				$action = $action." ".$key." = '".$val."'";
			}
			if(isset($_POST["id"]))
				$action = $action." WHERE id = '".$_POST["id"]."'";
			else if(isset($_POST["name"]))
				$action = $action." WHERE name = '".$_POST["name"]."'";
			else
				$action = "";
		}
		$query = mysqli_query($conn,$action);
		if(!$query) {
			$return["status"]="fail";
			$return["softstatus"]="Database Error";
		}
		echo json_encode($return,JSON_UNESCAPED_UNICODE);
	}*/
	else{
		header("HTTP/1.0 404 Not Found");
		return;
	}
	/*-------------Auth Function-------------*/
	//require("auth.php");

?>
