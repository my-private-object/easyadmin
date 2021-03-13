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

		// 分页搜索
		$page_data = $this->sidePage->myPage($this->model, $condition, $now_page);
		// dump($condition);
		// 拦截多个分类 - 多个分类只用 空 来表示
		if ( isset($condition['field']['cate_id']) && is_array($condition['field']['cate_id']) ) {
			$condition['field']['cate_id'] = '';
		}

		$data = array(
			'search_list' => $page_data,
			'field' => $condition
		);

		return $data;

	}

	// 普通搜索条件组合
	public function lowCondition() {

		// if ( !empty( $this->post['search_field'] )) {
		// 	return $this->post['search_field'];
		// }
		// dump($this->post);
		// exit();
		// 如果存在翻页的搜索条件 - 直接返回搜索条件
		if (!empty($this->post['search_field'])) {
			// dump($this->post['search_field']);
			$condition['action'] = 'search';
			$condition['field'] = $this->post['search_field'];

			// 为空的分类 加载全部权限的分类内容
			if ($condition['field']['cate_id'] == '') {
				// dump(11111111);
				$admin = new \app\admin\model\GujiAdmin();
				$username = session('username');
				$data = $admin->where(['username'=>$username])->find();
				// var_dump($data['is_cate']);
				$cate = explode(',', $data['is_cate']);
				// var_dump($cate);
				$condition['field']['cate_id'] = $cate;
			}

			return $condition;
		}

		// 获取搜索关键字
		// if (!empty( $this->post['search'] )) {
		// 	$condition['title'] = $this->post['search'];
		// } else {
		// 	$condition['title'] = '档案';
		// }
		// dump($condition);
		// exit;
		// 判断多选是不是等于空
		// dump($this->post);
		if (!empty( $this->post['checkbox'] )) {

			$checkbox = explode(',', $this->post['checkbox']);

			$str = '';

			foreach ($checkbox as $value) {

				if ( $value == 1 ) {
					$str = 'title';
					// $condition['field']['title'] = $condition['title'];
				}
				if ( $value == 2 ) {
					$str .= '|book_time';
				}
				if ( $value == 3 ) {
					$str .= '|author';
					// $condition['field']['author'] = $condition['title'];
				}
				if ( $value == 4 ) {
					$str .= '|chief_editor';
					// $condition['field']['a_title'] = $condition['title'];
				}
				if ( $value == 5 ) {
					$str .= '|publi_sher_urb';
					// $condition['field']['book_time'] = $condition['title'];
				}

			} 

			// $condition = $str."','like','%".$this->post['search']."%'";
			$new_str = ltrim($str, '|');
			// where('name|title','like','thinkphp%')
			// $condition = "'".$condition;
			// $condition = "'author|a_title','like','%222%'";
			// $condition['field']["'".$new_str."'"] = ['like', '%'.$this->post['search'].'%'];
			// dump($condition);
			// exit;
			// $condition['field']['author'] = ['like', "%".$this->post['search'].'%'];
			
		} else {
			$new_str = 'title|book_time|author|chief_editor|publi_sher_urb';
		}

		if ( !empty($this->post) ) {
			$condition['action'] = true;
			$condition['field']['con'] = $new_str;
			$condition['field']['type'] = 'like';
			$condition['field']['name'] = '%'.$this->post['search'].'%';

			// 为空的分类 加载全部权限的分类内容
			if ($this->post['top_cate'] == '' && !isset($this->post['filed']['cate_id']) ) {
				// dump(123123);
				$admin = new \app\admin\model\GujiAdmin();
				$username = session('username');
				$data = $admin->where(['username'=>$username])->find();
				// var_dump($data['is_cate']);
				$cate = explode(',', $data['is_cate']);
				// var_dump($cate);
				$condition['field']['cate_id'] = $cate;
			} else {
				// dump(321312);
				// $condition['field']['cate_id'] = $this->post['top_cate'];
				if ($this->post['top_cate'] != '') {
					$condition['field']['cate_id'] = $this->post['top_cate'];
				} else {
					$condition['field']['cate_id'] = $this->post['filed']['cate_id'];
				}
			}
			
			// dump($condition);
			return $condition;

		}
		

		// exit;
		// dump($condition);
		// exit;
		// 判断热门是不是等于空
		
		
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



	// 高级搜索


}