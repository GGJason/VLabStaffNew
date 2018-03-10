<?php
	require_once("config.php");
	require_once("function.php");
	routine($conn);
	
	if(isset($_GET["info"])){
		$arr = array();
		$arr["status"]="fail"; 
		if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
			
			header("HTTP/1.1 401 Unauthorized");
			$arr["status"]="fail";
		}
		else{
			if(!(md5($_SESSION["username"])==$_SESSION["auth"])||$_SESSION["rank"]<0){
				header("HTTP/1.1 401 Unauthorized");
				$arr["status"]="fail";
			}
			else{
				$arr["status"]="ok";
				$arr["username"]=$_SESSION["username"];
				$arr["name"]=$_SESSION["name"];
				$arr["rank"]=$_SESSION["rank"];
				$arr["rankname"]=$_SESSION["rankname"];
				$arr["profile"]=$_SESSION["profile"];
			}
		}
		echo json_encode($arr,JSON_UNESCAPED_UNICODE);
	}
	else if(isset($_GET["status"])){
		if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
			echo "<a href='login.html'>請登入</a>";
		}
		else{
			if(!(md5($_SESSION["username"])==$_SESSION["auth"])||$_SESSION["rank"]<0){
				echo "<a href='login.html'>請登入</a>";
			}
			else{
				echo $_SESSION["name"]."您好！你的等級是".$_SESSION["rankname"];
				echo "<img src='".$_SESSION["profile"]."'/>";
			}
		}
	}
	else{
/*------------------------License Fail----------------------------*/
		if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
			$_SESSION['redirect_url'] = $_SERVER['PHP_SELF'];
			//header("Location: login.html");
			$obj = array("status"=>"fail","authstatus"=>"not auth");
			header("HTTP/1.1 401 Unauthorized");
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);
			exit;
		}
		else{
			if(!(md5($_SESSION["username"])==$_SESSION["auth"])||$_SESSION["rank"]<0){
				header("HTTP/1.1 401 Unauthorized");
				
				$obj = array("status"=>"fail","authstatus"=>"Error user!");
				header("HTTP/1.1 401 Unauthorized");
				echo json_encode($obj,JSON_UNESCAPED_UNICODE);
				$_SESSION["auth"]="";
			}
			else{

				//$obj = array("status"=>"ok","authstatus"=>"ok");
				//echo json_encode($obj,JSON_UNESCAPED_UNICODE);
			}
		}
	}
?>
