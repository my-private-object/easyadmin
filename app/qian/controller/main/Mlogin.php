<?php
namespace app\qian\controller\main;

use think\App;
use \think\facade\View;
use \app\admin\model\GujiAdmin;

class Mlogin {


	// 验证登陆并跳转用户
    public function userVerify(){

		$User = new GujiAdmin();

		$num = self::loginVerify($data, $User);
		


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
				return true; 

			} else {

				//密码错误
				return '密码错误';

			}
		} else {

			//用户不存在
			return '用户不存在';

		}
 

	}



  
}