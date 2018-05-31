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
        var API_URL = "http://api.e-stat.go.jp/rest/2.0t/app/json/getStatsData";
        var statsDataId = statIds;

        var GET_URL = API_URL;
        GET_URL += "?appId=" + escape(APP_ID);
        GET_URL += "&statsDataId=" + escape(statsDataId);
        $.ajax({
            url: GET_URL,
            type: 'POST'
        }).done((data) => {
            console.log(data);
        })
    }
    loading();
}