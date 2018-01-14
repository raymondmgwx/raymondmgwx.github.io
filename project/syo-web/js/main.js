	var contentWayPoint = function() {
	    var i = 0;
	    $('.animate-box').waypoint(function(direction) {

	        if (direction === 'down' && !$(this.element).hasClass('animated')) {

	            i++;

	            $(this.element).addClass('item-animate');
	            setTimeout(function() {

	                $('body .animate-box.item-animate').each(function(k) {
	                    var el = $(this);
	                    setTimeout(function() {
	                        el.addClass('fadeInUp animated');
	                        el.removeClass('item-animate');
	                    }, k * 50, 'easeInOutExpo');
	                });

	            }, 100);

	        }

	    }, { offset: '85%' });
	};

	function create_svg() {
	    var g = Snap();
	}

	function svg_file() {
	    skrollr.init({
	        forceHeight: false,
	        edgeStrategy: 'set',
	        easing: {
	            WTF: Math.random,
	            inverted: function(p) {
	                return 1 - p;
	            }
	        }
	    });
	}

	function disableScroll(elem) {
	    if (elem === undefined) elem = window;
	    var
	        $node = document.ownerDocument ? $(elem) : $("body");
	    pos = {
	        x: $(elem).scrollLeft(),
	        y: $(elem).scrollTop()
	    };
	    $node.css("overflow", "hidden");
	    $(elem).on("scroll.PREVENT", function(e) {
	        $(elem).scrollLeft(pos.x);
	        $(elem).scrollTop(pos.y);
	        e.stopPropagation();
	    });
	}

	function enableScroll(elem) {
	    if (elem === undefined) elem = window;
	    var $node = document.ownerDocument ? $(elem) : $("body");
	    $node.css("overflow", "");
	    $(elem).off("scroll.PREVENT");
	}

	function suit_browser_size() {
	    //console.log(window.screen.height);
	    $('.autofix').css('height', window.screen.height);
	}


	$(document).ready(function() {
	    suit_browser_size();
	    svg_file();
	    contentWayPoint();
	    // store initial HTML of code
	    $("a.viewsource").each(function() {
	        var
	            demoSelector = ".demowrap, section.demo:not(.demowrap .demo)",
	            $demoElements = $(demoSelector),
	            $relevantCode = $demoElements.length <= 1 ? $demoElements : $(this).parents(demoSelector + ", div#example-wrapper, body").first();
	        $(this).data("code", $relevantCode.clone());
	    });

	    // build sliders
	    $("div.slider+input")
	        .prop("disabled", true)
	        .on("change", function() {
	            $(this).prev().find(".handle").css("left", Math.round(($(this).val() - parseFloat($(this).attr("min"))) / (parseFloat($(this).attr("max")) - parseFloat($(this).attr("min"))) * 100) + "%");
	        })
	        .prev()
	        .append("<div class=\"trackbar\"></div>")
	        .append("<div class=\"handle\"></div>")
	        .end()
	        .change(); // trigger to init


	});

	$(document).on("click", "h1.badge", function(e) {
	    $.each(badges, function(key, badge) {
	        if ($(e.target).hasClass(key)) {
	            e.preventDefault();
	            window.open(badge.url, "_blank");
	            return;
	        }
	    });
	});


	// dragables / slider
	$(document).on("mousedown", ".slider, .move", function(e) {
	    if (e.which === 1) { // only left mouse button
	        var $this = $(this);
	        if ($this.is(".slider") || e.target == this) { // only the element itself,  not the children, unless its the slider
	            e.stopPropagation();
	            var
	                offset = $this.offset(),
	                drag = { top: offset.top - $(document).scrollTop(), left: offset.left - $(document).scrollLeft() };
	            if ($this.is(".move")) {
	                drag.top -= e.pageY;
	                drag.left -= e.pageX;
	            }
	            $this.data("drag", drag);
	            $this.addClass("dragging");
	            $("html").addClass("noselect");
	        }
	    }
	});

	$(document).on("mouseup mousemove", function(e) {
	    $(".move.dragging").each(function(f) {
	        var data = $(this).data("drag");
	        if (data) {
	            $(this).css({
	                top: data.top + e.pageY,
	                left: data.left + e.pageX
	            });
	        }
	    });
	    $(".slider.dragging").each(function(f) {
	        var data = $(this).data("drag");
	        if (data) {
	            var
	                pos = e.pageX - data.left,
	                width = $(this).width(),
	                $input = $(this).next("input"),
	                min = parseFloat($input.attr("min")) || 0,
	                max = parseFloat($input.attr("max")) || width,
	                step = 1 / parseFloat($input.attr("step")) || 1;
	            if (pos <= 0) {
	                pos = 0;
	            }
	            if (pos >= width) {
	                pos = width;
	            }
	            var
	                perc = pos / width,
	                val = (max - min) * perc + min,
	                decimals = Math.log(step) / Math.LN10;
	            // mind the step
	            val = Math.round(val * step) / step;
	            $(this).find(".handle").css("left", pos);

	            $input.val(val.toFixed(decimals));
	            if ($(this).hasClass("liveupdate")) {
	                $input.change();
	            }
	        }
	    });
	});

	$(document).on("mouseup", function(e) {
	    $(".slider.dragging + input").change(); // trigger change
	    $(".move.dragging, .slider.dragging")
	        .data("drag", null)
	        .removeClass("dragging");
	    $("html").removeClass("noselect");
	});

	$(document).on("orientationchange", function(e) {
	    if ($("#example-wrapper.horizontal").length > 0) {
	        $("meta[name='viewport']").attr("content", (window.orientation === 0 ? "width" : "height") + "=500");
	    }
	});
	$(document).trigger("orientationchange");



	$(function() {

	    var win_w = $(window).width();

	    $(window).resize(function() {
	        win_w = $(window).width();
	        //console.log('win_w = ' + win_w);
	    });

	    // 動画プレイヤー｜グローバル変数
	    var myPlayer;
	    var myPlayer_paused;
	    var myPlayer_box; // 動画表示領域
	    var myPlayer_obj; // 動画情報を格納するオブジェクト


	    //scrollMagic グローバル変数
	    var controller_top = new ScrollMagic.Controller({ //判定：要素が画面上端に到達
	        globalSceneOptions: {
	            triggerHook: 'onLeave'
	        }
	    });
	    var controller_mid = new ScrollMagic.Controller({ //判定：要素が画面中断に到達
	        globalSceneOptions: {
	            triggerHook: .55
	        }
	    });
	    var controller_bottom = new ScrollMagic.Controller({ //判定：要素が画面下端に到達
	        globalSceneOptions: {
	            triggerHook: .99
	        }
	    });

	    var fadeSpeed = 500;


	    function fnc_content1() {

	        var s1_photo_visible = 'true';

	        var s1_sceneTop_mid = new ScrollMagic.Scene({ triggerElement: '#s1_triggerTop' });
	        s1_sceneTop_mid.setVelocity('#s1_photoTop', { opacity: 1 }, {
	                duration: 500,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: function() {
	                    $('#sectionTop_cover').css({ 'display': 'none' });
	                    $('#sectionTop').css({ 'visibility': 'hidden' });
	                    $('#section1').css({ 'visibility': 'visible' });
	                    $('#section2').css({ 'visibility': 'hidden' });
	                    $('#section3').css({ 'visibility': 'hidden' });
	                    $('#section4').css({ 'visibility': 'hidden' });
	                },
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()//デバッガー
	            .addTo(controller_bottom);

	        var s1_sceneTop_bottom = new ScrollMagic.Scene({ triggerElement: '#s1_triggerBefore' });
	        s1_sceneTop_bottom.setVelocity('#s1_photoTop', { null: null }, {
	                duration: 0,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: function() {
	                    $('#sectionTop_cover').css({ 'display': 'block' });
	                    $('#sectionTop').css({ 'visibility': 'visible' });
	                    $('#section1').css({ 'visibility': 'hidden' });
	                    $('#section2').css({ 'visibility': 'hidden' });
	                    $('#section3').css({ 'visibility': 'hidden' });
	                    $('#section4').css({ 'visibility': 'hidden' });
	                    $('#header').toggleClass('bcWhite_alpha');
	                },
	                complete: undefined
	            })
	            //.addIndicators()
	            .addTo(controller_bottom);

	        var s1_scene1 = new ScrollMagic.Scene({ triggerElement: '#s1_trigger1' });
	        s1_scene1.setVelocity('#s1_photo1', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()
	            .addTo(controller_mid);

	        var s1_scene2 = new ScrollMagic.Scene({ triggerElement: '#s1_trigger2' });
	        s1_scene2.setVelocity('#s1_photo2', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()
	            .addTo(controller_mid);

	        var s1_scene3 = new ScrollMagic.Scene({ triggerElement: '#s1_trigger3' });
	        s1_scene3.setVelocity('#s1_photo3', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {}
	            })
	            //.addIndicators()
	            .addTo(controller_mid);
	        var s1_scene4 = new ScrollMagic.Scene({ triggerElement: '#s1_trigger4' });
	        s1_scene4.setVelocity('#s1_photo4', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {}
	            })
	            //.addIndicators()
	            .addTo(controller_mid);
	        var s1_scene5 = new ScrollMagic.Scene({ triggerElement: '#s1_trigger5' });
	        s1_scene5.setVelocity('#s1_photo5', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {}
	            })
	            //.addIndicators()
	            .addTo(controller_mid);
	        var s1_sceneBottom = new ScrollMagic.Scene({ triggerElement: '#s1_triggerBottom' });
	        s1_sceneBottom.setVelocity('#section1 .photo', { opacity: 0 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: undefined
	            })
	            //.addIndicators()
	            .addTo(controller_bottom);

	    } //fnc_content1()

	    fnc_content1();


	    function fnc_content2() {

	        var s2_sceneTop_mid = new ScrollMagic.Scene({ triggerElement: '#s2_triggerTop' });
	        s2_sceneTop_mid.setVelocity('#s2_photoTop', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: function() {
	                    $('#sectionTop').css({ 'visibility': 'hidden' });
	                    $('#section1').css({ 'visibility': 'hidden' });
	                    $('#section2').css({ 'visibility': 'visible' });
	                    $('#section3').css({ 'visibility': 'hidden' });
	                    $('#section4').css({ 'visibility': 'hidden' });
	                },
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()
	            .addTo(controller_bottom);



	        var s2_scene1 = new ScrollMagic.Scene({ triggerElement: '#s2_trigger1' });
	        s2_scene1.setVelocity('#s2_photo1', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()
	            .addTo(controller_mid);
	        var s2_scene2 = new ScrollMagic.Scene({ triggerElement: '#s2_trigger2' });
	        s2_scene2.setVelocity('#s2_photo2', { opacity: 1 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: function() {
	                    //$(this).find('.bg').css('transform','scale(1.04)');
	                }
	            })
	            //.addIndicators()
	            .addTo(controller_mid);

	        var s2_sceneBottom = new ScrollMagic.Scene({ triggerElement: '#s2_triggerBottom' });
	        s2_sceneBottom.setVelocity('#section2 .photo', { opacity: 0 }, {
	                duration: fadeSpeed,
	                delay: 0,
	                easing: 'linear',
	                mobileHA: true, //false:mobileOFF(default:true)
	                begin: undefined,
	                complete: undefined
	            })
	            //.addIndicators()
	            .addTo(controller_mid);

	    } //fnc_content2()

	    fnc_content2();

	});