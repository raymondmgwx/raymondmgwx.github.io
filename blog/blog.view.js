//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Blog                  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 09, 18, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

WRE.view._init = function() {
    var initView = new $.Deferred();
    console.log('Initiating view...');
    var engineView = WRE.view['_' + WRE.config.viewEngine.toLowerCase()]._view;
    for (var a in engineView) {
        this[a] = engineView[a];
    }
    WRE.view._init(function() {
        console.log("View initiation completed.");
        initView.resolve("View initiation completed.");
    });
    return initView;
};


WRE.view._build = function(callback) {
    callback();
}