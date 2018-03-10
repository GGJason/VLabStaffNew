<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<h1>V.Lab 管理系統帳號申請</h1>
<?php
	require_once("config.php");
	$username = $_POST["username"];
	
	$name = $_POST["name"];
	mb_convert_encoding($name, "UTF-8", "auto"); 
	
	$password = $_POST["password"];
	$cellphone = $_POST["phone"];
	$email = $_POST["email"];
	
	$check = "SELECT * FROM staff WHERE username ='".$username."'";
	$insert = "INSERT staff(username,name,password,cellphone,email,rank) VALUE('".$username."','".$name."','".$password."','".$cellphone."','".$email."','-1')";
	
	if (mysqli_query($conn,$check)->num_rows == 0){
		mysqli_query($conn,$insert);
		echo "「".$name."」註冊成功，請靜候身份確認。";
	}
	else{
		echo "使用者已經存在";
	}
?>
</body>
</html>
