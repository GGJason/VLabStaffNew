<?php
	require_once("config.php");
	require_once("auth.php");
	require_once("function.php");
	function SystemCheck($conn){
		$check = "SELECT MAX(date) AS date FROM count ";
		$query = mysqli_query($conn,$check);
		$record = $query->fetch_assoc();
		$arr = array();
		$obj = array();
		//if((time()-(60*60*24*10)) > strtotime($record["date"])){
			$obj["time"]=date("Y-m-d h:i:s");
			$obj["sender"]="System";
			$obj["id"]="-100";
			$obj["note"]="人數統計已累積到".$record["date"];
		$arr[] = $obj;
		//if((time()-(60*60*24*10)) > strtotime($record["date"])){
			$obj["time"]=date("Y-m-d h:i:s");
			$obj["sender"]="System";
			$obj["id"]="-101";
			$obj["note"]="請記得繳交".date("Y年m月",strtotime("-1 month"))."時數表";
		$arr[] = $obj;
		return $arr;
		//}
		//else
		//	return "";
	}
	if(isset($_GET["send"])){
		if(isset($_POST["note"])){
			$message = $_POST["note"];
			$add_note= "INSERT INTO note (note,sender) VALUES ('".$message."','".$_SESSION["username"]."')";
			$query = mysqli_query($conn,$add_note);
			$maxCommand = "SELECT MAX(id) as max FROM note";
			$query = mysqli_query($conn,$maxCommand);
			$result = $query->fetch_assoc();
			$max = $result["max"];
			$receiver = [];
			if(isset($_POST["receiver"]))
				$receiver = json_decode($_POST["receiver"]);
			else{
				$getall = "SELECT username FROM staff Where rank > 0";
				$query = mysqli_query($conn,$getall);
				while($result = $query->fetch_assoc())
					array_push($receiver,$result["username"]);
			}
			foreach ($receiver as $ele){
				$add_note_staff= "INSERT INTO note_staff (receiver,id,isRead) VALUES ('".$ele."','".$max."','0')";
				$query = mysqli_query($conn,$add_note_staff);
			}
			echo "200 ok";
		}
	}
	if(isset($_GET["check"])){
		$obj = array();
		$check = "SELECT note.timestamp,note.sender,note.id,note FROM note INNER JOIN note_staff ON note.id = note_staff.id WHERE ( receiver = '".$_SESSION["username"]."' AND isRead < 1)"; 
		$query = mysqli_query($conn,$check);
		if($query->num_rows > 0){
			$arr = array();
			$str = "[";
			$count=0;
			while($result = $query->fetch_assoc()){
				$note = array();
				if($count++!=0)$str=$str.",";
				$note["time"] = $result["timestamp"];
				$note["sender"] = $result["sender"];
				$note["id"] = $result["id"];
				$note["note"] = $result["note"];
				array_push($arr,$note);
			}
			foreach(SystemCheck($conn) as $alert){
				array_push($arr,$alert);
			}
			$obj["notes"] = $arr;
			$obj["status"] = "Ok";
		}
		else{
			
			if(SystemCheck($conn)!="")
			{
				$arr = array();	
				foreach(SystemCheck($conn) as $alert){
					array_push($arr,$alert);
				}
				$obj["notes"] = $arr;
				$obj["status"] = "Ok";
			}
			else
				$obj["status"] = "Fail";
		}
		echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	}
	if(isset($_GET["read"])){
		if(isset($_POST["id"])&&isset($_SESSION["username"])){
			$check = "SELECT isRead FROM note_staff WHERE ( id = '" . $_POST["id"] ."' AND receiver = '" . $_SESSION["username"] . "')";
			$query = mysqli_query($conn, $check);
			$result = $query->fetch_assoc();
			if($result["isRead"] == 0){
				$update = "UPDATE note_staff SET isRead = '1' WHERE ( id = '" . $_POST["id"] ."' AND receiver = '" . $_SESSION["username"] . "')";
			$query = mysqli_query($conn, $update);
				echo ("200 ok");
			}
		}
		else{
			header('HTTP/1.1 401 Unauthorized');
		}
	}
?>
