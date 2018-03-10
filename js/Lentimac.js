const application = {
  agree: false,
  type: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  computer: '',
  os: '',
  software: [],
  professor: '',
  purpose: '',
  name: '',
  phone: '',
  email: '',
  ps: ''
};

const imacs = ['1601','1602','1603','1604','1605','1606','1607','1701','1702','1703','1704','1705','1706','1707','1708'];

$(document).ready(function(){
    initialize();
    $('html,body').animate({scrollTop:$('#RULE').offset().top},800);
    // Smooth scroll.
    $('.smooth-scroll').scrolly();
    $('.smooth-scroll-middle').scrolly({ anchor: 'middle' });
    $('.smooth-scroll-top').scrolly({ anchor: 'top' });
});

function initialize(){

  var today = new Date();                                   //  限制日期選擇器範圍
  var tomorrow = new Date();
  today.setDate(today.getDate()+3)
  tomorrow.setDate(tomorrow.getDate()+3);
  var start = document.getElementById('start_date');
  var end = document.getElementById('end_date');
  start.min = convertToISO(today);                          //最早三天後開始
  end.min = convertToISO(tomorrow);                         //最早三天後結束
  start.placeholder = start.min;
  end.placeholder = start.min;

  $('#TYPE').hide();
  $('#TIME').hide();
  $('#COMPUTER').hide();
  $('#OS').hide();
  $('#SOFTWARE').hide();
  $('#INFO').hide();
  $('#THANKYOU').hide();
}


function agree(){
  application.agree = 'true';
  $('#RULE').hide();
  $('#TYPE').slideDown();
  $('#TIME').slideDown();
  $('#COMPUTER').slideDown();
  $('#OS').slideDown();
  $('#SOFTWARE').slideDown();
  $('#INFO').slideDown();
  $('html,body').animate({scrollTop:$('#TYPE').offset().top},800);
}

function here(){
  application.type = '內用';
  if(application.type === '內用'){
    document.getElementById('here').style.color = '#61a4ba';
    document.getElementById('here').style.opacity = '1';
    document.getElementById('takeout').style.color = '#585858';
    document.getElementById('takeout').style.opacity = '.5';
  }else{
    document.getElementById('here').style.color = '#585858';
    document.getElementById('here').style.opacity = '.5';
    document.getElementById('takeout').style.color = '#61a4ba';
    document.getElementById('takeout').style.opacity = '1';
  }
}

function takeout(){
  application.type = '外帶';
  if(application.type === '內用'){
    document.getElementById('here').style.color = '#61a4ba';
    document.getElementById('here').style.opacity = '1';
    document.getElementById('takeout').style.color = '#585858';
    document.getElementById('takeout').style.opacity = '.5';
  }else{
    document.getElementById('here').style.color = '#585858';
    document.getElementById('here').style.opacity = '.5';
    document.getElementById('takeout').style.color = '#61a4ba';
    document.getElementById('takeout').style.opacity = '1';
  }
}



function analizeDate(){                                     //分析日期 與後端溝通
    console.log('analizeDate');
    var startDate = document.getElementById('start_date');
    var startTime = document.getElementById('start_time');
    var endDate = document.getElementById('end_date');
    var endTime = document.getElementById('end_time');
    if(startDate.value != '' && startTime.value != '' && endDate.value != '' && endTime.value != ''){
      document.getElementById('time_info').innerHTML =
        `<p><img class="loading" src="images/loading.gif" height="60" width="60">系統確認中，請稍後。</p>`;


      //紀錄時間
      application.startDate = startDate.value;
      application.startTime = startTime.value;
      application.endDate = endDate.value;
      application.endTime = endTime.value;

      //時間分析 api接這裡
      $.get(`./computer.php?calendar&check&start=${application.startDate} ${application.startTime}&end=${application.endDate} ${application.endTime}`)
        .done(function(data){
          console.log('get time data successfully');
          data = JSON.parse(data);

          if(data.status == 'fail'){
            document.getElementById('time_info').innerHTML =
              `<div class="row uniform">
                <div class="12u$">
                  <p>很抱歉，我們的伺服器似乎出現了一些問題，請與<a href="https://www.facebook.com/vlab.ntu/">粉絲專業</a>聯繫。</p>
                </div>
               </div>`
          }

          else{
            if(data.event.length == 15){
              document.getElementById('time_info').innerHTML =
                `<div class="row uniform">
                  <div class="12u$">
                    <p>很抱歉，您所選的時段沒有閒置iMac可以外借，請選擇其他時段。</p>
                  </div>
                 </div>`
            }

            else if(data.message == 'Occupied'){
              var event = (function(){
                var html='';
                for(var i=0; i<data.event.length; i++){
                  html += `<li>${data.event[i].name}  ${data.event[i].start} ~ ${data.event[i].end}</li>`;
                }
                return html;
              })();

              document.getElementById('time_info').innerHTML =
                `<div class="row uniform">
                  <div class="12u$">
                    <p>您選擇的時間與課程衝突，課程時間無法使用。如果您覺得可以接受的話，請繼續向下填答。</p>
                  </div>
                  <div class="1u 12u$(xsmall)"> </div>
                  <div class="11u 12u$(xsmall)">
                    <ul>
                      ${event}
                    </ul>
                  </div>
                 </div>`;
                 imacGenerate(data);
            }

            else{
              document.getElementById('time_info').innerHTML ='';
              imacGenerate(data);
              $('html,body').animate({scrollTop:$('#COMPUTER').offset().top},800);
            }
          }

        })
        .fail(console.log('get time data fail'));
    }
}

