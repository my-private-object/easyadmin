<?php
namespace app\qian\controller\main;

use think\App;
use \think\facade\View;
use app\qian\controller\main\SidePage;

class HighSearch {


	public function __construct() {
		$this->sidePage = new SidePage();
		$this->post = $_POST;
		$this->model = new \app\admin\model\GujiBooks;
	}

	// 高级搜索
	public function highSearch() {

		// 获取页数
		$now_page = $this->nowPage();

		// 获取条件 和 搜索值
		$condition = $this->highCondition();

		// 分页搜索
		$page_data = $this->sidePage->myPage($this->model, $condition, $now_page);
		
		$data = array(
			'data'=>array( 'search_list' => $page_data, 'field' => $condition ),
			'data_json' => json_encode($condition)
		);

		return $data;

	}

	// 高级搜索条件组合
	public function highCondition() {

		// dump($this->post);
		// 如果存在分页条件，直接返回分页
		if ( !empty($this->post['action']) && $this->post['action'] == 'highSearchPage' ) {
			$high_page_condition = json_decode($this->post['high_value'], true);
			return $high_page_condition;
		}

		// dump($this->post);
		// exit;
		
		$condition['action'] = 'high_search';
		// 如果存在搜索条件 - 直接返回搜索条件
		if (!empty($this->post['search_field'])) {
			dump($this->post['search_field']);
			$condition['action'] = true;
			$condition['field'] = $this->post['search_field'];
			return $condition;
		}
		
		$data = $this->post;
		$data = array_values($data);
		array_shift($data);

		$sql_arr = $this->splicCondition($data);
		$condition['high_search'] = $sql_arr;
		dump($sql_arr);
		// exit;
		return $condition;

	}

	// 整理搜索条件的数据结构
	public function splicCondition($data) {

		$i = 0;
		foreach ($data as $value ){
			$sql[$i][] = $value;
			if ( $value == 'AND' || $value == 'OR' )
				$i++;
 		}

 		$j = 0;
 		foreach ( $sql as $value ) {
 			if ( empty($value[1]) )
 				continue;
 			if ( $value[2] == 'OR' ) {
 				$new_sql[$j][] = array( $value[0], '=', $value[1] );
 				$j++;
 			} else {
 				$new_sql[$j][] = array( $value[0], '=', $value[1] );
 			}
  		}

  		return $new_sql;

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

        return $now_page;

	}



	// 高级搜索


}