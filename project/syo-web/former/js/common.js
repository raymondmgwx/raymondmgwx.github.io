$(function() {
	
	$('li span').click(function() {
	 $(this).next().slideToggle(); 
});
	
	$('.icons li.imap').click(function() {
		if ($('.icons li.imap').is('.active')) {
			$('.mapIllust').removeClass('on');
			$('.icons li.imap').removeClass('active');
		} else {
			$('.mapIllust').addClass('on');
			$('.icons li.imap').addClass('active');
		}
	});
});
$.fn.boxCenter = function() {
	return this.each(function(i){
		var w = $(this).width(); //画像の幅
		var h = $(this).height(); //画像の高さ
		var mtop = (h/2)*(-1); //画像の高さの半分のマイナス値
		var mleft = (w/2)*(-1); //画像の幅の半分のマイナス値
		$(this).css({"width": + w + "px" ,"height": + h + "px" , "top": "50%" , "left": "50%" , "margin-top": + mtop + "px" , "margin-left": + mleft+ "px"});
		//自分（.box img）のcssプロパティを変更
	});
};

window.onload = function () {
		var myPromise = $.when(
			setSize()
		);
		myPromise.done(function () {	
			$(".mapIllust .pict").boxCenter();
			
		});
}
$(function () {
	$(window).on('resize', function () {
		setSize();
		$(".mapIllust .pict").boxCenter();
	});
});

function setSize() {
	//画像サイズ指定
	var winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var winWt = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var scrT = (winH-180)/4;
	var scrL = (winWt-140)/4;
	
	
	if(winWt>768){
		$('.mapIllust .pict').css({
			'max-height':1082,
			'max-width':1490,
			'width':  winWt - 140,
			'height': winH - 200
		});
	}else{
		$('.mapIllust .pict').css({
			'max-height':1082,
			'max-width':1490,
			'width':  winWt - 40,
			'height': winH - 40
		});
	}
	
	
	$(".mapIllust .pict .dragscroll").scrollTop(scrT);
$(".mapIllust .pict .dragscroll").scrollLeft(scrL);
}


$('.DSbtn').click(function () {
	if ($('.DSbtn').is('.action')) {
		
		$("nav.spNavi").animate({opacity: "0"}, 500, function() {
            $(this).css({display: "none"});
			$("nav.spNavi .spNavi_box").css({opacity: "0"});
		});
		$("body").off('.noScroll');
		$('.DSbtn').removeClass('action');
	
	
	} else {
		
	$("nav.spNavi").css({display: "block",opacity: "0"}).animate({opacity: "1"}, 300, function() {
	 $("nav.spNavi .spNavi_box").animate({ opacity: "1"}, 500, "swing");
});
	$('.DSbtn').addClass('action');
	$("body").on('touchmove.noScroll', function(e) {
    e.preventDefault();
});	
		
	}
});