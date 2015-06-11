/* author: yuki 
   chrome presentation mode 125%
*/
var logon = true;
var targetRuleIndex = 0;
var styleSheet = document.styleSheets[0];
var clocksize = 200;
var now_speed = 1.0;

var fast_clockspeed = 0.66; // slow 
var normal_clockspeed = 1.0; // normal
var slow_clockspeed = 1.50; // fast
var interval = 10; //sec 記録間隔
var goaltime = 30;//300; //sec　終了時間
var changetime = 0;//30; //sec　時間変更タイム
var offsettime = 0;//5; //sec　時間変更タイム

$(function(){

    $.getJSON("resource/data.json" , function(data) {
        console.log (data);
        goaltime = data.goaltime;
        changetime = data.changetime;
        offsettime = data.offset;
        normal_clockspeed = data.normal;
        slow_clockspeed = data.slow;
        fast_clockspeed = data.fast;


    });

    styleSheet = document.styleSheets[0];
    targetRuleIndex = styleSheet.cssRules.length;
    var defsize = 460;
    var defspeed = 1;


    function re_size(cl, sr){
        var st = (parseInt(cl) * sr) + "px";
        return st;
    }

    function showstartpopup(){
        var SM = new SimpleModal({"width":600});
        SM.addButton("Action button", "btn primary", function(){
          this.hide();
        });
        SM.addButton("Cancel", "btn");
        SM.show({
            "model":"modal-ajax",
            "title":"Title",
            "param":{
            "url":"file-content.php",
            "onRequestComplete": function(){ }
            }
        });
    }

    function re_size_arrow(clname, sr){
        $(clname).css("left", re_size($(clname).css("left"), sr));
        $(clname).css("top", re_size($(clname).css("top"), sr));
        $(clname).css("width", re_size($(clname).css("width"), sr));
        $(clname).css("height", re_size($(clname).css("height"), sr));
        $(clname).css("border-radius", re_size($(clname).css("border-radius"), sr));
        var ar = $(clname).css("-webkit-transform-origin").split(" ");
        $(clname).css("-webkit-transform-origin", (parseInt(ar[0]) * sr) + "px " + (parseInt(ar[1]) * sr) + "px");
        $(clname).css("-moz-transform-origin", (parseInt(ar[0]) * sr) + "px " + (parseInt(ar[1]) * sr) + "px");
    }

    function setsize(size, def) {
        var sizeratio = size/def;
        $(".clock").css("min-width", size + "px");
        $(".clock").css("min-height", size * 1.2 + "px");

        $(".numpos").css("top", re_size( $(".numpos").css("top"), sizeratio));

        $(".num").css("left", re_size($(".num").css("left"), sizeratio));
        $(".num").css("top", re_size($(".num").css("top"), sizeratio));
        $(".num").css("width", re_size($(".num").css("width"), sizeratio));
        $(".num").css("height", re_size($(".num").css("height"), sizeratio));
        $(".num").css("font-size", re_size($(".num").css("font-size"), sizeratio));
        $(".num").css("line-height", re_size($(".num").css("line-height"), sizeratio));

        re_size_arrow(".arrow_min", sizeratio);
        re_size_arrow(".arrow_hour", sizeratio);
        re_size_arrow("#asec", sizeratio);
    }

    function reset_speed(clname, speed, def_speed) {
        var name = $(clname).css("-webkit-animation-name");
        var vnum = 1 - parseInt(name.substr(name.length-1,1));
        var hon = name.substr(0, name.length-1);
        console.log(name);
        $(clname).css("-webkit-animation-name", "");
        $(clname).css("-webkit-animation-duration", parseFloat(def_speed) * speed + "s");
        $(clname).css("-webkit-animation-name", hon + vnum);
    }

    var def_min = $(".arrow_min").css("-webkit-animation-duration");
    var def_hour = $(".arrow_hour").css("-webkit-animation-duration");
    var def_sec = $("#asec").css("-webkit-animation-duration");
    var def_1sec = $(".oscillation").css("-webkit-animation-duration");


    function setspeed(speed) {
        now_speed = speed;
        console.log("nowspeed: " + now_speed);
        reset_speed(".arrow_min", speed, def_min);
        reset_speed(".arrow_hour", speed, def_hour);
        reset_speed("#asec", speed, def_sec);
        reset_speed(".oscillation", speed, def_1sec);
    }

    function checkspeed(spname) {
        if (spname == "fast_speed"){
            setspeed(fast_clockspeed);
        }
        if (spname == "normal_speed"){
            setspeed(normal_clockspeed);
        }
        if (spname == "slow_speed"){
            setspeed(slow_clockspeed);
        } 
    }


    $("#changeTimer").click(function () {
        checkspeed($(".now_speed").attr("id"));
    });

    $(".change_speed").click(function () {
        var sb = $(".now_speed");
        sb.removeClass("now_speed");
        $(this).addClass("now_speed");
        checkspeed($(this).attr("id"));
    });

    $("#ssbutton").click(function () {
        var sb = $(".now_speed");
        sb.removeClass("now_speed");
        var val = $("input[name='q2']:checked").val();
        $("#" + val).addClass("now_speed");
        var log = $("input[name='log']:checked").val();
        if(log == "log")
            logon = true;
         else 
            logon = false;

        //checkspeed(val);
        $("#speedselect").css("display", "none");
    });

    //showstartpopup();
    setsize(clocksize, defsize);
    var sharp = location.href.indexOf("#");
    if(sharp == -1){
        location.href += "#modal2"; }
    else {
        var tmp = location.href.substr(0, sharp);
        location.href = tmp + "#modal2";
    }


})