function imacGenerate(serverInfo){

  serverInfo.computers.forEach(function(e){
    for(var i=0; i<imacs.length; i++){
      if(e === imacs[i]){ imacs[i] = '0' };
    }
  });

  imacs.forEach(function(e){
    document.getElementById(e).className = "fa fa-desktop selection";
  });

}



function recordIMAC(obj){
  if('fa fa-desktop selection'.indexOf(obj.className) !== -1 ){

    if(application.computer === ''){
      application.computer = obj.id;
      document.getElementById(obj.id).className = "fa fa-desktop selected";
      $('html,body').animate({scrollTop:$('#OS').offset().top},800);
    }
    else{
      document.getElementById(application.computer).className = "fa fa-desktop selection";;
      document.getElementById(obj.id).className = "fa fa-desktop selected";
      application.computer = obj.id;
      $('html,body').animate({scrollTop:$('#OS').offset().top},800);
    }



  }
}

function recordOS(obj){

  if(application.os === ''){
    application.os = obj.id;
    document.getElementById(obj.id).style.color = '#61a4ba';
    document.getElementById(obj.id).style.opacity = '1';
    $('html,body').animate({scrollTop:$('#SOFTWARE').offset().top},800);
  }
  else{
    document.getElementById(application.os).style = '';
    document.getElementById(obj.id).style.color = '#61a4ba';
    document.getElementById(obj.id).style.opacity = '1';
    application.os = obj.id;
    $('html,body').animate({scrollTop:$('#SOFTWARE').offset().top},800);
  }

}

function recordSOFTWARE(){
  var form = document.getElementById('Software');
  var index = 0;
  var remove = false;
  modify = undefined;
  if(form.Name.value == '' && form.Source.value == ''){
    alert('請輸入軟體資訊');
    form.Name.focus();
    return false;
  }else if(form.Name.value == ''){
    alert('請輸入軟體名稱');
    form.Name.focus();
    return false;
  }else if(form.Source.value == ''){
    alert('請輸入軟體來源');
    form.Source.focus();
    return false;
  }else{
    for(index = 0; index < application.software.length; index++){
      if(modify !== undefined && application.software[index].name === modify){
        application.software.splice(index,1);
        console.log('remove');
        modify = undefined;
        remove = true;
      }
      console.log(index);
    }
  }

  if(index === application.software.length){
    console.log('no remove');
    remove = true;
  }

  if(remove){
    console.log('create');
    var obj = {
      name: form.Name.value,
      source: form.Source.value,
      ps: form.Notice.value
    };
    application.software.push(obj);
    showSOFTWARE();
    form.Name.value = '';
    form.Source.value = '';
    form.Notice.value = '';
  }


}

function removeSOFTWARE(){
  var form = document.getElementById('Software');
  var name = form.Name.value;
  var source = form.Source.value;
  var notice = form.Notice.value;

  for(var i=0; i<application.software.length; i++){
    if(application.software[i].name === name){
      application.software.splice(i,1);
    }
  }

  showSOFTWARE();
  form.Name.value = '';
  form.Source.value = '';
  form.Notice.value = '';
}

function modifySOFTWARE(obj){
  var form = document.getElementById('Software');

  for(var i=0; i<application.software.length; i++){
    if(application.software[i].name === obj.innerHTML){
      form.Name.value = application.software[i].name;
      form.Source.value = application.software[i].source;
      form.Notice.value = application.software[i].ps;
      modify = application.software[i].name;
    }
  }
}

