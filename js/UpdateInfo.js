var data_url = './user.php?super';
var loginstate = './auth.php?info';
var actionurl = './user.php?update';
//var actionurl = '#';
var userstateurl = './user.php?data';
var inputItem = [
    {class:'field',type:'text',name:'username',id:'username',placeholder:'Account',readonly:'readonly'},
    {class:'field',type:'password',name:'password',id:'password',placeholder:'Password'},
    {class:'field',type:'password',name:'checkpassword',id:'checkpassword',placeholder:'CheckPassword'},
    {class:'field half first',type:'text',name:'name',id:'name',placeholder:'Name'},
    {class:'field half',type:'tel',name:'cellphone',id:'cellphone',placeholder:'Cellphone'},
    {class:'field',type:'email',name:'email',id:'email',placeholder:'Email'}
];
var submit = '<ul class="actions"><li><input value = "提交" type = "button" class="special" onclick = "submitNewInfo(this)"/></li></ul>';
var inputHtml = '<h2>在這裡更改你的個人資料</h2>';
var currentuser;

xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4){
        if (this.status == 401) {
            window.location = './index.html';
        }
        if (this.status == 200) {
            
            
            $.get(userstateurl)
                .done(function(user){
                    currentuser = $.parseJSON(user);
                    document.getElementById('enterinfo').innerHTML = generateEnterInfoHtml(inputHtml, submit, inputItem, actionurl, currentuser);
                })
            .fail();

            $.get(data_url)
                .done(function(data){
                    data = data.substring(0,data.length-4);
                    data += ']';
                    data = $.parseJSON(data);
                    var title = ['rank', 'name', 'email', 'cellphone' ];
                    var userInfoHtml = '';
                    data.sort(function(a, b){return b.rank - a.rank});
                    document.getElementById('userStatement').innerHTML = generateUserInfoHtml(userInfoHtml,title,data);
                })
                .fail();
        }
  }
  else{}
};
xmlhttp.open('GET', './auth.php?info', true);
xmlhttp.send();
  


function submitNewInfo(form){
    if($('#password').val() == $('#checkpassword').val()){
        if(confirm('確定要更改嗎？\n會跟瑞凡一樣回不去喔')){
//            console.log('submit');
            var newInfo = {};
            var postItem = ['username','password','name','cellphone','email'];
        //  newInfo['username'] = currentuser.username;
//            console.log($("#password").val());
            if ($("#password").val() != ''){
//                console.log('enter');
                $('#password').val(md5($('#password').val()));
                $('#checkpassword').val(md5($('#checkpassword').val()));
            }
            for(var i=0; i<postItem.length; i++){
                if($('#'+inputItem[i].id).val() != '' && inputItem[i].id != 'checkpassword'){
                    newInfo[postItem[i]] = $('#'+inputItem[i].id).val();  
                }
            }
//            console.log(newInfo);

            $.post(actionurl,newInfo,function(msg){
                  alert('瑞凡，資料已經更新，我們回不去了。');
                  window.location = 'logout.php';
            });
        }
        else{} 
    }
    else{
      alert('兩次密碼輸入不一致');
      $('#password').val('');
      $('#checkpassword').val('');
    }

  
}

function generateEnterInfoHtml(inputHtml, submit, inputItem, actionurl, user){
  
    
  
        inputHtml += '<form onsubmit = "submitNewInfo(this)">';
        for(var i=0; i<inputItem.length; i++){
            inputHtml += '<div class="' + inputItem[i].class + '">';
            inputHtml += '<input type="' + inputItem[i].type + '" name="' + inputItem[i].name+ '" id="' + inputItem[i].id + '" placeholder ="' + inputItem[i].placeholder + '"';
            if(user[inputItem[i].id]){
                inputHtml += 'value = "' + user[inputItem[i].id]+ '" ';   
            }
            if(inputItem[i].readonly){
                inputHtml += 'readonly = "' + inputItem[i].readonly+ '" ';   
            }
            inputHtml += '/>';
            inputHtml += '</div>';
        }
        inputHtml += submit;
        inputHtml += '</form>';

        return inputHtml;
}




function generateUserInfoHtml(userInfoHtml,title,data){
    userInfoHtml += '<div class="table-wrapper"><table>';
    userInfoHtml += '<thead><tr>';
    for(var i=0; i<title.length; i++){
        userInfoHtml += '<th>' + title[i] + '</th>';
    }
    userInfoHtml += '</tr></thead>';
    userInfoHtml += '<tbody>';
    for(var i=0; i<data.length; i++){
        userInfoHtml += '<tr>';
        userInfoHtml += '<td>< '+data[i].rankname+' > </td>'; 
        userInfoHtml += '<td>'+data[i].name+'</td>';
        userInfoHtml += '<td>'+data[i].email+'</td>';
        userInfoHtml += '<td>'+data[i].cellphone+'</td>';
        userInfoHtml += '</tr>' 
  }
  userInfoHtml += '</tbody>';
  userInfoHtml += '<tfoot></tfoot>';
  userInfoHtml += '</table></div>';
  return userInfoHtml;
}