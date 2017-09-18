//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Blog                  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 09, 18, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

WRE.runtime._init = function() {
    getPlatform(function(detectedPlatform) {
        WRE.runtime.platform = detectedPlatform;
        console.log("Platform detected as: " + WRE.runtime.platform);
        WRE.runtime.browser = getBrowser();
        WRE.runtime.contentWidth = WRE.config.contentWidth;
        WRE.runtime.contentHeight = WRE.config.contentHeight;

    });


    function getBrowser() {
        var browser = {
            name: "Chrome",
            windowWidth: $(window).width(),
            windowHeight: $(window).height(),
        };

        return browser;

    }

    function getPlatform(callback) {
        var detectedPlatform = "Chrome";

        callback(detectedPlatform);
    }


};


WRE.runtime.currentViewScale = 1;
WRE.runtime.currentViewHeight = WRE.config.contentHeight;
WRE.runtime.currentViewWidth = WRE.config.contentWidth;