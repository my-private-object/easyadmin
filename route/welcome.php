<?php
use think\facade\Route;

Route::view('/', 'welcome', [
    'version' => time(),
    'data'    => [
        'description'        => '基于ThinkPHP6.0和Layui的快后台管理系统',
        'system_description' => '框架主要使用ThinkPHP6.0 + layui',
    ],
    'navbar'  => [
        [
            'name'   => '首页',
            'active' => true,
            'href'   => '*************',
            'target' => '_self',
        ],
        [
            'name'   => '首页',
            'active' => false,
            'href'   => '*************',
            'target' => '_blank',
        ],
        [
            'name'   => '首页',
            'active' => false,
            'href'   => '*************',
            'target' => '_blank',
        ],
        [
            'name'   => '首页',
            'active' => false,
            'href'   => '*************',
            'target' => '_blank',
        ],
    ],
    'feature' => [
        [
            'name'        => '*************',
            'description' => '*************',
        ],
        [
            'name'        => '*************',
            'description' => '*************',
        ],
        [
            'name'        => '*************',
            'description' => '*************',
        ],
        [
            'name'        => '*************',
            'description' => '*************',
        ],
         [
            'name'        => '*************',
            'description' => '*************',
        ],
        [
            'name'        => '*************',
            'description' => '*************',
        ],
    ],
]);