<?php
namespace app\qian\controller\main;

use think\App;
use \think\facade\View;

class SidePage {

    // 第二列表页
    public function list($search_param = '') {

        $top_data = $this->topMenu();
        // $left_data = $this->leftMenu();
        $left_data = $this->newLeftMenu($top_data['top_cate']);

        // 判断是否是搜索页传过来的值
        if ( $search_param != '')
            $right_data = $search_param;
        else {
            $right_data = $this->rightMenu();
        }

        // var_dump($top_data);
        $data = array(
            'topData' => $top_data,
            'leftData' => $left_data,
            'rightData'  => $right_data
        );
        dump($data);
        return $data;

    }

    // 上部列表
    public function topMenu() {

        $GujiCate = new \app\admin\model\GujiCateHigh;
        $top_list = $GujiCate->where(['pid'=>'0'])->field(['id','title'])->order(['sort'=>'asc'])->select();


        $post = $_POST;

        // 判断是否有分类
        if ( !empty($post['top_cate']) && $post['top_cate'] != '') {
            $top_cate = $post['top_cate'];
        } else {
            $top_cate = '';
        }

        $data = array(
            'top_list' => $top_list,
            'top_cate' => $top_cate
        );
        // var_dump($top_cate);
        return $data;

    }




    // 新的左侧列表
    public function newLeftMenu($top_cate) {

        $post = $_POST;

        // 判断是否有选中二级或三级分类 并返回相应的分类ID
        if ( !empty($post['left_cate']) ) {
            $left_cate = array_filter($post['left_cate']);
            $left_cate = current($left_cate);
        } else {
            $left_cate = '';
        }
        dump($top_cate);

        // 判断是否有一级分类 - 没有则 暂时 返回 空
        if ( $top_cate == '' ) {
            return array(
                'left_list' => '',
                'left_cate' => $left_cate
            );
        }

        // 获取数据
        $GujiCateHigh = new \app\admin\model\GujiCateHigh;
        $list = $GujiCateHigh->field( array('id','pid','title') )->where(['pid'=>$top_cate])->select();
        $list_array = json_decode($list, true);

        foreach( $list_array as $key=>$value ) {
            $tmp_result = $GujiCateHigh->field( array('id','pid','title') )->where(['pid'=>$value['id']])->select();
            $list_array[$key][] = json_decode($tmp_result, true);
        }

        // 将分类中添加上已经被选择的标签，便于前端展示选中状态
        if ( $left_cate != '' ) {
            foreach( $list_array as $key=>$value ) {

                if ( $value['id'] == $left_cate ) {
                    $list_array[$key]['action'] = 1;
                    break;
                }

                foreach($value[0] as $t_key=>$child_value) {
                    if ( $child_value['id'] == $left_cate ) {
                        $list_array[$key][0][$t_key]['child_action'] = 1;
                        $list_array[$key]['action'] = 1;
                        break;
                    }
                }
            }
        }

        dump($list_array);
        $data = array(
            'left_list' => $list_array,
            'left_cate' => $left_cate
        );

        return $data;
    }


    // 左侧列表 - 旧的 - 现在没在使用
    public function leftMenu() {

        $post = $_POST;

        $GujiCateHigh = new \app\admin\model\GujiCateHigh;
        $list = $GujiCateHigh->field( array('id','pid','title') )->select();

        // 判断是否有一级分类
        if ( !empty($post['top_cate']) ) {
            $left_list = $this->recursion($list, $post['top_cate']);
        } else {
            $left_list = $this->recursion($list, 11);
        }

        // 判断是否有选中二级或三级分类 并返回相应的分类ID
        if ( !empty($post['left_cate']) ) {
            $left_cate = array_filter($post['left_cate']);
            $left_cate = current($left_cate);
        } else {
            $left_cate = '';
        }
        
        $data = array(
            'left_list' => $left_list,
            'left_cate' => $left_cate
        );

        return $data;

    }


    // 右侧列表
    public function rightMenu() {

        $post = $_POST;    
        dump($post);

        // 判断 left_cate 是否存在 并生成查询条件
        if (!empty($post['left_cate'])){
            // 去掉空值
            $condition = array_filter($post['left_cate']);
        } else {
            $condition = array();
        }

        if (!empty($post['top_cate'])) {
            $condition['cate_id'] = $post['top_cate'];
            // echo 123;
        }
        // var_dump($post);
        // 判断 page 是否存在 并生成当前页的值
        if ($post && $post['page']){
            $now_page = $post['page'];
        } else {
            $now_page = 1;
        }

        // 判断为整型的数字
        if ( !is_numeric($now_page) ) {
            $now_page = 1;
        }
        // dump($condition);
        // 列表的展示方式
        $param = array();
        if ( empty($post['check_type']['list_type']) || $post['check_type']['list_type'] == 1 ) {
            $param['list_type'] = 1;
        } else {
            $param['list_type'] = 2;
        }

        // 列表的排序方式
        if ( empty($post['check_type']['is_sort']) || $post['check_type']['is_sort'] == 1 ) {
            $param['is_sort'] = 1;
        } else if ( $post['check_type']['is_sort'] == 2 ) {
            $param['is_sort'] = 2;
        } else if ( $post['check_type']['is_sort'] == 3 ) {
            $param['is_sort'] = 3;
        }

        // 列表的排序方式 
        if ( empty($post['check_type']['is_asc']) || $post['check_type']['is_asc'] == 'asc' ) {
            $param['is_asc'] = 'asc';
        } else {
            echo 321;
            $param['is_asc'] = 'desc';
        }
        echo $param['is_asc'];
        // 创建模型实例
        $books = new \app\admin\model\GujiBooks;

        // 自己写分页输出
        $page_data = $this->myPage($books, $condition, $now_page, $param);

        // var_dump($page_data['page']);
        // var_dump($condition);
        // var_dump($left_cate);
        $rightData = array(
            'list'=>$page_data['list'], 
            'page'=>$page_data['page'],
            'param'=>$param
        );
        
        return $rightData;

    }