//---------------------------------------------------------------------------//

function modify_modal_content(){
    $("#modal2").text("");
    $("#modal2").append($("h1").text("実験終了"));
    $("#modal2").append($("p").text("以上で実験は終了です．ご協力ありがとうございました．"));
}

function runningtimer(){
        $(".arrow_min").css("-webkit-animation-name", "clockarrow-min0");
        $(".arrow_sec").css("-webkit-animation-name", "clockarrow-sec0");
        $(".arrow_hour").css("-webkit-animation-name", "clockarrow-hour0");
        $(".oscillation").css("-webkit-animation-name", "oscillation0");
        $(".arrow_min").css("-webkit-animation-play-state", "running");
        $(".arrow_sec").css("-webkit-animation-play-state", "running");
        $(".arrow_hour").css("-webkit-animation-play-state", "running");
        $(".oscillation").css("-webkit-animation-play-state", "running");
}

function setTime(hour, minute, sec){
    var sec_deg = sec / 60.0 * 360;
    var min_deg = minute/60.0 * 360 + sec / 60.0 * 6.0;
    if(hour > 11)
        hour = hour - 12;
    var hour_deg = hour / 12.0 * 360 + minute/60.0 * 30;
    var keyframe_sec0 = 
            "@-webkit-keyframes clockarrow-sec0 { \n" + 
            "    0% { -webkit-transform: rotate(" + (sec_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + sec_deg)  + "deg); } \n" + 
            "}\n";
    var keyframe_min0 = 
            "@-webkit-keyframes clockarrow-min0 { \n" + 
            "    0% { -webkit-transform: rotate(" + (min_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + min_deg)  + "deg); } \n" + 
            "}\n";
    var keyframe_hour0 = 
            "@-webkit-keyframes clockarrow-hour0 { \n" + 
            "    0% { -webkit-transform: rotate(" + (hour_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + hour_deg)  + "deg); } \n" + 
            "}\n";
    var keyframe_sec1 = 
            "@-webkit-keyframes clockarrow-sec1 { \n" + 
            "    0% { -webkit-transform: rotate(" + (sec_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + sec_deg)  + "deg); } \n" + 
            "}\n";
    var keyframe_min1 = 
            "@-webkit-keyframes clockarrow-min1 { \n" + 
            "    0% { -webkit-transform: rotate(" + (min_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + min_deg)  + "deg); } \n" + 
            "}\n";
    var keyframe_hour1 = 
            "@-webkit-keyframes clockarrow-hour1 { \n" + 
            "    0% { -webkit-transform: rotate(" + (hour_deg - 90) + "deg); } \n" + 
            "    100% { -webkit-transform: rotate(" + (270 + hour_deg)  + "deg); } \n" + 
            "}\n";
        var testrule = "#fast_speed{color:red;}"
        // stylesheet オブジェクトの追加位置に keyframes を追加する
        console.log(targetRuleIndex);
        console.log(styleSheet.cssRules[targetRuleIndex - 1].selectorText + " : " + styleSheet.cssRules[targetRuleIndex - 1].style.cssText);
        styleSheet.insertRule(keyframe_min0, targetRuleIndex);
        styleSheet.insertRule(keyframe_hour0, targetRuleIndex + 1);
        styleSheet.insertRule(keyframe_min1, targetRuleIndex + 2);
        styleSheet.insertRule(keyframe_hour1, targetRuleIndex + 3);
        styleSheet.insertRule(keyframe_sec0, targetRuleIndex + 4);
        styleSheet.insertRule(keyframe_sec1, targetRuleIndex + 5);
}

