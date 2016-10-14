function formatIp(val){
	if(!val){
		return '';
	}
	val = val == '::1'?'192.168.3.207':val;
	if(val.startsWith('::ffff')){
		val = val.substring(7);
	}
	return val;
}
function formatTime(val){
	if(!val){
		return '';
	}
	var time = new Date(val);
	    year = time.getFullYear();
	    month = time.getMonth()+1;
	    day = time.getDate();
	    hour = time.getHours();
	    minute = time.getMinutes();
	month = month<10?'0'+month:month;
	day = day<10?'0'+day:day;
	hour = hour<10?'0'+hour:hour;
	minute = minute<10?'0'+minute:minute;
    return (year+'-'+month+'-'+day+':'+hour+':'+minute+':')
}
function formatContent(val){
	if(!val){
		return '';
	}
	var str = val.replace(/</g,"&lt");
	var str = str.replace(/>/g,"&gt");
    return val;
}
$(function(){
	$('.back').click(function(){
		history.go(-1);
	})
	$('.fs18').click(function(){
		location.href='/index.html'
	})
})