    // 整合左侧列表
    public function recursion( $result, $parentid=0 ){
        // dump($parentid);
        static $list=array();

        foreach ($result as $k => $v){
            if($v['pid']==$parentid){
                $list[]=$v;
                $this->recursion($result,$v['id']);
            }
        }

        return $list;

    }

    // 分页 - 临时用 - 有时间再改
    public function myPage($model, $condition, $now_page=1, $param) {


        if ( !empty($condition['action']) and $condition['action'] == 'search' ) {

            // 查询搜索页数据总数 - 分页总数
            if ( $condition['field']['cate_bid'] == '' && $condition['field']['cate_wbid'] == '' ) {
                $count = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->count();
            } else if ( $condition['field']['cate_bid'] == '' &&  $condition['field']['cate_wbid'] != '' ) {
                $count = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->where('cate_wbid', 'in', $condition['field']['cate_wbid'])
               ->count();
            } else if ( $condition['field']['cate_bid'] != '' &&  $condition['field']['cate_wbid'] == '' ) {
                $count = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->where('cate_bid', 'in', $condition['field']['cate_bid'])
                ->count();
            }
            // $count = $model
            //     ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
            //     ->where('cate_id', 'in', $condition['field']['cate_id'])
            //     ->where('cate_bid', 'in', $condition['field']['cate_bid'])
            //     ->where('cate_wbid', 'in', $condition['field']['cate_wbid'])
            //     ->count();

        } else if ( !empty($condition['action']) and $condition['action'] == 'high_search' ) {
            
            // 查询高级搜索 - 分页总数
            $count = $model->whereOr( $condition['high_search'] )->count();
            // $count = $model->query($condition['sql_count']);
            // $count = $count[0]['count'];
            // dump($count);
            // exit;
        } else {
            echo 123123;
            // 查询分页总数
            $count = $model->where($condition)->count();

        }
        dump($count);
        // return;
        // 计算页面总数
        $all_page = ceil($count / 8);

        if ( $now_page >= $all_page ) {
            $now_page = $all_page;
        } 

        // 搜索起始行数
        if ( $now_page <= 1 or empty($now_page) ) {
            $search_num = 0;
        } else {
            $search_num = ($now_page - 1) * 8;
        }
        // dump($param['is_asc']);
        // exit();
        // 指定排序语句
        if ($param['is_sort'] == 3) {
            $order = 'publi_sher_urb '.$param['is_asc'];
        } else if ($param['is_sort'] == 2) {
            $order = 'book_time '.$param['is_asc'];
        } else if ($param['is_sort'] == 1) {
            $order = 'title '.$param['is_asc'];
        }

        // var_dump($search_num);
        if ( !empty($condition['action']) and $condition['action'] == 'search' ) {
            // 查询搜索分页数据
            
            if ( $condition['field']['cate_bid'] == '' && $condition['field']['cate_wbid'] == '' ) {
                $list = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->limit($search_num, 8)->order($order)->select();
            } else if ( $condition['field']['cate_bid'] == '' &&  $condition['field']['cate_wbid'] != '' ) {
                $list = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->where('cate_wbid', 'in', $condition['field']['cate_wbid'])
                ->limit($search_num, 8)->order($order)->select();
            } else if ( $condition['field']['cate_bid'] != '' &&  $condition['field']['cate_wbid'] == '' ) {
                $list = $model
                ->where($condition['field']['con'], $condition['field']['type'], $condition['field']['name'])
                ->where('cate_id', 'in', $condition['field']['cate_id'])
                ->where('cate_bid', 'in', $condition['field']['cate_bid'])
                ->limit($search_num, 8)->order($order)->select();
            }
            

        } else if ( !empty($condition['action']) and $condition['action'] == 'high_search' ) {
            
            // 查询高级搜索分页数据
            $list = $model->whereOr( $condition['high_search'] )->limit($search_num, 8)->select();

        } else {

            // 查询分页数据
            $list = $model->where($condition)->limit($search_num, 8)->order($order)->select();

        }
        

        // 上一页
        if ( $now_page == 1 ) {
            $up_page = 1;
        } else {
            $up_page = $now_page - 1;
        }

        // 下一页
        if ( $now_page >= $all_page ) {
            $down_page = $all_page;
        } else {
            $down_page = $now_page + 1;    
        }

        $data = array(
            'list' => $list,
            'page' => array (
                'count' => $count,
                'all_page' => $all_page,
                'now_page' => $now_page,
                'up_page' => $up_page,
                'down_page' => $down_page
            )
        );

        return $data;

    }


    


}