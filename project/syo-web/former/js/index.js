$(function(){
        $.sublime_slideshow({
            src:[
            {url:"picture/index-banner1.jpg"},
            {url:"picture/index-banner3.jpg"},
            {url:"picture/index-banner4.jpg"},
			{url:"picture/index-banner2.jpg"}
            ],
            duration:   7,
            fade:       2,
            scaling:    1.4,
            rotating:   2,
           // overlay:    "picture/index-banner1.jpg"
        });
    });


//読み込んだらリサイズを実行
$(document).ready(function(){
   setSlide();
});
$(window).resize(function(){
	setSlide();
});


function setSlide() {
	var winW = $(window).width();
	var winH = $(window).height();

	
	$(".sm-slider").css({
		'height': winH
	});
	$(".slider").css({
		'height': winH
	});
	
	/*
	$(".sm-slider").mousewheel(function(event, delta) {
			if (delta < 0){
			$('body,html').stop().animate({
			scrollTop: winH
		}, 1000, 'swing');
		return false;
			}
			});*/
}

$(function(){
var nav    = $('.topNavi'),
offset = nav.offset();
$(window).scroll(function () {
  if($(window).scrollTop() > offset.top) {
    nav.addClass('fixed');
  } else {
    nav.removeClass('fixed');
  }
});
});