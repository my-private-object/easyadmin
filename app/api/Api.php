<?php
namespace app\api;

use app\admin\model\GujiBooks;
use app\admin\traits\Curd;
use app\common\controller\AdminController;
use EasyAdmin\annotation\ControllerAnnotation;
use EasyAdmin\annotation\NodeAnotation;
use think\App;

class Api extends AdminController {

    use Curd;
// 
    protected $relationSearch = true;

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new GujiBooks();
    }

    /**
     * @NodeAnotation(title="列表")
     */
    public function index()
    {

        $leftData = $this->leftMenu();
        $rightData = $this->rightMenu();

        $data = [
            'code'  => 0,
            'msg'   => '',
            'leftData' => $leftData,
            'rightData'  => $rightData
        ];

        return jsonp($data);

    }

    // 右侧列表
    public function rightMenu() {

        // list($page, $limit, $where) = $this->buildTableParames();
        // $count = $this->model
        //     ->withJoin('cate',  'LEFT')
        //     ->where($where)
        //     ->count();
        $list = $this->model
            // ->withJoin('cate', 'LEFT')
            // ->where($where)
            // ->page($page, $limit)
            // ->order($this->sort)
            ->limit(6)->select();
        $rightData = [
            // 'count' => $count,
            'data'  => $list
        ];

        return $rightData;
    }

    // 左侧列表
    public function leftMenu() {
        $GujiCateHigh = new \app\admin\model\GujiCateHigh;
        $list = $GujiCateHigh->field(['id','pid','title'])->select();
        $leftList = $this->recursion($list);
        return $leftList;
    }

    // 整合左侧列表
    public function recursion($result,$parentid=0){
        static $list=array();
        foreach ($result as $k => $v){
            if($v['pid']==$parentid){
                $list[]=$v;
                $this->recursion($result,$v['id']);
            }
        }
        return $list;
    }



}