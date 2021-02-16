<?php


namespace app\admin\controller\guji;


use app\admin\model\GujiAdmin;
use app\admin\service\TriggerService;
use app\common\constants\AdminConstant;
use app\common\controller\AdminController;
use EasyAdmin\annotation\ControllerAnnotation;
use EasyAdmin\annotation\NodeAnotation;
use think\App;

/**
 * Class Admin
 * @package app\admin\controller\system
 * @ControllerAnnotation(title="会员管理")
 */
class Admin extends AdminController
{

    use \app\admin\traits\Curd;

    protected $sort = [
        'sort' => 'desc',
        'id'   => 'desc',
    ];

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new GujiAdmin();
        // $this->assign('auth_list', $this->model->getAuthList());
    }

    /**
     * @NodeAnotation(title="列表")
     */
    public function index()
    {
        if ($this->request->isAjax()) {
            if (input('selectFields')) {
                return $this->selectList();
            }
            list($page, $limit, $where) = $this->buildTableParames();
            $count = $this->model
                ->where($where)
                ->count();
            $list = $this->model
                ->withoutField('password')
                ->where($where)
                ->page($page, $limit)
                ->order($this->sort)
                ->select();
            $data = [
                'code'  => 0,
                'msg'   => '',
                'count' => $count,
                'data'  => $list,
            ];
            return json($data);
        }
        return $this->fetch();
    }

    /**
     * @NodeAnotation(title="添加")
     */
    public function add()
    {
        // 如果是访问HTML页面
        if (!$this->request->isAjax()) {
            // 获取分类列表
            $cate = new \app\admin\model\GujiCateHigh();            
            $cate_list = $cate->where(['pid'=>'0'])->select();
            $this->assign('cate_list',$cate_list);
            return $this->fetch();
        }

        // 如果是提交表单
        $post = $this->request->post();

        // echo '<pre>';
        // var_dump($post);
        // echo '</pre>';
        
        // 判断是否为IP
        if($post['is_ip'] == 1){
            if(!filter_var($post['start_ip'], FILTER_VALIDATE_IP))
                $this->error('非法起始IP');
            if(!filter_var($post['end_ip'], FILTER_VALIDATE_IP))
                $this->error('非法结束IP');    
        }

        // 处理分类数组为字符串
        if (isset($post['cate_ids'])) {
            $cate_str = '';
            $cate_name = '';
            foreach ($post['cate_ids'] as $key=>$value) {
                $cate_str .= $key.',';
                $cate_name .= $value.',';
            }

            $cate_str = rtrim($cate_str, ',');
            $cate_name = rtrim($cate_name, ',');
            $post['is_cate'] = $cate_str;
            $post['is_cate_name'] = $cate_name;
        } else {
            $post['is_cate'] = 0;
            $post['is_cate_name'] = 0;
        }

        // 清除分类列表
        unset($post['cate_ids']);

        // 添加数据
        $authIds = $this->request->post('auth_ids', []);
        $post['auth_ids'] = implode(',', array_keys($authIds));
        $rule = [];
        $this->validate($post, $rule);
        try {
            $save = $this->model->save($post);
        } catch (\Exception $e) {
            $this->error('保存失败');
        }
        $save ? $this->success('保存成功') : $this->error('保存失败');
        
    }

    /**
     * @NodeAnotation(title="编辑")
     */
    public function edit($id)
    {
        $row = $this->model->find($id);
        empty($row) && $this->error('数据不存在');

        // 如果是访问HTML页面
        if (!$this->request->isAjax()) {

            // 获取分类信息
            $cate = new \app\admin\model\GujiCateHigh();            
            $cate_list = $cate->where(['pid'=>'0'])->select();
            $row['cate_list'] = $cate_list;

            // 获取已选分类信息
            $op_cate_list = explode(',', $row['is_cate']);
            $row['op_cate_list'] = $op_cate_list;

            $row->auth_ids = explode(',', $row->auth_ids);
            $this->assign('row', $row);
            return $this->fetch();

        }

        // 如果是提交表单
        $post = $this->request->post();

        // 判断是否为IP
        if($post['is_ip'] == 1){
            if(!filter_var($post['start_ip'], FILTER_VALIDATE_IP))
                $this->error('非法起始IP');
            if(!filter_var($post['end_ip'], FILTER_VALIDATE_IP))
                $this->error('非法结束IP');    
        }

        // 处理分类数组为字符串
        if (isset($post['cate_ids'])) {
            $cate_str = '';
            $cate_name = '';
            foreach ($post['cate_ids'] as $key=>$value) {
                $cate_str .= $key.',';
                $cate_name .= $value.',';
            }

            $cate_str = rtrim($cate_str, ',');
            $cate_name = rtrim($cate_name, ',');
            $post['is_cate'] = $cate_str;
            $post['is_cate_name'] = $cate_name;
        } else {
            $post['is_cate'] = 0;
            $post['is_cate_name'] = 0;
        }

        // 清除分类列表
        unset($post['cate_ids']);
        
        $authIds = $this->request->post('auth_ids', []);
        $post['auth_ids'] = implode(',', array_keys($authIds));
        $rule = [];
        $this->validate($post, $rule);
        if (isset($row['password'])) {
            unset($row['password']);
        }
        try {
            $save = $row->save($post);
            TriggerService::updateMenu($id);
        } catch (\Exception $e) {
            $this->error('保存失败');
        }
        $save ? $this->success('保存成功') : $this->error('保存失败');
        
    }

    /**
     * @NodeAnotation(title="编辑")
     */
    public function password($id)
    {
        $row = $this->model->find($id);
        empty($row) && $this->error('数据不存在');
        if ($this->request->isAjax()) {
            $post = $this->request->post();
            $rule = [
                'password|登录密码'       => 'require',
                'password_again|确认密码' => 'require',
            ];
            $this->validate($post, $rule);
            if ($post['password'] != $post['password_again']) {
                $this->error('两次密码输入不一致');
            }
            try {
                $save = $row->save([
                    'password' => md5($post['password']),
                ]);
            } catch (\Exception $e) {
                $this->error('保存失败');
            }
            $save ? $this->success('保存成功') : $this->error('保存失败');
        }
        $row->auth_ids = explode(',', $row->auth_ids);
        $this->assign('row', $row);
        return $this->fetch();
    }

    /**
     * @NodeAnotation(title="删除")
     */
    public function delete($id)
    {
        $row = $this->model->whereIn('id', $id)->select();
        $row->isEmpty() && $this->error('数据不存在');
        $id == AdminConstant::SUPER_ADMIN_ID && $this->error('超级管理员不允许修改');
        if (is_array($id)){
            if (in_array(AdminConstant::SUPER_ADMIN_ID, $id)){
                $this->error('超级管理员不允许修改');
            }
        }
        try {
            $save = $row->delete();
        } catch (\Exception $e) {
            $this->error('删除失败');
        }
        $save ? $this->success('删除成功') : $this->error('删除失败');
    }

    /**
     * @NodeAnotation(title="属性修改")
     */
    public function modify()
    {
        $post = $this->request->post();
        $rule = [
            'id|ID'    => 'require',
            'field|字段' => 'require',
            'value|值'  => 'require',
        ];
        $this->validate($post, $rule);
        if (!in_array($post['field'], $this->allowModifyFields)) {
            $this->error('该字段不允许修改：' . $post['field']);
        }
        if ($post['id'] == AdminConstant::SUPER_ADMIN_ID && $post['field'] == 'status') {
            $this->error('超级管理员状态不允许修改');
        }
        $row = $this->model->find($post['id']);
        empty($row) && $this->error('数据不存在');
        try {
            $row->save([
                $post['field'] => $post['value'],
            ]);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
        $this->success('保存成功');
    }


}
