var size = 86;
var columns = Array.from(document.getElementsByClassName('column'));
var d = void 0,
    c = void 0;
var classList = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
function padClock(p, n) {
    return p + ('0' + n).slice(-2);
}

function getClock() {
    var date2 = new Date().getTime();
    var date3 = 1677559200000 - date2; //1575295710000 - date2; //;
    var returnMun=[Math.floor(date3/1000),date3%1000];
    return returnMun;
}

var loop = setInterval(function () {
    var time = getClock();
   //毫秒
    var ms=Math.floor(time[1]/10);
    if(ms<10){
        ms='.0'+ms;
    }else{
        ms='.'+ms;
    }
    $(".ms").html(ms);
    //秒
    var c=parseInt(time[0]);
    
    if(c<0){
        $(".text1").html("再见高一三班<br/><br/>大家再见")
        $(".column,.ms,.colon").css("display",'none');
        $(".text1").css("display",'block');
        clearInterval(loop);
    }else{
        c=c.toString();
    }
    columns.forEach(function (ele, i) {
        var n = +c[i];
        var offset = -n * size;
        if(Number.isNaN(n)){
            ele.style.width = '0';
        }else{
            ele.style.transform = 'translateY(calc(50vh + ' + offset + 'px - ' + size / 2 + 'px))';
        }
        Array.from(ele.children).forEach(function (ele2, i2) {
            ele2.className = 'num ' + getClass(n, i2);
        });
    });
}, 16.6667);

function getClass(n, i2) {
    return classList.find(function (class_, classIndex) {
        return Math.abs(n - i2) === classIndex;
    }) || '';
}
