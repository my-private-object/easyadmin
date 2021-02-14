define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'guji.books/index',
        add_url: 'guji.books/add',
        edit_url: 'guji.books/edit',
        delete_url: 'guji.books/delete',
        export_url: 'guji.books/export',
        modify_url: 'guji.books/modify',
        stock_url: 'guji.books/stock',
    };

    var Controller = {

        index: function () {
            ea.table.render({
                init: init,
                toolbar: ['refresh',
                    [{
                        text: '添加',
                        url: init.add_url,
                        method: 'open',
                        auth: 'add',
                        class: 'layui-btn layui-btn-normal layui-btn-sm',
                        icon: 'fa fa-plus ',
                        extend: 'data-full="true"',
                    }],
                    'delete', 'export'],
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID'},
                    // {field: 'sort', width: 80, title: '排序', edit: 'text'},
                    {field: 'cate.title', minWidth: 100, title: '资料分类'},
                    {field: 'catehigh.title', minWidth: 100, title: '学科分类'},
                    {field: 'catehightwo.title', minWidth: 100, title: '学科二级分类'},
                    {field: 'title', minWidth: 100, title: '资料名称'},
                    // {field: 'logo', minWidth: 80, title: '商品图片', search: false, templet: ea.table.image},
                    // {field: 'market_price', width: 100, title: '市场价', templet: ea.table.price},
                    // {field: 'discount_price', width: 100, title: '折扣价', templet: ea.table.price},
                    // {field: 'total_stock', width: 100, title: '库存统计'},
                    // {field: 'stock', width: 100, title: '剩余库存'},
                    // {field: 'virtual_sales', width: 100, title: '虚拟销量'},
                    // {field: 'sales', width: 80, title: '销量'},
                    // {field: 'status', title: '状态', width: 85, selectList: {0: '禁用', 1: '启用'}, templet: ea.table.switch},
                    {field: 'create_time', minWidth: 80, title: '创建时间', search: 'range'},
                    {
                        width: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        operat: [
                            [{
                                text: '编辑',
                                url: init.edit_url,
                                method: 'open',
                                auth: 'edit',
                                class: 'layui-btn layui-btn-xs layui-btn-success',
                                extend: 'data-full="true"',
                            }, 
                            // {
                            //     text: '入库',
                            //     url: init.stock_url,
                            //     method: 'open',
                            //     auth: 'stock',
                            //     class: 'layui-btn layui-btn-xs layui-btn-normal',
                            // }
                            ],
                            'delete']
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
        stock: function () {
            ea.listen();
        },
    };
    return Controller;
});