function App() {
    this.appId = "22354c16f08ca03a198de07844782f5f47f5f59c";
    this.statIds = "0003211000";
}
App.prototype = {

};

function initData() {}
initData.data_load = function() {
    var app = new App();
    var appId = app.appId;
    var statIds = app.statIds;



    var loading = function(d) {
        var APP_ID = appId;
        var API_URL = "https://api.e-stat.go.jp/rest/2.1/app/json/getStatsDatas";
        var statsDataId = statIds;

        var GET_URL = API_URL;
        GET_URL += "?appId=" + escape(APP_ID);
        GET_URL += "&statsDataId=" + escape(statsDataId);
        $.getJSON(GET_URL, function(jsonData) {})
            .success(function(jsonData) {
                console.log(jsonData);
            })
    }
    loading();
}