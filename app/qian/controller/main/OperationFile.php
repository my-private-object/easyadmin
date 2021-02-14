<?php
namespace app\qian\controller\main;

use think\App;
use \think\facade\View;
use app\qian\controller\main\SidePage;
use jianyan\excel\Excel;
use app\admin\model\GujiBooks;

class OperationFile {

	// 导入文件
	public function importExcel() {

		$file_path = 'C:\Users\Administrator\Desktop\1610809093.xlsx';
		$result = Excel::import($file_path);

		// 去掉第一行
		array_shift($result);
		dump($result);

		$this->addExcelData($result);

		return $result;

	}

	// 读取文件并添加至数据库
	public function addExcelData($excel_data) {

		$this->model = new GujiBooks();

		// 组织数据库结构
		foreach ($excel_data as $key => $value) {

			$data['cate_id'] = $value[0];
			$data['cate_bid'] = $value[1];
			$data['cate_wbid'] = $value[2];
			$data['title'] = $value[3];
			$data['a_title'] = $value[4];
			$data['author'] = $value[5];
			$data['company'] = $value[6];
			$data['book_time'] = $value[7];
			$data['file_path'] = $value[8];
			$data['logo'] = $value[9];
			$data['images'] = $value[10];
			$data['describe'] = $value[11];
			$data['count_page'] = $value[12];
			$data['remark'] = $value[13];

			$save = $this->model->insertGetId($data);

			echo $save;

		}
		


		
		

	}

	// 打开文件
	public function searchFile() {

		$path = "C:\Users\Administrator\Desktop\hello_word";

		$result = $this->get_dir_all_files($path);
		// return $result;

		$result = $this->explodeFilePath($result);

		// $result = $this->readImage($result);

		return $result;
		// dump($result);

	}
 
	// 读取文件绝对路径列表
	public function get_dir_all_files($path)
	{
	    $result=array();
	    $temp=array();
	        
	    if(filetype($path)=='dir')
	    {
	        $dir=scandir($path);
	        foreach($dir as $value)
	        {
	            if($value!='.'&&$value!='..')
	            {
	                if(filetype("$path/$value")!='dir')
	                {
	                    $result[]="$path/$value";                    
	                }else
	                {
	                    $temp=array_merge($temp,$this->get_dir_all_files("$path/$value"));
	                }        
	            }
	        }
	    }
	    return array_merge($result,$temp);;
	}

	// 分割路径
	public function explodeFilePath($file_path) {

		$books = new \app\admin\model\GujiBooks();

		$book_name = '';
		foreach ($file_path as $key => $value) {
			$arr = explode('sources/', $value);
			$new_arr = explode('/', $arr[1]);
			// dump($arr);
			dump($new_arr[0]);
			if ($new_arr[0] == $book_name) {
				continue;
			} else {
				$book_name = $new_arr[0];
				// 存到数据库
				$book_id = $books->insertGetId(array('title'=>$new_arr[0], 'images'=>$new_arr[1]));
			}
			
			
			// dump($result);
		}

	}


	// 读取图片生成二进制
	public function readImage($book_list) {

		$new_book_list = array();

		foreach ($book_list as $key => $value) {
			// echo $value;
			$result = file_get_contents($value);
	        // echo $result;
	        $new_result = base64_encode($result);
	        // echo $new_result;
	        $new_book_list[] = $new_result;
		}

		return $new_book_list;

        // // header('content-type:image/jpeg');
        // $path = ROOT_PATH."public";
        // // echo $path;
        // // exit;
        // $file_name = $path.'/upload/20201202/1688618a4d9ec1ffa0168fde7922a020.jpg';

        // $result = file_get_contents($file_name);
        // // echo $result;
        // $new_result = base64_encode($result);
        // echo $new_result;

        
	}














}


