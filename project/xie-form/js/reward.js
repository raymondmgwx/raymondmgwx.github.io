var reward_count = 1;

function insert_reward_info(user_name, reward_name, reward_number, status, order_number, sysid, fee, r_sysid) {
    var reward_item = document.createElement('tr');
    reward_item.className = 'info';
    reward_item.innerHTML = "<td>" + reward_count +
        "</td><td>" + user_name +
        "</td><td>" + reward_name +
        "</td><td>" + reward_number +
        "</td><td>" + status +
        "</td><td>" + order_number +
        "</td><td>" + fee +
        "</td><td>" + r_sysid +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#delete-modal-reward' data-id=" + sysid + " data-name=" + reward_name + " data-sysid=" + r_sysid + ">删除</button>" +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#edit-modal-reward' data-id=" + sysid + " data-name=" + reward_name + " data-number=" + reward_number + " data-status=" + status + " data-order_number=" + order_number + " data-fee=" + fee + " data-sysid=" + r_sysid + ">修改</button></td>";
    $("#reward_list_table").append(reward_item);
    reward_count += 1;
}

function load_reward_info() {
    $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {

        var reward_list = data['reward_list'];
        var user_info = data['user_info'];

        reward_list.forEach(element => {
            var sysid = element['user_systemid'];
            var user_name = 'none';
            user_info.forEach(element_user => {
                if (element_user['systemid'] == sysid) {
                    user_name = element_user['id'];
                }
            });


            var reward_name = element['reward_name'];
            var reward_number = element['reward_number'];
            var reward_sysid = element['reward_sysid'] != null ? element['reward_sysid'] : 'None';
            var order_number = element['order_number'] != null ? element['order_number'] : '无订单号';
            var fee = element['fee'] != null ? element['fee'] : '未设置运费';
            var status = element['status'] != null ? element['status'] : '未发货';

            if (status == '已发货') {
                insert_reward_info(user_name, reward_name, reward_number, status, order_number, sysid, fee, reward_sysid);
            }

        });
    });
}



$(function() {

    load_reward_info();
});