
  var $menu = $('#menu');

  $menu.append('<h2>Menu</h2>');
  menu = "<ul> " +
    " <li><a href='index.html'>Home</a></li> " +
    " <li><a href='count.html'>人數統計</a></li> " +
    " <li><a href='user.php'>使用者資料更新</a></li> " +
    " <li><a href='logout.php'>登出</a></li> " +
    "</ul> ";
  menu_401 = "<ul> " +
    " <li><a href='index.html'>Home</a></li> " +
    " <li>其他的是秘密呦～</li> " +
    "</ul> ";
  
  var auth = {};
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4){
        if (this.status == 401) {
          $menu.append( menu_401 );
        }
        if (this.status == 200) {
          authJSON = JSON.parse(this.responseText);
          if ( authJSON.rank > 0 )
            $menu.append( menu );
        }
      }
      
  };
  xmlhttp.open("GET", "http://vlabstaff.caece.net/auth.php?info", true);
  xmlhttp.send();
