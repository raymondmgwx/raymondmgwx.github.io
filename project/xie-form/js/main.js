$(function() {

    //create login json file
    //https://api.myjson.com/bins/jpfbv
	//https://api.myjson.com/bins/14ctu5
    /*$.ajax({
        url: "https://api.myjson.com/bins",
        type: "POST",
        data: '{' +
			'"allow": true,'+
			'"recentloginTime": "2018/01/16"'+
			'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            console.log(data);
        }
    });*/

    $('#btn_login').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var login_info = data['login'];
            login_info.forEach(element => {
                var acc = element['acc'];
                var pwd = element['pwd'];
                if ($('#acc').val() == acc && $('#pwd').val() == pwd) {
                    console.log('success');
                    self.location = './index.html';
                }
            });
        });
    });

});