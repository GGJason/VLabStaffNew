var list = {
        events:[]
    };
var username = {
    _rankmin : '黃竟焜',
    _gracecatrabbit : '邱文心',
    _majou : '邱奕陽',
    _yilei : '許苡蕾',
    _47lin: '林思齊',
    _r06521503 : '林修逸',
    _b05501029 : '曾柏硯',
    _dachu : '大竹哥',
    _ggjason : '大竹',
    _kai860115 : '凌于凱',
    _vlabstaff : 'V.Lab管理者'
};
var today = (new Date()).toISOString().slice(0,10);
//console.log(today);
$(document).ready(function() {
    $.get('./punch.php?list')
        .done(function(data){
            console.log('get schedule successful');
            PreProcessData(JSON.parse(data));
//            console.log(JSON.parse(data));
//            console.log(list);
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay,listWeek'
                },
                defaultDate: today,
                navLinks: true, // can click day/week names to navigate views
                editable: false,
                eventLimit: true, // allow "more" link when too many events+
                events: list.events
		    });
        })
        .fail(console.log('get schedule fail'));
});

function PreProcessData(raw){
    var item = {};
    for(i=0; i<raw.eventSources.event.length;i++){
        var element = raw.eventSources.event[i];
        if(element.end === null){continue;}
        item = {
            title : '['+element.id+'] '+ username['_'+element.staff],
            start : element.start.substring(0,10)+'T'+element.start.substring(11,19),
            end : element.end.substring(0,10)+'T'+element.end.substring(11,19),
            url : ''   //預留修改打卡用
        };
        list.events.push(item);
    }
}
