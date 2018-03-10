var punch_in_url = './punch.v2.php?in&redirect=./Punch.html';
var punch_out_url = './punch.v2.php?out&redirect=';
var work_record_url = './punch.v2.php?update';
var punch_list_url = './punch.v2.php?list';
var status_url = './punch.v2.php?check';
var itemobj = [
  {
    title: 'LAB 管理',
    items: [
      {title: '回信',tag: 'input',setting: { type: 'checkbox',name: 'replyEmail',id: 'replyEmail'} },
      {title: '點人數',tag: 'input',setting: { type: 'checkbox',name: 'count',id: 'count'} },
      {title: '軟體維護',tag: 'input',setting: { type: 'checkbox',name: 'softMaintenance',id: 'softMaintenance'} },
      {title: '403 維護',tag: 'input',setting: { type: 'checkbox',name: '403Maintenance',id: '403Maintenance'} },
      {title: '大電視維護',tag: 'input',setting: { type: 'checkbox',name: 'pcMaintenance',id: 'pcMaintenance'} },
      {title: '投影機維護',tag: 'input',setting: { type: 'checkbox',name: 'projectorMaintenance',id: 'projectorMaintenance'} }
    ]
  },
  {
    title: '環境清潔',
    items: [
      {title: 'V.Lab',tag: 'input',setting: { type: 'checkbox',name: 'vlabClean',id: 'vlabClean'} },
      {title: '403 Studio',tag: 'input',setting: { type: 'checkbox',name: '403Clean',id: '403Clean'} }
    ]
  },
  {
    title: '開發相關',
    items: [
      {title: '管理系統開發',tag: 'input',setting: { type: 'checkbox',name: 'MSDevelop',id: 'MSDevelop'} },
      {title: '電腦管理開發',tag: 'input',setting: { type: 'checkbox',name: 'ComDevelop',id: 'ComDevelop'} },
      {title: 'V.Lab網頁',tag: 'input',setting: { type: 'checkbox',name: 'WebDevelop',id: 'WebDevelop'} }
    ]
  }
];
var startTime;
var id;


$(document).ready(function(){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 401) {
                window.location = './index.html';
            }
            if (this.status == 200) {
                punch();
            }
          }
          else{}
    };
    xmlhttp.open('GET', './auth.php?info', true);
    xmlhttp.send();
});

function punch(){
    $.get(status_url)
        .done(function(status){
            console.log('successfully get status');
            status = JSON.parse(status);
            console.log(status);
            id = status.id;
            document.getElementById('mainbox').innerHTML = generatePunchOperator(status.workstatus);

        })
        .fail(console.log('get status fail'));
}

function generatePunchOperator(status){
    if(status == 'Working'){
        getStartTime();
        return (function(){
                  var html = `<div class="6u 12u$(small)" id="picture"></div><div class="6u 12u$(small)" id="operator"><section><form  onsubmit = "return Punch_out(this)"><div class="row uniform"><div class="12u$" id="workTime"></div>`;
                  for(var i=0; i<itemobj.length; i++){
                    var series = itemobj[i];
                    var temp = ``;
                    temp += `<div class="12u$"><h2>${series.title}</h2></div>`;
                    for(var j=0; j<series.items.length; j++){
                      var item = series.items[j];
                      temp += `<div class="6u 12u$(small) item">`;
                      temp += `<${item.tag}`;
                      for(key in item.setting){
                        temp += ` ${key}=${item.setting[key]}`;
                      }
                      temp += `><label for="${item.setting.id}">${item.title}</label></div>`;
                    }
                    html += temp;
                  }
                  html += `<div class="12u$"><h2>你還做了什麼神奇的事?</h2></div><div class="12u$"><textarea name="OtherWorks" id="OtherWorks" placeholder="Enter what you have done." rows="2"></textarea></div><div class="12u$ itemCenter"><ul class="actions"><li><input type="submit" value="下班囉！" class="special" /></li><li><input type="reset" value="Reset" /></li></ul></div></div></form></section></div>`;
                  return html;
                }());
    }
    else{
        return `<div class="12u 12u$(small)" id="itemCenter"><a href="${punch_in_url}" class="button fit" id="punch_in">打卡上班</a></div>`;
    }
}

function Punch_out(e){
    var data = {
      workitem:[]
    };
    for(var i=0; i<itemobj.length; i++){
      var category = itemobj[i];
      var obj = {
        type: category.title,
        items: []
      }
      for(var j=0; j<category.items.length; j++){
        var element = category.items[j];
        var check = document.getElementById(element.setting.id).checked;
        if(check){
          obj.items.push(element.title);
        }
      }
      data.workitem.push(obj);
    }
    data.workitem.push({
      type: '其他',
      items: document.getElementById('OtherWorks').value
    });
    $.post(work_record_url,data,function(msg){});
    $.post(punch_out_url,data,function(msg){console.log('下班');});
    console.log(JSON.stringify({content: data.workitem}));
    alert('熊小姐說下班請直接填簽到退，你敢不遵嗎？');
    window.location = 'https://docs.google.com/forms/d/e/1FAIpQLSe7VBCC6fOKDRbu9IiW5MnDeicQamzlBFllSyaUhw3ekqKvng/viewform?c=0&w=1';
    return false;
}

function getStartTime(){
    $.get(punch_list_url)
        .done(function(data){
            console.log('successfully get punch list');
            data = JSON.parse(data);
            for(var i=data.eventSources.event.length-1; i>=0; i++){
              if(data.eventSources.event[i].id === id){
                startTime = new Date(data.eventSources.event[i].start);
                workTimeRefresh();
                break;
              }
            }
        })
        .fail(console.log('get punch list fail'));
}

function workTimeRefresh(){
    var nowTime = new Date();
    document.getElementById('workTime').innerHTML = convertMs(nowTime - startTime);
    setTimeout('workTimeRefresh()',500);
}

function convertMs(ms){
    var hours = Math.floor(ms/3600000);
    ms -= hours*3600000;
    var minutes = Math.floor(ms/60000);
    ms -= minutes*60000;
    var seconds = Math.floor(ms/1000);
//    console.log('主人的工作時間： ' + hours + ':' + minutes + ':' + seconds);
    return '主人的工作時間 &#x1F499;： ' + (hours < 10 ? '0' : '') + hours + ' : ' + (minutes < 10 ? '0' : '') + minutes + ' : ' + (seconds < 10 ? '0' : '') + seconds;
}
