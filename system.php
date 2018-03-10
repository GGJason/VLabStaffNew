<?php

if(isset($_GET["files"])){
	function showdir ($dir,$level){
		if($dir==".")echo "<h".$level.">".iconv("BIG5", "UTF-8",basename(getcwd()))."</h".$level.">";
		else echo "<h".$level.">".iconv("BIG5", "UTF-8",basename($dir))."</h".$level.">";
		echo "<ul>";
		$arr = scandir($dir);
		foreach($arr as $sub){
			if($sub[0]!='.'){
				if(is_dir($dir."/".$sub))
					showdir($dir."/".$sub,$level+1);
				else{
					$showdir = iconv("BIG5", "UTF-8",$dir);
					$showsub = iconv("BIG5", "UTF-8",$sub);	
					if(substr($showsub,-3,3)!="php")
						echo "<li> <a target='_blank' href = \"".$showdir."/".$showsub."\">".$showsub."</a> </li>";
				}
			}
		}
		echo "</ul>";
	}
	function search ($dir,$search){
		echo "<ul>";
		$arr = scandir($dir);
		foreach($arr as $sub){
			if($sub[0]!='.'){
				if(is_dir($dir."/".$sub))
					search($dir."/".$sub,$search);
				else{
					$showdir = iconv("BIG5", "UTF-8",$dir);
					$showsub = iconv("BIG5", "UTF-8",$sub);	
					if(strpos($showsub, $search) !== false)
						echo "<li> <a href = \"".$showdir."/".$showsub."\">".$showsub."</a> </li>";
				}
			}
		}
		echo "</ul><br>";
	}
	require_once("config.php");
	require_once("auth.php");
	showdir("./",1);
}
else if(isset($_GET["info"]))
	phpinfo();
?>
