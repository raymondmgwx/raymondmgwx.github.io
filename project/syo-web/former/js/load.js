$(function(){
　var imgNum = imagesLoaded('body').images.length;
　var loadedImg = 0;
　var progressNowPosition = 0;
　Timer = setInterval(progressMonitor, 1000/30);
　imagesLoaded('body').on('progress', function(){
　　loadedImg++;
　});
	
　function progressMonitor(){ 
　　var progressPosition = (loadedImg/imgNum) * 100;
	 setTimeout(function(){
　　progressNowPosition += (progressPosition-progressNowPosition) * 0.1;      
　　$('#progressBar').css('width', progressNowPosition+'%');
　　if(progressNowPosition >= 100){
　　　clearInterval(Timer);
	  $('#topWrapper').css({display:'block'});
	  $('#progressBlock').animate({opacity:'0'},200,function(){$(this).css({display:'none'})});
　　　$('#progress').delay(400).animate({left:'100%'},500,'swing',function(){$(this).css({display:'none'})});
　　}
　　if(progressNowPosition > 99.9){
　　　progressNowPosition = 100;
　　}
	 },1500);
	 
　}
});