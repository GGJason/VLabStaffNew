<?php
	require_once("config.php");
	$conn = mysqli_connect($db_host, $db_user, $db_passwd,$db_name) or die('Error with MySQL connection');
	$username = $_POST["username"];
	$name = $_POST["name"];
	$password = $_POST["password"];
	$cellphone = $_POST["phone"];
	$email = $_POST["email"];
	
	$check = "SELECT * FROM staff WHERE username ='".$username."'";
	$insert = "UPDATE staff SET name='".$name."',cellphone='".$cellphone."',email='".$email."' WHERE username='".$username."'";
	
	$conn = mysqli_connect($db_host, $db_user, $db_passwd,$db_name) or die('Error with MySQL connection');
	if (mysqli_query($conn,$check)->num_rows != 0){
		mysqli_query($conn,$insert);
		echo "「".$name."」資料更新成功。<a href='index.html'>回首頁</a>";
	}
	else{
		echo "使用者不存在";
	}
?>
