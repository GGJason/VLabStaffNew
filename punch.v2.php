<?php
	require_once("config.php");
	require_once("auth.php");
	require_once("function.php");
	
	function check($conn){
		require_once("config.php");
		$check = "SELECT punchid FROM staff WHERE username ='".$_SESSION["username"]."'";
		$query = mysqli_query($conn,$check);
		$result = $query -> fetch_assoc();
		return $result["punchid"];
	}
	if(isset($_GET["in"])){
		if(isset($_SESSION["punch"])&&($_SESSION["punch"]!="")&&($_SESSION["punch"]!="0")||check($conn)){
			echo ("<script>alert('你已經在上班中摟');window.location='index.html'</script>");
			if(isset($_GET["redirect"]))
				header("Location: ".$_GET["redirect"]);
		}
		else{			
			$time = date('Y-m-d H:i:s', time());
			$insert = "INSERT INTO punch(username, punchin, description) VALUES ('".$_SESSION["username"]."','".$time."','{\"workitem\":[]}')";
			$query=mysqli_query($conn,$insert);
			$select ="SELECT id FROM punch WHERE punchin = '".$time."'";
			$query =mysqli_query($conn,$select);
			$staff = $query->fetch_array();
			$_SESSION["punch"]=$staff["id"];
			$_SESSION["punchin"]=$time;
			$query =mysqli_query($conn,"UPDATE staff SET punchid = ".$_SESSION["punch"]." WHERE username = '".$_SESSION["username"]."'");
			echo ($_SESSION["name"]." 打卡上班！");
			if(isset($_GET["redirect"])){
				echo $_GET["redirect"];
				header("Location: ".$_GET["redirect"]);
			
			}	
		}
	}
	else if(isset($_GET["out"])){
		$data = (object)$_POST;
		$type = 1;
		if(isset($data->type)){
			$type=$data->type;
			if($type < 1) $type = 1;
		}
		if (isset( $data->workitem)){
			$description = json_encode($data->workitem,JSON_UNESCAPED_UNICODE);
		}
		if(isset($_SESSION["punch"])&&($_SESSION["punch"]=="")&&!check($conn)){
			echo ("<script>alert('你已經下班摟');window.location='index.html';</script>");
		}
		else{
			if($_SESSION["punch"]!=0){
				echo ($_SESSION["name"]." 打卡下班！");
		
				$time = date('Y-m-d H:i:s', time());
				$query =mysqli_query($conn,"SELECT * FROM punch WHERE id = '".$_SESSION["punch"]."'");
				$select = $query->fetch_array();
			}
			if($select["punchout"]==""){
				mysqli_query($conn,"UPDATE punch SET punchout = '".$time."',description='".$description."',type='".$type."' WHERE id = '".$_SESSION["punch"]."'");
				mysqli_query($conn,"UPDATE staff SET punchid = '0' WHERE username = '".$_SESSION["username"]."'");
			}
			else
				echo("<script>alert('你已經下班摟');window.location='index.html';</script>");
		}
		$_SESSION["punch"]="";
		$_SESSION["punchin"]="";
	
		if(isset($_GET["redirect"]))
			header("Location: ".$_GET["redirect"]);
	}
	else if(isset($_GET["check"])){
	
		if(!check($conn))
			echo "{\"status\":\"ok\",\"workstatus\":\"Not Working\"}";
		else
			echo "{\"status\":\"ok\",\"workstatus\":\"Working\",\"id\":\"".check($conn)."\"}";
	}
	else if(isset($_GET["content"])){
		if(!check($conn))
			echo "{\"status\":\"Not Working\"}";
		else
		{
			$check = "SELECT punch.description,punch.id FROM staff INNER JOIN punch ON staff.punchid = punch.id WHERE staff.username = '".$_SESSION["username"]."'";
			$query = mysqli_query($conn,$check);
			$result = $query -> fetch_assoc();
			echo "{\"status\":\"Working\",\"description\":\"".$result["description"]."\"}";
			
		}
	}
	else if(isset($_GET["csv"])){
		$return = array();
		$return["status"]="fail";
		if(isset($_GET["month"])){
			header("Content-Type:text/csv");
			header("Content-Disposition: inline; filename='".date("Y-m-d_H:i:s")."_".$_SESSION["name"].$_GET["month"]."月_工時紀錄.csv'");
			$start = date("Y-m-d", strtotime($_GET["month"]));
			$end = date("Y-m-d", strtotime("+1 month", strtotime($_GET["month"])));
			$select = "SELECT * FROM punch WHERE (username ='".$_SESSION["username"]."' AND punchout > '".$start."' AND punchin<'".$end."') ORDER BY punchin";
			$query=mysqli_query($conn,$select);
			
			echo "開始,結束,工作內容\n";
			while($result=$query->fetch_assoc()){
				echo $result["punchin"].",".$result["punchout"].",".$result["description"]."\n";
			}
		}
		else{
			$return["message"]="month not specified";
		}
			
		//echo json_encode($return,JSON_UNESCAPED_UNICODE);
	}
	else if(isset($_GET["update"])){
		$data = (object)$_POST;
		if(isset($_GET["workitem"])){
			$select = "SELECT punchid FROM staff WHERE username = '" . $_SESSION["username"] . "'";
			if(isset($_GET["dir"]))
				header("Location: ".$_GET["dir"]);
		}
		else if(isset($data->id)){
			$count = 0;
			$update = "UPDATE punch SET ";
			if(isset($data->start)){
				$count++;
				$update = $update."punchin='".$data->start."'";
			}
			
			if(isset($data->end)){
				$count++;
				if($count > 1) $update = $update.",";
				$update = $update."punchout='".$data->end."'";
				if($data->id==$_SESSION["punch"]){
					$_SESSION["punch"] = 0;
					$clean = "UPDATE staff SET punchid = 0 WHERE username = '".$_SESSION["username"]."'";
					$query = mysqli_query($conn,$clean);
				}
					
			}
			if(isset($data->content)){
				$count++;
				if($count > 1) $update = $update.",";
				$update = $update."description='".$data->content."'";
			}
			if(isset($data->type)){
				$count++;
				if($count > 1) $update = $update.",";
				$update = $update."type='".$data->type."'";
			}
			$update = $update." WHERE id = '".$data->id."'";
			$query = mysqli_query($conn,$update);
			if($query)
				echo "{status:\"ok\"}";
			else
				echo "{status:\"fail\"}";
				//echo $update;
		}
		else{
			echo"{status:\"fail\",type:\"No id\"}";
		}
	}
	else if(isset($_GET["record"])){
		if(isset($_POST["type"])&&isset($_POST["content"])){
			echo WorkRecord($_POST["type"],$_POST["content"],$conn);
		}
		
	}
	else if(isset($_GET["list"])){
		if( isset($_GET["type"])){
			$select = "SELECT * FROM punchtype WHERE 1";
			$query = mysqli_query($conn,$select);
			$str = "{types:[";
			$count = 0;
			while($result = $query->fetch_assoc()){
				if($count++ != 0) $str = $str . ",";
				$str = $str . "{id:\"".$result["id"]."\",name:\"".$result["name"]."\"}";
			}
			$str = $str."]}";
			echo $str;
		}
		else{
			$start= "2016-01-01_00:00:00";
			$end = date("Y-m-d_H:i:s");
			if(isset($_GET["start"]))
				$start = $_POST["start"];
			if(isset($_GET["end"]))
				$start = $_POST["end"];
			if($_SESSION["rank"]>=50){
				$username = "*";
			}
			else
				$username = $_SESSION["username"];
			$select = "SELECT punch.id,punch.username AS staff,punch.punchin AS start ,punch.punchout AS end,punch.description AS content,punchtype.name AS 'type' FROM punch INNER JOIN punchtype ON punch.type = punchtype.id WHERE (punch.username = '".$username."' OR ( punch.punchin BETWEEN '". $start ."' AND '" . $end ."') AND ( punch.punchout BETWEEN '". $start ."' AND '" . $end ."')) GROUP BY punch.id";
			//echo $select;
			$query = mysqli_query($conn,$select);
			$count = 0;
			$events=array();
			while($result = $query -> fetch_assoc()){
				$result["content"] = json_decode($result["content"]);
				array_push($events,$result);
			}
			$obj = array();
			$arr = array();
			$arr["event"]=$events;
			$obj["eventSources"]=$arr;
			
			echo json_encode($obj,JSON_UNESCAPED_UNICODE);;
		}
		
	}
?>
