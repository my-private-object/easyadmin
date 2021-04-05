<?php
namespace app\qian\controller\main;

use think\App;
use \think\facade\View;
use app\qian\controller\main\SidePage;

class Search {


	public function __construct() {
		$this->sidePage = new SidePage();
		$this->post = $_POST;
		$this->model = new \app\admin\model\GujiBooks;
	}

	// 普通搜索
	public function lowSearch() {

		// 获取页数
		$now_page = $this->nowPage();

		// 获取条件 和 搜索值
		$condition = $this->lowCondition();
		dump($this->post);
		
		// 列表的展示方式
        $param = array();
        if ( empty($this->post['check_type']['list_type']) || $this->post['check_type']['list_type'] == 1 ) {
            $param['list_type'] = 1;
        } else {
            $param['list_type'] = 2;
        }

        // 列表的排序方式
        if ( empty($this->post['check_type']['is_sort']) || $this->post['check_type']['is_sort'] == 1 ) {
            $param['is_sort'] = 1;
        } else if ( $this->post['check_type']['is_sort'] == 2 ) {
            $param['is_sort'] = 2;
        } else if ( $this->post['check_type']['is_sort'] == 3 ) {
            $param['is_sort'] = 3;
        }

		// 分页搜索
		$page_data = $this->sidePage->myPage($this->model, $condition, $now_page, $param['is_sort']);
		// dump($condition);
		// 拦截多个分类 - 多个分类只用 空 来表示
		if ( isset($condition['field']['cate_id']) && is_array($condition['field']['cate_id']) ) {
			$condition['field']['cate_id'] = '';
		}

		$data = array(
			'search_list' => $page_data,
			'field' => $condition,
			'param' => $param
		);

		return $data;

	}

	// 普通搜索条件组合
	public function lowCondition() {

		// 获取本ID的分类权限
		$admin = new \app\admin\model\GujiAdmin();
		$username = session('username');
		$data = $admin->where(['username'=>$username])->find();
		var_dump($data['is_cate']);
		$cate = explode(',', $data['is_cate']);
		// var_dump($cate);
		
		// 一级分类数组
		$cate_id_list = $cate;


		// 如果存在翻页的搜索条件 - 直接返回搜索条件
		if (!empty($this->post['search_field'])) {
			// dump($this->post['search_field']);
			$condition['action'] = 'search';
			$condition['field'] = $this->post['search_field'];

			// 为空的分类 加载全部权限的分类内容
			if ($condition['field']['cate_id'] == '')
				$condition['field']['cate_id'] = $cate_id_list;

			if ($condition['field']['cate_bid'] == '')
				$condition['field']['cate_bid'] = '';

			if ($condition['field']['cate_wbid'] == '')
				$condition['field']['cate_wbid'] = '';
			
			$condition['field']['checkbox'] = explode(',', $condition['field']['checkbox']);

			return $condition;
		}

		// 判断多选框
		if (!empty( $this->post['checkbox'] )) {

			$checkbox = explode(',', $this->post['checkbox']);

			$str = '';
			$new_checkbox = array();

			foreach ($checkbox as $value) {

				if ( $value == 1 ) {
					$str = 'title';
					$new_checkbox[] = 1;
				}
				if ( $value == 2 ) {
					$str .= '|book_time';
					$new_checkbox[] = 2;
				}
				if ( $value == 3 ) {
					$str .= '|author';
					$new_checkbox[] = 3;
				}
				if ( $value == 4 ) {
					$str .= '|chief_editor';
					$new_checkbox[] = 4;
				}
				if ( $value == 5 ) {
					$str .= '|publi_sher_urb';
					$new_checkbox[] = 5;
				}

			} 

			$new_str = ltrim($str, '|');

		} else {
			$new_str = 'title|book_time|author|chief_editor|publi_sher_urb';
			$new_checkbox = [];
		}

		// 组组搜索关键字和分类
		if ( !empty($this->post) ) {
			$condition['action'] = true;
			$condition['field']['con'] = $new_str;
			$condition['field']['type'] = 'like';
			$condition['field']['name'] = '%'.trim($this->post['search']).'%';
			$condition['field']['checkbox'] = $new_checkbox;

			if (!empty($this->post['search'])) {
				$condition['field']['search_name'] = trim($this->post['search']);
			} else {
				$condition['field']['search_name'] = '';
			}
			

			// 为空的分类 加载全部权限的分类内容
			if ($this->post['top_cate'] == '' && !isset($this->post['filed']['cate_id']) ) {
				$condition['field']['cate_id'] = $cate_id_list;
			} else {
				if ($this->post['top_cate'] != '') {
					$condition['field']['cate_id'] = $this->post['top_cate'];
				} else {
					$condition['field']['cate_id'] = $this->post['filed']['cate_id'];
				}
			}
			
			if (!isset($this->post['left_cate']['cate_bid'])) {
				$condition['field']['cate_bid'] = '';
			} else {
				$condition['field']['cate_bid'] = $this->post['left_cate']['cate_bid'];
			}

			if (!isset($this->post['left_cate']['cate_wbid'])) {
				$condition['field']['cate_wbid'] = '';
			} else {
				$condition['field']['cate_wbid'] = $this->post['left_cate']['cate_wbid'];
			}

			dump($condition);
			return $condition;

		}

		$condition = array();
		return $condition;

	}

	// 判断分页
	public function nowPage() {

		// 判断 page 是否存在 并生成当前页的值
        if (!empty( $this->post['page'] )){
            $now_page = $this->post['page'];
        } else {
            $now_page = 1;
        }
        
        // 判断为整型的数字
        if ( !is_numeric($now_page) ) {
            $now_page = 1;
        }
        // var_dump($now_page);
        return $now_page;

	}




}