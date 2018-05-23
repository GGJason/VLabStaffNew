<?php
	require("config.php");
	require("flight/Flight.php");

	Flight::route('GET /', function(){
		if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
   			header('Location: ./publicIndex.html', true, 303);
		}else{
			if(!(md5($_SESSION["username"])==$_SESSION["auth"])||$_SESSION["rank"]<0){
	   			header('Location: ./Dashboard.html', true, 303);
			}
			else{
		   		header('Location: ./Dashboard.html', true, 303);
			}
		}
		exit();
	});
	
	Flight::route('GET /index.php', function(){
		if ((!isset($_SESSION["auth"]))||$_SESSION["auth"]==""){
   			header('Location: ./publicIndex.html', true, 303);
		}else{
			if(!(md5($_SESSION["username"])==$_SESSION["auth"])||$_SESSION["rank"]<0){
	   			header('Location: ./Dashboard.html', true, 303);
			}
			else{
		   		header('Location: ./Dashboard.html', true, 303);
			}
		}
		exit();
	});
	
	Flight::route('GET /test', function(){
		echo "Test ";
		//exit();
	});
	
	Flight::start();



?>
