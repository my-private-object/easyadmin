    define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'guji.admin/index',
        add_url: 'guji.admin/add',
        edit_url: 'guji.admin/edit',
        delete_url: 'guji.admin/delete',
        modify_url: 'guji.admin/modify',
        export_url: 'guji.admin/export',
        password_url: 'guji.admin/password',
    };

    var Controller = {

        index: function () {

            ea.table.render({
                init: init,
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID'},
                    // {field: 'sort', width: 80, title: '排序', edit: 'text'},
                    {field: 'username', minWidth: 80, title: '登录账户'},
                    // {field: 'head_img', minWidth: 80, title: '头像', search: false, templet: ea.table.image},
                    // {field: 'phone', minWidth: 80, title: '手机'},
                    {field: 'is_ip', minWidth: 80, title: '是否IP控制'},
                    {field: 'start_ip', minWidth: 80, title: '起始IP'},
                    {field: 'end_ip', minWidth: 80, title: '结束IP'},
                    {field: 'start_time', minWidth: 80, title: '起始日期'},
                    {field: 'end_time', minWidth: 80, title: '结束日期'},
                    {field: 'is_cate', minWidth: 80, title: '类别ID'},
                    {field: 'is_cate_name', minWidth: 80, title: '类别名称'},
                    {field: 'login_num', minWidth: 80, title: '登录次数'},
                    {field: 'remark', minWidth: 80, title: '备注信息'},
                    // {field: 'status', title: '状态', width: 85, search: 'select', selectList: {0: '禁用', 1: '启用'}, templet: ea.table.switch},
                    // {field: 'create_time', minWidth: 80, title: '创建时间', search: 'range'},
                    {
                        width: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        operat: [
                            'edit',
                            [{
                                text: '设置密码',
                                url: init.password_url,
                                method: 'open',
                                auth: 'password',
                                class: 'layui-btn layui-btn-normal layui-btn-xs',
                            }],
                            'delete'
                        ]
                    }
                ]],
            });

            ea.listen();
        },
        add: function () {
            ea.listen();
        },
        edit: function () {
            ea.listen();
        },
        password: function () {
            ea.listen();
        }
    };
    return Controller;
});