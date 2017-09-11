//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 4, 16, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->


WRE.ui = {
    uiMode: 'default',
    elements: {}
};

WRE.ui._init = function() {
    console.log("Initiating UI...");
    var initUI = new $.Deferred();
    setUIMode();
    loadTheme(function() {
        //processElements();
        console.log("UI initialized.");
        initUI.resolve("UI initiation completed.");
    });
    return initUI;


    function setUIMode() {


        WRE.ui.uiMode = "default";


        console.log("ui.uiMode set to " + WRE.ui.uiMode + ".");
    }

    function loadTheme(callback) {
        $.when(
            AjaxFile(WRE.runtime.scriptLocation + "/theme/" + WRE.config.theme + "/" + WRE.ui.uiMode + ".html", 'html'),
            $("head").append('<script type="text/javascript" src="' + WRE.runtime.scriptLocation + '/theme/' + WRE.config.theme + '/js/wre.ui.' + WRE.ui.uiMode + '.js" charset="utf-8"></script>'),
            $("head").append('<link rel="stylesheet" type="text/css" href="' + WRE.runtime.scriptLocation + '/theme/' + WRE.config.theme + '/css/' + WRE.ui.uiMode + '.css" />'),
            $("head").append('<link rel="stylesheet" type="text/css" href="' + WRE.runtime.scriptLocation + '/theme/' + WRE.config.theme + '/css/bootstrap.min.css" />'),
            $("head").append('<link rel="stylesheet" type="text/css" href="' + WRE.runtime.scriptLocation + '/theme/' + WRE.config.theme + '/css/bootstrap-slider.min.css" />')
            //$("head").append('<link rel="stylesheet" type="text/css" href="' + WRE.runtime.scriptLocation + '/theme/' + WRE.config.theme + '/css/jquery.jqplot.min.css" />')
        ).then(function(wreHtml) {

            //create html
            var dom = document.createElement('div');
            dom.innerHTML = wreHtml;
            dom = dom.firstChild;

            document.body.appendChild(dom);

            parseElements();

            callback();
        });


        function parseElements() {
            var elements = document.querySelectorAll('[id^=wre_ui_]');
            for (var i = 0; i < elements.length; i++) {
                var name = elements[i].getAttribute('id').replace('wre_ui_', '');
                WRE.ui.elements[name] = {};
                WRE.ui.elements[name].dom = elements[i];
            }

        }


    }


};

WRE.ui._build = function(callback) {
    callback();
};