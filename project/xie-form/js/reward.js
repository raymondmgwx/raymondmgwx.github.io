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
    $('#delete-modal-reward').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var name = button.data('name');
        var sysid = button.data('sysid');
        var modal = $(this);

        modal.find('#user_id_reward').val(id);
        modal.find('#reward_name').val(name);
        modal.find('#reward_sysid').val(sysid);
    });

    $('#edit-modal-reward').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var name = button.data('name');
        var number = button.data('number');
        var status = button.data('status');
        var order_number = button.data('order_number');
        var sysid = button.data('sysid');
        var fee = button.data('fee');
        var modal = $(this);

        modal.find('#e_r_sysid').val(id);
        modal.find('#e_r_name').val(name);
        modal.find('#e_r_number').val(number);
        modal.find('#e_r_status').val(status);
        modal.find('#e_r_order').val(order_number);
        modal.find('#e_r_fee').val(fee);
        modal.find('#e_r_r_sysid').val(sysid);

    });

    $('#btn_delete_reward').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var reward_list = cur_json_info['reward_list'];
            var del_index = 0;
            var count = 0;
            reward_list.forEach(element => {
                if (element['reward_sysid'] == $('#reward_sysid').val()) {
                    del_index = count;
                }
                count += 1;
            });

            reward_list.splice(del_index, 1);

            var json_info = JSON.stringify(cur_json_info);
            $.ajax({
                url: "https://api.myjson.com/bins/jpfbv",
                type: "PUT",
                data: json_info,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    alert('删除奖品信息成功');
                    self.location = self.location;
                }
            });
        });
    });

    $('#btn_edit_reward').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var reward_list = cur_json_info['reward_list'];

            reward_list.forEach(element => {
                if (element['reward_sysid'] == $('#e_r_r_sysid').val()) {
                    element['reward_name'] = $('#e_r_name').val();
                    element['reward_number'] = $('#e_r_number').val();
                    element['status'] = $('#e_r_status').val();
                    element['order_number'] = $('#e_r_order').val();
                    element['fee'] = $('#e_r_fee').val();
                }
            });



            var json_info = JSON.stringify(cur_json_info);
            $.ajax({
                url: "https://api.myjson.com/bins/jpfbv",
                type: "PUT",
                data: json_info,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    alert('修改奖品成功!!!');
                    self.location = self.location;
                }
            });
        });
    });
});