var exist_user_count = 1;
var reward_count = 1;

$('#cur_user_reward_name').attr("readonly", true);
$('#cur_user_reward_number').attr("readonly", true);
$('#cur_user_reward').attr("disabled", "true");

function reset_database() {
    $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
        var cur_json_info = data;


        cur_json_info['user_info'] = new Array();
        cur_json_info['reward_list'] = new Array();

        var json_info = JSON.stringify(cur_json_info);
        $.ajax({
            url: "https://api.myjson.com/bins/jpfbv",
            type: "PUT",
            data: json_info,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data, textStatus, jqXHR) {
                console.log(JSON.stringify(data));
                alert('清空数据库成功！');
            }
        });
    });
}

function insert_user_info(id, phone, address, sysid) {
    var exist_user_item = document.createElement('tr');
    exist_user_item.className = 'info';
    exist_user_item.innerHTML = "<td>" + exist_user_count +
        "</td><td>" + id +
        "</td><td>" + phone +
        "</td><td>" + address +
        "</td><td>" + sysid +
        "</td>";
    $("#exist_user_table").append(exist_user_item);
    exist_user_count += 1;
}

function insert_reward_info(reward_name, reward_number, status, order_number, reward_sysid) {
    var reward_item = document.createElement('tr');
    reward_item.className = 'info';
    reward_item.innerHTML = "<td>" + reward_count +
        "</td><td>" + reward_name +
        "</td><td>" + reward_number +
        "</td><td>" + status +
        "</td><td>" + order_number +
        "</td><td>" + reward_sysid +
        "</td>";
    $("#reward_list_table").append(reward_item);
    reward_count += 1;
}





$(function() {

    //update json file
    //https://api.myjson.com/bins/jpfbv
    /*$.ajax({
        url: "https://api.myjson.com/bins/jpfbv",
        type: "PUT",
        data: '{"login":[{"acc":"admin","pwd":"admin"},{"acc":"adminw","pwd":"adminw"}],"user_info":[{"id":"abc","phone":123332312,"adress":"xian","systemid":"xsb1"}],"reward_list":[{"user_systemid":"xsb1","reward_name":"aaaa","reward_number":10}]}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            var json = JSON.stringify(data);
            console.log(json);
        }
    });*/

    //reset_database();
    $('#new_user_reward').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var user_info = cur_json_info['user_info'];
            var reward_list = cur_json_info['reward_list'];

            var check_same = false;
            //check
            user_info.forEach(element => {
                var id = element['id'];
                var phone = element['phone'];

                if (!check_same) {
                    if ($('#new_user_id').val() == id && $('#new_user_phone').val() == phone) {
                        alert('重复ID以及电话！！');
                        check_same = true;
                        return;
                    } else if ($('#new_user_id').val() == id) {
                        alert('重复ID！！');
                        check_same = true;
                        return;
                    } else if ($('#new_user_phone').val() == phone) {
                        alert('重复电话！！');
                        check_same = true;
                        return;
                    }
                }


            });

            if (!check_same) {
                var cur_length = user_info.length;
                var new_user_info = new Object();
                var new_reward_info = new Object();

                new_user_info['id'] = $('#new_user_id').val();
                new_user_info['phone'] = $('#new_user_phone').val();
                new_user_info['address'] = $('#new_user_address').val();
                new_user_info['systemid'] = 'xsb' + (cur_json_info['curmaxnum'] + 1);
                cur_json_info['curmaxnum'] += 1;

                new_reward_info['user_systemid'] = new_user_info['systemid'];
                new_reward_info['reward_name'] = $('#new_user_reward_name').val();
                new_reward_info['reward_number'] = $('#new_user_reward_number').val();
                new_reward_info['status'] = '未发货';
                new_reward_info['order_number'] = '无订单号';

                new_reward_info['reward_sysid'] = 'rw' + cur_json_info['reward_curmaxnum'];
                cur_json_info['reward_curmaxnum'] += 1;

                user_info.push(new_user_info);
                reward_list.push(new_reward_info);

                var json_info = JSON.stringify(cur_json_info);
                $.ajax({
                    url: "https://api.myjson.com/bins/jpfbv",
                    type: "PUT",
                    data: json_info,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data, textStatus, jqXHR) {
                        alert('录入新用户成功');
                        self.location = self.location;
                    }
                });
            }
        });

    });

    $('#cur_user_reward').click(function() {
        //console.log('success!!');
        var cur_user_sysid = $('#cur_user_sysid').val();
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var reward_list = cur_json_info['reward_list'];
            var new_reward_info = new Object();


            new_reward_info['user_systemid'] = cur_user_sysid;
            new_reward_info['reward_name'] = $('#cur_user_reward_name').val();
            new_reward_info['reward_number'] = $('#cur_user_reward_number').val();
            new_reward_info['status'] = '未发货';
            new_reward_info['order_number'] = '无订单号';

            new_reward_info['reward_sysid'] = 'rw' + cur_json_info['reward_curmaxnum'];
            cur_json_info['reward_curmaxnum'] += 1;

            reward_list.push(new_reward_info);

            var json_info = JSON.stringify(cur_json_info);
            $.ajax({
                url: "https://api.myjson.com/bins/jpfbv",
                type: "PUT",
                data: json_info,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    alert('录入当前用户奖品成功！');
                    self.location = self.location;
                }
            });
        });
    });

    $('#search_exist_user').click(function() {
        $("#exist_user_table").children().remove();
        $("#reward_list_table").children().remove();
        exist_user_count = 1;
        reward_count = 1;
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            //var json = JSON.stringify(data);
            //console.log(json);
            var user_info = data['user_info'];
            var find_user = false;
            var cur_user_sys_id = 0;
            user_info.forEach(element => {
                var id = element['id'];
                var phone = element['phone'];
                var address = element['address'];
                var systemid = element['systemid'];

                if ($('#search_id').val() == id && $('#search_phone').val() == phone) {
                    cur_user_sys_id = systemid;
                    find_user = true;
                    insert_user_info(id, phone, address, systemid);
                } else if ($('#search_id').val() == id) {
                    cur_user_sys_id = systemid;
                    find_user = true;
                    insert_user_info(id, phone, address, systemid);
                } else if ($('#search_phone').val() == phone) {
                    cur_user_sys_id = systemid;
                    find_user = true;
                    insert_user_info(id, phone, address, systemid);
                }


            });

            if (find_user) {
                var reward_list = data['reward_list'];
                reward_list.forEach(element => {
                    var user_systemid = element['user_systemid'];

                    if (cur_user_sys_id == user_systemid) {
                        var reward_name = element['reward_name'];
                        var reward_number = element['reward_number'];
                        var status = element['status'] != null ? element['status'] : '未发货';
                        var order_number = element['order_number'] != null ? element['order_number'] : '无订单号';
                        var reward_sysid = element['reward_sysid'] != null ? element['reward_sysid'] : 'None';
                        $('#cur_user_sysid').val(user_systemid);
                        insert_reward_info(reward_name, reward_number, status, order_number, reward_sysid);
                    }
                });

                $('#cur_user_reward_name').attr("readonly", false);
                $('#cur_user_reward_number').attr("readonly", false);
                $('#cur_user_reward').attr("disabled", false);

            } else {
                $('#cur_user_reward').attr("disabled", "true");
                $('#cur_user_reward_name').attr("readonly", true);
                $('#cur_user_reward_number').attr("readonly", true);
                alert('没有找到该用户!');
            }

        });
    });


});