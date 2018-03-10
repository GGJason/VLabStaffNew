<?php
	require_once("config.php");
	$obj = array();
	$obj["status"]="fail";
	if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
		if (isset($_POST["user"])&&isset($_POST["password"])){
			$user=$_POST["user"];
			$auth=md5($_POST["user"]);
			$password=$_POST["password"];
			if($user==""||$password=="")
				exit();
			$select = "SELECT staff.*,rank.rankname FROM staff INNER JOIN rank ON staff.rank = rank.id WHERE username = '".$user."'";
			$query = mysqli_query($conn,$select);
//			print_r ($query);
			$staff = $query->fetch_array();
//			print_r ($staff);
			if($password==$staff["password"]){
				$obj["status"]="ok";
				
				$_SESSION["username"]=$user;
				$_SESSION["name"]=$staff["name"];
				$_SESSION["rank"]=$staff["rank"];
				$_SESSION["rankname"]=$staff["rankname"];
				$_SESSION["profile"]=$staff["profile"];
				$_SESSION["punch"]=$staff["punchid"];
				if($_SESSION["profile"]==null)
					$_SESSION["profile"]="./images/dinner.png";
				else
					$_SESSION["profile"]="./images/".$_SESSION["profile"];
				$_SESSION["auth"]=md5($user);
				if(isset($_GET["redirect"]))
	   				header('Location: '.$_GET["redirect"], true, 303);
			}
			else{
				$obj["status"]="fail";
				$obj["loginstatus"]="Username or password error";
			}
		}
		else{
				$obj["status"]="fail";
				$obj["loginstatus"]="No username or password";
			}
	}
	else{
		if(!(md5($_SESSION["username"])==$_SESSION["auth"])){
				$obj["status"]="fail";
				$obj["loginstatus"]="Error user";
			
			$_SESSION["auth"]="";
		}
		else{
			$obj["status"]="ok";
			if(isset($_GET["redirect"]))	
   				header('Location: '.$_GET["redirect"], true, 303);

		}
	}
	echo json_encode($obj,JSON_UNESCAPED_UNICODE);
?>
