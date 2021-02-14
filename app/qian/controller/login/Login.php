<?php
namespace app\qian\controller\login;

use think\App;
use \think\facade\View;
// use \app\qian\model\GujiUser;
use \app\admin\model\GujiAdmin;
// use app\BaseController;
// use think\Controller;

class Login {


	public function index() {
		return view::fetch('Login/login');
	}

	// 验证登陆并跳转用户
    public function userVerify(){

		// $User = new GujiUser();

		$User = new GujiAdmin();

		$data=input('post.');
		$num = self::loginVerify($data, $User);
		// dump($num);
		// exit;
		if($num == 3){
			// return redirect('http://localhost:81/gj/');
			$url = url('Index/index');
			// $new_url = 'http://'.$_SERVER['HTTP_HOST'].$url;
			// echo $new_url;
			return redirect($url);
		}else{
			return redirect('index');
		}

	}


	// 验证登陆
	public function loginVerify($data, $user){

		if (empty($data['username']) || empty($data['password'])) {
			return '无效的验证';
		}

		$user_result = $user->where( ['username'=>$data['username']])->find();

		if ( is_null($user_result) ) {
			return '无效的用户';
		}

		if ( $user_result ) {
			// dump(md5($data['password']));
			if ( $user_result['password'] == md5($data['password']) ) {

				session('username',$user_result['username']);
				session('uid',$user_result['id']);
				session('last_time',time()+1800	);

				//信息正确
				return 3; 

			} else {

				//密码错误
				return 2;

			}
		} else {

			//用户不存在
			return 1;

		}
	}



  
}