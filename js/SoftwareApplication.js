
function Submit(){
  var purpose = document.getElementById('purpose');
  var teacher = document.getElementById('teacher');
  var startDate = document.getElementById('startDate');
  var endDate = document.getElementById('endDate');
  var softwares = document.getElementById('softwareInput').getElementsByTagName('form');
  var applicant = document.getElementById('applicant');
  var memo = document.getElementById('memo');
  alerted = 0;
  var application = {
    purpose: check(purpose),
    teacher: check(teacher),
    startDate: check(startDate),
    endDate: check(endDate),
    software: (function(){
                var arr = [];
                for(var i=0; i<softwares.length; i++){
                  var element = softwares[i];
                  var temp = {
                    name: check(element.name),
                    os: check(element.os),
                    source: check(element.source),
                    memo: check(element.source)
                  }
                  arr.push(temp);
                }
                return arr;
              }()),
    name: check(applicant.name),
    phone: check(applicant.phone),
    email: check(applicant.email),
    memo: memo
  }
  console.log(application);
}

//檢查有沒有漏填的
function check(ta){
  if(ta.value !== ''){
    return ta.value;
  }
  else{
    if( alerted === 0 ){
      alert('您好像有東西忘了填唷');
      ta.focus();
      alerted++;
    }
  }
}

//增減軟體欄位
var softwareNum = 1;
function expand(obj){
  if(obj.id === 'plus'){
    softwareNum++;
    var target = document.getElementById('softwareInput');
    var formnode = document.createElement('div');
    formnode.innerHTML = '<br><br>' +
                        '<form style="margin-top: 1em;">' +
                          '<div class="row uniform">' +
                            '<div class="6u 12u$(xsmall)">' +
                              '<input type="text" name="name" placeholder="軟體名稱">' +
                            '</div>' +
                            '<div class="6u 12u$(xsmall)">' +
                              '<div class="row uniform">' +
                                '<div class="label 3u 12u$(xsmall)" style="padding: 15px">作業系統：</div>' +
                                '<div class = "4u 12u$(xsmall)" style="padding: 15px">' +
                                  '<input type="radio" name="os" id="'+'software_'+softwareNum+ '_osx" value="osx">' +
                                  '<label for="'+'software_'+softwareNum+ '_osx">osx (apple)</label>' +
                                '</div>' +
                                '<div class = "4u 12u$(xsmall)" style="padding: 15px">' +
                                  '<input type="radio" name="os" id="'+'software_'+softwareNum+ '_windows10" value="windows10">' +
                                  '<label for="'+'software_'+softwareNum+ '_windows10">windows 10</label>' +
                                '</div>' +
                              '</div>' +
                            '</div>' +
                            '<div class="12u$">' +
                              '<input type="text" name="source" placeholder="軟體合法下載連結">' +
                            '</div>' +
                            '<div class="12u$">' +
                              '<input type="text" name="notice" placeholder="備註">' +
                            '</div>' +
                          '</div>' +
                        '</form>' ;
    target.appendChild(formnode);
  }
}
