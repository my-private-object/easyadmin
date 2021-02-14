<?php
namespace app\admin\controller\guji;

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

        list($page, $limit, $where) = $this->buildTableParames();
        $count = $this->model
            ->withJoin('cate', 'LEFT')
            ->where($where)
            ->count();
        $list = $this->model
            ->withJoin('cate', 'LEFT')
            ->where($where)
            ->page($page, $limit)
            ->order($this->sort)
            ->select();

        $rightData = [
            'count' => $count,
            'data'  => $list
        ];

        $GujiCateHigh = new \app\admin\model\GujiCateHigh;
        $testList = $GujiCateHigh->select()->toArray();
        $leftList = $this->recursion($testList  );

        $data = [
            'code'  => 0,
            'msg'   => '',
            'liftData' => $leftList,
            'rightData'  => $rightData
        ];
        
        return json($cateData);
        // $this->is_dump($testList);

    }

    public function is_dump($params) {
        echo '<pre>';
        print_r($params);
        echo '</pre>';
    }

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

    public function aorder($array,$pid=0){
        $arr = array();
           
        foreach($array as $v){
            if($v['pid']==$pid){
                $arr[] = $v;
                $arr = array_merge($arr,$this->aorder($array,$v['id']));
            }
        }
        return $arr;
    }

    /**
     * @NodeAnotation(title="入库")
     */
    // public function stock($id)
    // {
    //     $row = $this->model->find($id);
    //     empty($row) && $this->error('数据不存在');
    //     if ($this->request->isAjax()) {
    //         $post = $this->request->post();
    //         $rule = [];
    //         $this->validate($post, $rule);
    //         try {
    //             $post['total_stock'] = $row->total_stock + $post['stock'];
    //             $post['stock'] = $row->stock + $post['stock'];
    //             $save = $row->save($post);
    //         } catch (\Exception $e) {
    //             $this->error('保存失败');
    //         }
    //         $save ? $this->success('保存成功') : $this->error('保存失败');
    //     }
    //     $this->assign('row', $row);
    //     return $this->fetch();
    // }

}