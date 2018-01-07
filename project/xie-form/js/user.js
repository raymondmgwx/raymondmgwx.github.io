var exist_user_count = 1;
var reward_count = 1;


function insert_user_info(id, phone, address, sysid) {
    var exist_user_item = document.createElement('tr');
    exist_user_item.innerHTML = "<td>" + exist_user_count +
        "</td><td>" + id +
        "</td><td>" + phone +
        "</td><td>" + address +
        "</td><td>" + sysid +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#delete-modal' data-id=" + id + ">删除</button>" +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#edit-modal' data-id=" + id + " data-phone=" + phone + " data-address=" + address + " data-sysid=" + sysid + ">修改</button></td>";
    $("#exist_user_table").append(exist_user_item);
    exist_user_count += 1;
}


function insert_reward_info(user_name, reward_name, reward_number, status, order_number, sysid, r_sysid) {
    var reward_item = document.createElement('tr');
    reward_item.className = 'info';
    reward_item.innerHTML = "<td>" + reward_count +
        "</td><td>" + user_name +
        "</td><td>" + reward_name +
        "</td><td>" + reward_number +
        "</td><td>" + status +
        "</td><td>" + order_number +
        "</td><td>" + r_sysid +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#delete-modal-reward' data-id=" + sysid + " data-name=" + reward_name + " data-sysid=" + r_sysid + ">删除</button>" +
        "</td><td><button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#edit-modal-reward' data-id=" + sysid + " data-name=" + reward_name + " data-number=" + reward_number + " data-status=" + status + " data-order_number=" + order_number + " data-sysid=" + r_sysid + ">修改</button></td>";
    $("#reward_list_table").append(reward_item);
    reward_count += 1;
}

function load_user_info() {
    $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {

        var user_info = data['user_info'];

        user_info.forEach(element => {
            var id = element['id'];
            var phone = element['phone'];
            var address = element['address'];
            var systemid = element['systemid'];
            insert_user_info(id, phone, address, systemid);
        });
    });
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
            var status = element['status'] != null ? element['status'] : '未发货';
            insert_reward_info(user_name, reward_name, reward_number, status, order_number, sysid, reward_sysid);
        });
    });
}



$(function() {

    load_user_info();
    load_reward_info();

    $('#delete-modal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var modal = $(this);

        modal.find('#uid').val(id);
    });

    $('#edit-modal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var phone = button.data('phone');
        var address = button.data('address');
        var sysid = button.data('sysid');
        var modal = $(this);

        modal.find('#e_uid').val(id);
        modal.find('#e_phone').val(phone);
        modal.find('#e_address').val(address);
        modal.find('#e_sysid').val(sysid);
    });

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
        var modal = $(this);

        modal.find('#e_r_sysid').val(id);
        modal.find('#e_r_name').val(name);
        modal.find('#e_r_number').val(number);
        modal.find('#e_r_status').val(status);
        modal.find('#e_r_order').val(order_number);
        modal.find('#e_r_r_sysid').val(sysid);

    });

    $('#btn_edit_user').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var user_info = cur_json_info['user_info'];

            user_info.forEach(element => {
                if (element['systemid'] == $('#e_sysid').val()) {
                    element['id'] = $('#e_uid').val();
                    element['phone'] = $('#e_phone').val();
                    element['address'] = $('#e_address').val();
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
                    alert('修改用户成功');
                    self.location = self.location;
                }
            });
        });
    });

    $('#btn_delete_user').click(function() {
        $.get("https://api.myjson.com/bins/jpfbv", function(data, textStatus, jqXHR) {
            var cur_json_info = data;
            var user_info = cur_json_info['user_info'];
            var reward_list = cur_json_info['reward_list'];



            var del_index = 0;
            var count = 0;
            user_info.forEach(element => {
                if (element['id'] == $('#uid').val()) {
                    del_index = count;
                    var del_r_index = new Array();
                    var r_count = 0;

                    reward_list.forEach(elementr => {
                        if (elementr['user_systemid'] == element['systemid']) {
                            del_r_index.push(r_count);
                        }
                        r_count += 1;
                    });

                    del_r_index = del_r_index.reverse();

                    del_r_index.forEach(elementr => {
                        reward_list.splice(elementr, 1);
                    });
                }
                count += 1;
            });

            user_info.splice(del_index, 1);

            var json_info = JSON.stringify(cur_json_info);
            $.ajax({
                url: "https://api.myjson.com/bins/jpfbv",
                type: "PUT",
                data: json_info,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    alert('删除用户成功');
                    self.location = self.location;
                }
            });
        });
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