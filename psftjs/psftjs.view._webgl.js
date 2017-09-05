//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 4, 16, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->


WRE.view._webgl = {
    _projectName: 'WRE',
    _projectFile: './project/',
    _loadScript: '',
    _view: {},
};


WRE.view._webgl._view._init = function (callback) {


    fetchWebGLInfo(function () {
        callback();
    });

    function fetchWebGLInfo(callback) {

        var result = {};
        if (getReqQuery().e == null) {
            alert("required project name（'e=ProjectName'）");
            return
        } else {
            WRE.view._webgl._projectFile += getReqQuery().e+"/"+getReqQuery().e;
            WRE.view._webgl._projectName = getReqQuery().e;
            WRE.view._webgl._projectRootPath = WRE.view._webgl._projectFile + '.js';
        }
        
        $.when(
            AjaxFile(WRE.view._webgl._projectRootPath + '.html', 'html')
        ).then(function (canvasHtml) {
            WRE.ui.elements["webgl"].dom.innerHTML = canvasHtml;

            //$("head").append('<script type="text/javascript" src="' + WRE.view._webgl._projectRootPath + '.js" charset="utf-8"></script>');
            loadScript(loc + WRE.view._webgl._projectRootPath , function () {
                console.log("loaded project " + WRE.view._webgl._projectName + "  current time:" + new Date().getTime());
            });

           
            callback();
        });


        function loadScript(url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        //console.log(url + " loaded.");
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    //console.log(url + " loaded.");
                    callback();
                };
            }
            //script.src = url;
            script.src = url+ '?' + new Date().getTime();
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    }
};