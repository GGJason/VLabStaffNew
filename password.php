
<?php
	require("config.php");
	require("function.php");
	if(isset($_GET["reset"])&&isset($_POST["email"])){
		$select="SELECT rank FROM staff WHERE email ='".$_POST["email"]."'";
		$query = mysqli_query($conn,$select);
		if($query){
			if($query->num_rows==1){
				#echo "200 ok";
				$guid = md5(date(DATE_RFC2822));
				#echo $guid;
				$update = "UPDATE staff SET password = '".$guid."' WHERE email ='".$_POST["email"]."'";
				#echo $update;
				echo "Please check your email to reset your password";
				$query = mysqli_query($conn,$update);
				if($query){
					mail($_POST["email"],"V.Lab管理系統密碼重設","請點選下列網址進行修改 http://vlabstaff.caece.net/password.php?auth=".$guid,"FROM: V.Lab工讀生<vlabstaff@caece.net>");}
			}
			else{
				echo "Email Error";
			}
		}
		else{
			echo "DB Error";
		}
	}
	else if(isset($_POST["password"])&&isset($_POST["auth"])){
		$update = "UPDATE staff SET password = '".$_POST["password"]."' WHERE password ='".$_POST["auth"]."'";
		$query = mysqli_query($conn,$update);
		if($query){
			echo "<script>alert('重設完畢，請重新登入'); window.location='./index.html';</script>";
		}
		else{
			echo "<script>alert('重設未成功，請重新測試'); window.location='./password.php?reset';</script>";
		}
	}
	
	else if(isset($_GET["auth"])){
		$select="SELECT rank FROM staff WHERE password ='".$_GET["auth"]."'";
		$query = mysqli_query($conn,$select);
		if($query){
			if($query->num_rows==1){
				echo "<script src='./js/md5.js'></script>
<script src='./js/main.js'></script><form action='./password.php' method='POST' onsubmit='pwd_handler(this);'>設定密碼<input type='password' name='password' id='password'></input><!--再次確認<input type='password'></input>--><input type='hidden' name='auth' id='auth' value='".$_GET["auth"]."'></input><input type='submit' value='送出'></input></form>";
				
			}
			else{
				echo "Not Auth";
			}
		}
		else{
			echo "DB Error";
		}
		
	}
	
	else echo("Email Not Provide");
?>
