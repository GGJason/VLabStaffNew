<?php
	require_once("config.php");
	require_once("auth.php");
//回送給一般使用者的資料
	if(isset($_GET["data"])){
		$get = "SELECT username,name,rank,cellphone,email,profile FROM staff WHERE username='".$_SESSION["username"]."'";
		$query =mysqli_query($conn,$get);
		$staff=$query->fetch_assoc();
		echo json_encode($staff,JSON_UNESCAPED_UNICODE);
	}
//回送給高級使用者的資料
	else if(isset($_GET["super"])){
		if(isset($_SESSION["rank"]) && $_SESSION["rank"]>= 40){
			$select="SELECT * FROM staff,rank WHERE staff.rank = rank.id";
			$query =mysqli_query($conn,$select);
			$str = "[";
			while($staff=$query->fetch_assoc())
				$str=$str.json_encode($staff,JSON_UNESCAPED_UNICODE).",";
			$str = $str."]";
			echo $str;
		}
	}
	else if(isset($_GET["update"])){
		if(!isset($_POST["username"])){
			header("HTTP/1.1 404 Not Found");
			exit;	
		}			
		if(!isset($_SESSION["auth"])||md5($_POST["username"])!=$_SESSION["auth"]){ 
			header("HTTP/1.1 401 Unauthorized");
			exit;	
		}
		$update = "[";
		$check = "SELECT * FROM staff WHERE username ='".$_POST["username"]."'";
		$insert = "UPDATE staff SET ";
		if(isset($_POST["name"])){
			$insert = $insert . "name = \"" . $_POST["name"] . "\", ";
			$update = $update . '"name",';
		}
		if(isset($_POST["password"])){
			$insert = $insert . "password = \"" . $_POST["password"] . "\", ";
			$update = $update . '"password",';
		}
		if(isset($_POST["cellphone"])){
			$insert = $insert . "cellphone = \"" . $_POST["cellphone"] . "\", ";
			$update = $update . '"cellphone",';
		}
		if(isset($_POST["email"])){
			$insert = $insert . "email = \"" . $_POST["email"] . "\", ";
			$update = $update . '"email",';
		}	
		$update = $update . "]";
		if (mysqli_query($conn,$check)->num_rows != 0){

			$insert = substr($insert,0,strlen($insert)-2) . " WHERE username = '" . $_SESSION["username"] . "'"; 
//			echo $insert;
			if (mysqli_query($conn,$insert)){
				if(isset($_POST["name"]))
					$_SESSION["name"]=$_POST["name"];
				$_SESSION["auth"]=md5($_POST["username"]);
				echo $update;
			}
			else
				echo "[]";
		}
		else{
			echo "[]";
		}
	}
	else if(isset($_GET["list"])){
		if(isset($_SESSION["rank"])&&$_SESSION["rank"]>0){
			$select="SELECT username,name FROM staff";
			$query = mysqli_query($conn,$select);
			$arr = array();
			while($result = $query->fetch_assoc())
				array_push($arr,$result);
			$obj = array();
			$obj["staff"] = $arr;
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
		}
			
	}
?>

