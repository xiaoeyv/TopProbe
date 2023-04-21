function createProgress(element, msg, background, width, id){
    element.append('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-'+background+' d-flex justify-content-center" role="progressbar" aria-valuenow="'+width+'" aria-valuemin="0" aria-valuemax="100" style="width:'+width+'%" id="'+id+'">'+msg+'</div></div>');
}

function changeProgress(element, msg, background, width){
    element.attr('class', 'progress-bar progress-bar-striped progress-bar-animated bg-' + background + ' d-flex justify-content-center" role="progressbar" aria-valuenow="');
    element.html(msg);
    nowWidth = element.attr('style').slice(6, -1);
    for(var i=nowWidth;i>=width;i--){
        element.attr('style', 'width:'+i+'%');
    }
    for(var i=nowWidth;i<=width;i++){
        element.attr('style', 'width:'+i+'%');
    }
}

function changeLabel(type, serverID){
    var isAdd = type=='add'?true:false;
    if(isAdd){
        $('#servers tbody').append('<tr id="'+serverID+'"></tr>');
        var tdTag = '';
        for(var i=0;i<8;i++){
            tdTag += '<td></td>';
        }
        $('#'+serverID).append(tdTag);
    } else{
        $('#'+serverID).remove();
    }
}

window.setInterval(function () {
  $.getJSON('getMonitors.json', function (res) {
    $.each(res.servers, function (index, v) {
        var tag = $('#'+v['serverID']);
        if(tag.length==0){
            changeLabel('add', v['serverID']);
            createProgress($('#'+v['serverID']+' td').eq(0), v['status']=='success'?'运行中':'已离线', v['status']=='success'?'success':'danger', 100, 'state');
            $('#'+v['serverID']+' td').eq(1).append(v['name']);
            $('#'+v['serverID']+' td').eq(2).append(v['onlineTime']);
            $('#'+v['serverID']+' td').eq(3).append(v['RTT']['in']+'|'+v['RTT']['out']);
            $('#'+v['serverID']+' td').eq(4).append(v['TF']['in']+'|'+v['TF']['out']);
            var count = 0;
            $.each(['CPU', 'RAM', 'disk'], function(i, _){
                 if (v[_] <= 50) {
                    background = 'success';
                 } else if (v[_] <= 80) {
                    background = 'warning';
                 } else {
                    background = 'danger';
                 }
                createProgress($('#'+v['serverID']+' td').eq(5+count), v[_]+'%', background, v[_], _);
                count++;
            });
        } else{
            changeProgress($('#'+v['serverID']+' #state'), v['status']=='success'?'运行中':'已离线', v['status']=='success'?'success':'danger', 100);
            $('#'+v['serverID']+' td').eq(2).html(v['onlineTime']);
            $('#'+v['serverID']+' td').eq(3).html(v['RTT']['in']+'|'+v['RTT']['out']);
            $('#'+v['serverID']+' td').eq(4).html(v['TF']['in']+'|'+v['TF']['out']);
            $.each(['CPU', 'RAM', 'disk'], function(i, _){
                 if (v[_] <= 50) {
                    background = 'success';
                 } else if (v[_] <= 80) {
                    background = 'warning';
                 } else {
                    background = 'danger';
                 }
                changeProgress($('#'+v['serverID']+' #'+_), v[_]+'%', background, v[_], _);
                count++;
            });
        }
    });
  });
}, 1000)