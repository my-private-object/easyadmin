<?php


namespace app\admin\controller\system;


use app\admin\model\SystemUploadfile;
use app\common\controller\AdminController;
use EasyAdmin\annotation\ControllerAnnotation;
use EasyAdmin\annotation\NodeAnotation;
use think\App;
use app\admin\model\GujiBooks;
use jianyan\excel\Excel;

/**
 * @ControllerAnnotation(title="上传文件管理")
 * Class Uploadfile
 * @package app\admin\controller\system
 */
class Uploadfile extends AdminController
{

    use \app\admin\traits\Curd;

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new SystemUploadfile();
    }


    // 从上传文件列表导入Excel
    public function importExcel() {

    	$this->import_id = $_GET['id'];

    	$result = $this->model->where(array('id'=>$this->import_id))->find();

    	$path_arr = explode('upload', $result['url']);

    	$path = 'upload/'.$path_arr[1];

    	$result = $this->importExcelTrue($path);

    	// 返回消息
    	$return_value = array(	
	    	'code' => 1,
			'data' => "",
			'msg' => "导入成功",
			'url' =>"/guji/public/upload/index.html",
			'wait' => 3
		);

    	return json($return_value);

    }


    // 导入文件
	public function importExcelTrue($path) {

		set_time_limit(0);
		ini_set("max_execution_time", "1800");
		set_time_limit(1800) ;
		$file_path = $path;
		$result = Excel::import($file_path);

		// 去掉第一行
		array_shift($result);
		// dump($result);

		$this->addExcelData($result);

		return $result;

	}

	// 读取文件并添加至数据库
	public function addExcelData($excel_data) {

		$this->model = new GujiBooks();

		// 组织数据库结构
		foreach ($excel_data as $key => $value) {

			$data['book_id'] = $value[0];
			$data['cate_id'] = $value[1];
			$data['cate_bid'] = $value[2];
			$data['cate_wbid'] = $value[3];
			$data['import_id'] = $this->import_id;
			$data['title'] = $value[4];
			$data['a_title'] = $value[5];
			$data['author'] = $value[6];
			$data['company'] = $value[7];
			$data['book_time'] = $value[8];
			$data['file_path'] = $value[9];
			$data['logo'] = $value[10];
			$data['images'] = $value[11];
			$data['describe'] = $value[12];
			$data['count_page'] = $value[13];
			$data['remark'] = $value[14];
			$data['ti'] = $value[15];
			$data['product_key'] = $value[16];
			$data['header_sort'] = $value[17];
			$data['chief_editor'] = $value[18];
			$data['cycle'] = $value[19];
			$data['publi_sher'] = $value[20];
			$data['publi_sher_urb'] = $value[21];
			$data['call_no'] = $value[22];
			$data['summary'] = $value[23];
			
			// dump($data);
			// return 123123;
			$save = $this->model->insertGetId($data);

		}


	}





}