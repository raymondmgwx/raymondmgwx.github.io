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


WRE.view._webgl._view._init = function(callback) {


    fetchWebGLInfo(function() {
        callback();
    });

    function fetchWebGLInfo(callback) {

        var result = {};
        if (getReqQuery().e == null) {
            //alert("required project name（'e=ProjectName'）");
            location.href = "https://raymondmgwx.github.io/?e=imvc_lab_project&&theme=Image-Visual-Lab";
            return
        } else {
            WRE.view._webgl._projectFile += getReqQuery().e + "/" + getReqQuery().e;
            WRE.view._webgl._projectName = getReqQuery().e;
            WRE.view._webgl._projectRootPath = WRE.view._webgl._projectFile;
        }

        $.when(
            AjaxFile(WRE.view._webgl._projectRootPath + '.html', 'html')
        ).then(function(canvasHtml) {


            if (WRE.ui.elements["webgl"] != null) {
                WRE.ui.elements["webgl"].dom.innerHTML = canvasHtml;
                console.log('detected webgl dom!');
            } else {
                console.log('not detected webgl dom!');
            }


            $("head").append('<script type="text/javascript" src="' + WRE.view._webgl._projectRootPath + '.js" charset="utf-8"></script>');

            console.log("loaded project " + WRE.view._webgl._projectName + "  current time:" + new Date().getTime());
            callback();
        });
    }
};
