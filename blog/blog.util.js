//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Blog                  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 09, 18, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                //console.log(url + " loaded.");
                callback();
            }
        };
    } else {
        script.onload = function() {
            //console.log(url + " loaded.");
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


function loadMultipleScripts(urlArray, callback) {
    // /console.log(urlArray.length);
    var counter = urlArray.length;
    for (var i = 0; i < urlArray.length; i++) {

        loadScript(urlArray[i], function() {

            counter = counter - 1;
            if (counter == 0) {
                callback();
            }
        });
    }
}


function AjaxFile(url, dataType, callback) {
    var call = jQuery.ajax({
        url: url,
        dataType: dataType,
        //success: function(){callback();},
        async: true
    });
    call.done(function(data, textStatus, jqXHR) {
        //console.log(url + " loaded. Code "+jqXHR.status);
    });
    call.fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    });
    return call;
}


function getReqQuery() {
    if (window.location.href.split('?').length == 1) {
        return {};
    }
    var queryString = window.location.href.split('?')[1];

    var queryObj = {};

    if (queryString != '') {
        var querys = queryString.split("&");
        for (var i = 0; i < querys.length; i++) {
            var key = querys[i].split('=')[0];
            var value = querys[i].split('=')[1];
            queryObj[key] = value;
        }
    }
    //var queryObj = $.url().param();
    //console.log(queryObj);
    return queryObj;
}