function showSOFTWARE(){
  $('#softwareList').children().filter('li').remove();
  for(var i=0;i<application.software.length; i++){
    var obj = application.software[i];
    if(obj.name){
      var node = document.createElement('LI');
      node.setAttribute('class', 'softwareItem button');
      node.setAttribute('id', obj.name);
      node.setAttribute('onclick', 'modifySOFTWARE(this)');
      node.innerHTML =  obj.name ;
      document.getElementById('softwareList').appendChild(node);
    }
  }
}

function recordINFO(){
  var form = document.getElementById('info');
  for(i=0; i<form.length-1; i++){
    if(form[i].value == ''){
      alert('請輸入' + form[i].placeholder);
      form[i].focus();
      return false;
    }
    if(i === 4){
      var emailRegxp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;
      if (emailRegxp.test(form[i].value) != true){
          alert('電子信箱格式錯誤');
          form[i].focus();
          form[i].select();
          return false;
      }
    }
  }
  application.professor = form.professor.value;
  application.purpose = form.purpose.value;
  application.name = form.name.value;
  application.phone = form.phone.value;
  application.email = form.email.value;
  application.ps = form.notice.value;
  postMSG();
}

function check(){
  console.log('check');
  var errormsg = {
    type: {
      msg: '尚未輸入借用型態',
      action: function(){
        $('html,body').animate({scrollTop:$('#TYPE').offset().top},800);
      }
    },
    startDate: {
      msg: '尚未輸入借用開始日期',
      action: function(){
        $('html,body').animate({scrollTop:$('#TIME').offset().top},800);
      }
    },
    startTime: {
      msg: '尚未輸入借用開始時間',
      action: function(){
        $('html,body').animate({scrollTop:$('#TIME').offset().top},800);
      }
    },
    endDate: {
      msg: '尚未輸入借用結束日期',
      action: function(){
        $('html,body').animate({scrollTop:$('#TIME').offset().top},800);
      }
    },
    endTime: {
      msg: '尚未輸入借用結束時間',
      action: function(){
        $('html,body').animate({scrollTop:$('#TIME').offset().top},800);
      }
    },
    computer: {
      msg: '尚未輸入借用電腦',
      action: function(){
        $('html,body').animate({scrollTop:$('#COMPUTER').offset().top},800);
      }
    },
    os: {
      msg: '尚未輸入作業系統',
      action: function(){
        $('html,body').animate({scrollTop:$('#OS').offset().top},800);
      }
    },
    professor: {
      msg: '尚未輸入指導教授',
      action: function(){
        $('html,body').animate({scrollTop:$('#INFO').offset().top},800);
      }
    },
    purpose: {
      msg: '尚未輸入申請目的',
      action: function(){
        $('html,body').animate({scrollTop:$('#INFO').offset().top},800);
      }
    },
    name: {
      msg: '尚未輸入申請人姓名',
      action: function(){
        $('html,body').animate({scrollTop:$('#INFO').offset().top},800);
      }
    },
    phone: {
      msg: '尚未輸入申請人電話',
      action: function(){
        $('html,body').animate({scrollTop:$('#INFO').offset().top},800);
      }
    },
    email: {
      msg: '尚未輸入申請人墊子郵件',
      action: function(){
        $('html,body').animate({scrollTop:$('#INFO').offset().top},800);
      }
    }
  };

  for( key in application ){
    if(application[key] == '' && errormsg[key] !== undefined ){
      alert(errormsg[key].msg);
      errormsg[key].action();
      return false;
    }
  }
  return true;
}

function postMSG(){
  console.log('post');
  if(check()){
    //post method
    $.post('./form.php?imac',application,function(msg){
      console.log(msg);
    });

    $('#RULE').hide();
    $('#TYPE').hide();
    $('#TIME').hide();
    $('#COMPUTER').hide();
    $('#OS').hide();
    $('#SOFTWARE').hide();
    $('#INFO').hide();
    $('#CONFIRM').hide();
    $('#THANKYOU').slideDown();
    $('html,body').animate({scrollTop:$('#THANKYOU').offset().top},800);
  }
}

function convertToISO(timebit) {
  // GMT 歸零
  timebit.setHours(0, -timebit.getTimezoneOffset(), 0, 0);
  // 轉換ISO 並切下需要的部分
  var isodate = timebit.toISOString().slice(0,10);
  return isodate;
}
