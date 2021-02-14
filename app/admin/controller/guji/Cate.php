<?php


namespace app\admin\controller\guji;


use app\admin\model\GujiCate;
use app\admin\traits\Curd;
use app\common\controller\AdminController;
use EasyAdmin\annotation\ControllerAnnotation;	//节点
use EasyAdmin\annotation\NodeAnotation;			//权限
use think\App;

/**
 * Class Cate
 * @package app\admin\controller\system
 * @ControllerAnnotation(title="古籍分类管理")
 */
class Cate extends AdminController
{

    use Curd;

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new GujiCate();
    }

}