var save_cnt = 0;
var testTimer;
var changeTimer;
var backspace_num = 0;
var textlength = 0;
var firsttime = 0;

var intervalNum = 0;
var intervalSize = 3;
var intervalonoff = false;

intervaltime = new Array(intervalSize);
var intv = 0;


var cW = 950;   //キャンバス横サイズ
var cH = 600;   //キャンバス縦サイズ



$(window).resize(function(){
    wh = jQuery(window).height();
    ww = jQuery(window).width();
    cW = ww - 75;
    cH = wh - 50;
    $("#testCanvas").attr("width", cW);
    $("#testCanvas").attr("height", cH);
    $("#timer").css("margin-top", wh/2 - clocksize/2*1.4);
    $("#timer").css("margin-left", ww/2 - clocksize/2);
    //draw();
});

var mouseX;
var mouseY;
var count = 0;
var nowX = Math.floor( Math.random() * cW );
var nowY = Math.floor( Math.random() * cH );
while(nowX < 180)
    nowX = Math.floor( Math.random() * cW );
while(nowY < 50)
    nowY = Math.floor( Math.random() * cH );





function changeTime() {
    styleSheet.deleteRule(targetRuleIndex + 5);
    styleSheet.deleteRule(targetRuleIndex + 4);
    styleSheet.deleteRule(targetRuleIndex + 3);
    styleSheet.deleteRule(targetRuleIndex + 2);
    styleSheet.deleteRule(targetRuleIndex + 1);
    styleSheet.deleteRule(targetRuleIndex);
    var jikan= new Date();
    var hour = jikan.getHours();
    var minute = jikan.getMinutes();
    var sec = jikan.getSeconds();
    setTime(hour, minute, sec);
    $("#changeTimer").trigger("click");
    clearInterval(changeTimer);
}

function textlog() {
    save_cnt += 1;
    var cnt = count;
    console.log("loop" + save_cnt);
    if (interval * save_cnt >= goaltime + changetime) {
        clearInterval(testTimer);

        $("#timer").css("visibility", "hidden")
        $("texta").blur();
        modify_modal_content();
        var sharp = location.href.indexOf("#");
        if(sharp == -1){
            location.href += "#modal2"; }
        else {
            var tmp = location.href.substr(0, sharp);
            location.href = tmp + "#modal2";
        }
        logon = false;
    }
}


window.onload = function() {

        wh = jQuery(window).height();
    ww = jQuery(window).width();
    cW = ww - 75;
    cH = wh - 50;
    $("#testCanvas").attr("width", cW);
    $("#testCanvas").attr("height", cH);
    $("#timer").css("margin-top", wh/2 - clocksize/2*1.4);
    $("#timer").css("margin-left", ww/2 - clocksize/2);
    //draw();
};


function setNowSpeed(spname) {
        if (spname == "fast_speed"){
            now_speed = fast_clockspeed;
        }
        if (spname == "normal_speed"){
            now_speed = normal_clockspeed;;
        }
        if (spname == "slow_speed"){
            now_speed = slow_clockspeed;
        } 
    }



    $(document).on('confirm', '.remodal', function () {
        if ($("#speedselect").css("display") != "none")
            $("#ssbutton").trigger("click");
        var jikan= new Date();
        var hour = jikan.getHours();
        var minute = jikan.getMinutes();
        var sec = jikan.getSeconds();
        setTime(hour, minute, sec);
        runningtimer();

        setNowSpeed($(".now_speed").attr("id"));
        //goaltime = goaltime * now_speed;

        setTimeout(function(){
            firsttime = new Date().getTime();
            testTimer = setInterval("textlog()",interval * 1000);
            changeTimer = setInterval("changeTime()", changetime * 1000);

            intv = goaltime / (intervalSize + 1);

        },offsettime * 1000);

    });

    $(document).on('cancel', '.remodal', function () {
        console.log('cancel');
    });

