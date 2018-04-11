<?php
	require_once("config.php");
	require_once("function.php");
	header("Content-Type: application/json");
	/*** 更新人數資料 ***/
	if (isset($_POST["count"])&&isset($_POST["date"])){
		if($_SESSION["auth"]=="") throw ("403");
		require_once("auth.php");
		WorkRecord("點人數",$_POST["date"],$conn);
		$check = "SELECT count FROM count WHERE date = '".$_POST["date"]."'";
		$query = mysqli_query($conn,$check);
		$action = "";
		if($query){
			if( $query->num_rows != 0)
				$action = "UPDATE count SET count = '".$_POST["count"]."' WHERE date = '".$_POST["date"]."'";
			else
				$action = "INSERT INTO count (date,count) VALUES('".$_POST["date"]."', '".$_POST["count"]."')";
			$query = mysqli_query($conn,$action);
			if($query)
				echo "ok";
			else
				echo "Update Error";
		}
		else{
			echo "Database Error";
		}
	}
	else if(isset($_GET["reset"])){
		if(isset($_POST["date"])){
			require_once("auth.php");
			if($_POST["date"]!="*"&&$_POST["date"]!="%"){
				$delete = "DELETE FROM count WHERE date = '".$_POST["date"]."'";
			$query = mysqli_query($conn,$delete);
			if($query)
				echo "ok";
			else
				echo "Delete Error";
			}
		}
	}
			/*** 查詢人數資料 ***/	
	else if (isset($_GET["date"]))
	{
//		echo $_GET["date"];
		$getCount = "SELECT count FROM count WHERE date = '".$_GET["date"]."'";
		$query = mysqli_query($conn,$getCount);
		if($query){
			if( $query->num_rows != 0)
				echo mysqli_fetch_array($query)[0];
			else
				echo "No Record";
		}
		else{
			echo "Database Error";
		}
	}
	else if( isset($_GET["show"]) )
	{
		if(  isset($_GET["start"]) &&  isset($_GET["end"]) )
		{
			echo json_encode(getCount($_GET["start"],$_GET["end"],$conn));
		}
		else if( isset($_GET["start"]) )
		{
			echo json_encode(getCount($_GET["start"],date("Y-m-d")),$conn);
		}
		else if( isset($_GET["end"]) )
		{
			echo json_encode(getCount("2001-01-01",$_GET["end"],$conn));
		}
		else
		{
			echo json_encode(getCount("2001-01-01",date("Y-m-d"),$conn));
		}
	}
	else if(isset($_GET["check"])){
		$check = "SELECT MAX(date) AS date FROM count ";
		$query = mysqli_query($conn,$check);
		$record = $query->fetch_assoc();
		echo json_encode($record);
	}
	
	if(isset($_GET["csv"])){
		header("content-type: text/csv");
		header("Content-Disposition: inline; filename='".date("Y-m-d_H:i:s")."_人數統計.csv'");
		$obj;
		if(  isset($_GET["start"]) &&  isset($_GET["end"]) )
		{
			$obj = getCount($_GET["start"],$_GET["end"],$conn);
		}
		else if( isset($_GET["start"]) )
		{
			$obj = getCount($_GET["start"],date("Y-m-d"),$conn);
		}
		else if( isset($_GET["end"]) )
		{
			$obj = getCount("2001-01-01",$_GET["end"],$conn);
		}
		else
		{
			$obj = getCount("2001-01-01",date("Y-m-d"),$conn);
		}
		
		if(isset($_GET["table"])){
			$output = array();
			foreach ($obj as $ele){
				$date = explode("-",$ele["date"]);
				if(isset($_GET["year"]))
					$output[intval($date[0])] = $ele["count"];
				else if(isset($_GET["month"]))
					$output[intval($date[0])][intval($date[1])] = $ele["count"];
				else if(isset($_GET["day"]))
					$output[$date[0]."-".$date[1]][intval($date[2])] = $ele["count"];
				else
					$output[$ele["date"]] = $ele["count"];
			}
			if(isset($_GET["month"])){
				for($j = 0 ; $j <= 12; $j++)
					echo $j.",";
				echo "\n";
				
				for($i = 2013 ; $i <= date("Y"); $i++){
				
					echo $i.",";
					for($j = 1 ; $j <= 12; $j++)
						echo @@$output[$i][$j].",";
					echo "\n";
				}
			}
			else if(isset($_GET["day"]))
			{
				for($j = 0 ; $j <= 31; $j++)
					echo $j.",";
				echo "\n";
				foreach ($output as $month=>$dates){
					echo $month.",";
					for($j = 1; $j <= 31; $j++)
						echo @@$dates[$j].",";
					echo "\n";
				}
			}
			else
				foreach ($output as $year=>$count)
					echo @$year.",".$count."\n";
		}
		else{
			foreach ($obj as $ele){
				echo $ele["date"].",".$ele["count"]."\n";
			}
		}
	}
	function getCount($start,$end,$conn){
		/*--- 資料庫指令設定與執行 ---*/
		$group = "";
		if(isset($_GET["year"]))$group=" GROUP BY YEAR(date)";
		else if(isset($_GET["month"]))$group = " GROUP BY YEAR(date),MONTH(date)";
		if(isset($_GET["day"]))$group = " GROUP BY YEAR(date),DAY(date)";
		$group = $group." ORDER BY date";
		$count_action = "SELECT date,SUM(count) AS count FROM count WHERE (date BETWEEN '".$start."' AND '".$end."')".$group;
		if(isset($_GET["day"]))$count_action = "SELECT date,count FROM count WHERE (date BETWEEN '".$start."' AND '".$end."')";
		$query = mysqli_query($conn,$count_action);
		/*--- 資料庫取得資料後進行處理，並輸出成json形式 ---*/
		 
		$obj = array();
		while($record = $query->fetch_assoc()){
			if(isset($_GET["year"])){
			    $record["date"] = date("Y",strtotime($record["date"]));
			}
			else if(isset($_GET["month"])){
			    $record["date"] = date("Y-m",strtotime($record["date"]));
			}
			array_push($obj,$record);
		}
		return $obj;
	}
?>
