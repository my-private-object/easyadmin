<?php
namespace app\qian\controller;

use think\App;
use \think\facade\View;
use \think\Request;

use app\qian\controller\main\SidePage;
use app\qian\controller\main\Search;
use app\qian\controller\main\HighSearch;
use app\qian\controller\main\ToolRead;
use app\qian\controller\main\OperationFile;

class Index {


    // 首页
    public function index(Request $Request) {

        // 上部列表
        $side = new SidePage();

        $menu = $side->topMenu();

        view::assign( 'data', $menu );
        // var_dump($menu);
        return view::fetch('qian@Api/index');
        
    }

    // 测试页
    public function test() {
        return view::fetch('qian@Api/test');
    }

    // 二级页
    public function sidePage() {

        $side = new SidePage();
        $result = $side->list();

        view::assign( 'data', $result );
        return view::fetch('qian@Api/side');

    }

    // 详情页
    public function details(Request $Request) {

        if ($Request->isAjax()) {
            $toolRead = new ToolRead();
            $result = $toolRead->readDatabaseResource();
            return json($result);
        }
        // dump(123);
        // view::assign( 'data', $result );
        return view::fetch('qian@Api/tool_read');

    }

    // 图片生成二进制测试页面
    public function imageTest() {

        header('content-type:image/jpeg');
        $path = ROOT_PATH."public";
        // echo $path;
        // exit;
        $file_name = $path.'/upload/20201202/1688618a4d9ec1ffa0168fde7922a020.jpg';

        $result = file_get_contents($file_name);
        // echo $result;
        $new_result = base64_encode($result);
        echo $new_result;

        // $handle = fopen($file_name, 'r');
        // $result = fread($handle, filesize($file_name));
        // fclose($handle);
        // $new_result = base64_decode($result);
        // echo $new_result;

        // echo $result;
        

    }


    // 搜索页
    public function searchPage() {

        // 搜索数据
        $search = new Search();
        $result = $search->lowSearch();

        // 整合列表数据
        $side = new SidePage();
        $result = $side->list($result);
        dump($result);
        // exit;
        view::assign( 'data', $result );
        return view::fetch('qian@Api/Search');

    }


    // 高级搜索页
    public function highSearchPage() {

        if ( empty($_POST['action']) ) {

            // 整合列表数据
            $side = new SidePage();
            $result = $side->list();

            view::assign( 'data', $result );
            return view::fetch('qian@Api/High_Search');

        }
        // dump($_POST);
        // exit;
        if ( !empty($_POST['action']) ) {

            $highSearch = new HighSearch();
            $high_result = $highSearch->highSearch();

            // 整合列表数据
            $side = new SidePage();
            $result = $side->list($high_result['data']);
            // dump($high_result['data_json']);
            view::assign( 'data_json', $high_result['data_json'] );
            view::assign( 'data', $result );
            return view::fetch('qian@Api/Search'); 

        }

    }


    // 文件读取
    public function fileRead() {
        $exportFile = new OperationFile();
        $result = $exportFile->searchFile();
        dump($result);
    }

    // 文件导入
    public function importFile() {
        $exportFile = new OperationFile();
        $result = $exportFile->importExcel();
    }





}