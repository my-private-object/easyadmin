<?php
namespace app\qian\middleware;


use think\Request;

/**
 * 检测用户登录
 * Class CheckUser
 * @package app\admin\middleware
 */
class CheckUser
{


    public function handle(Request $request, \Closure $next)
    {

        // 验证是否后台登陆
        $uri = $request->server('REQUEST_URI');
        if ( 
            strstr($uri, 'guji') ||
            $uri == '/gj/Login.login' ||
            $uri == '/gj/Login.login/index.html' ||
            $uri == '/gj/login.Login/userVerify.html'
        ) {
            return $next($request);
        }

        // 如果 session uid 和 username 不存在，则转为判断是否为IP段登陆
        if ( !session('uid') || !session('username') ) {

            $is_ip = $this->is_ip_login();
            // dump($is_ip);
            if ( $is_ip === true )
                return $next($request);

            // 跳转到登陆页面
            $url = url('/gj/Login.login/index');
            return redirect($url);

        } else {

            // 如果不是绑定IP登陆的情况下 - 验证是否为账号登陆
            // 验证超时 - 超时就退出登陆 - 未超时就延长SESSION的登陆时间
            if ( (session('last_time') - time()) <= 0 ) {
                session('username', null);
                session('uid', null);
                $url = url('/gj/Login.login/index');
                return redirect($url);
            } else {
                session('last_time',time()+1800 );
            }

        }

        return $next($request);

    }


    // 验证 IP 段是否存在
    public function is_ip_login() {

        // 获取客户端IP段
        $client_ip = $_SERVER['REMOTE_ADDR']; //访问端（有可能是用户，有可能是代理的）IP
        // echo $client_ip;

        // 获取数据库IP范围数据
        $admin = new \app\admin\model\GujiAdmin();
        $admin_result = $admin->where(['is_ip'=>1])->select()->toArray();

        // 循环判断客户端IP地址是否在数据库范围内
        foreach ($admin_result as $key => $value) {

            $is_ip = false;
            $is_time = false;

            $ip_start = $this->get_iplong($value['start_ip']); //起始ip
            $ip_end = $this->get_iplong($value['end_ip']);//至ip
            $ip = $this->get_iplong($client_ip);//判断的ip

            // 可以这样简单判断IP
            if( $ip >= $ip_start && $ip <= $ip_end ){
                $is_ip = true;
                // echo 'IP在此范围内';
                // 判断时间是否在允许范围内
                $now_time = time();//当前时间戳
                $start_time = strtotime($value['start_time']);//起始时间
                $end_time = strtotime($value['end_time']);//结束时间
                // echo date('y-m-d h:i:s', $now_time);
                // echo date('y-m-d h:i:s', $start_time);
                // echo date('y-m-d h:i:s', $end_time);
                if ( $now_time >= $start_time && $now_time <= $end_time ){
                    // echo '时间有效';
                    $is_time = true;
                }
            }

            if ( $is_ip === true && $is_time === true ) {
                // echo $value['username'];
                return true;
            }

        }
        
        return false;

    }


    /**
     * 将ip地址转换成int型
     * @param $ip  ip地址
     * @return number 返回数值
     */
    public function get_iplong($ip){
        //bindec(decbin(ip2long('这里填ip地址')));
        //ip2long();的意思是将IP地址转换成整型 ，
        //之所以要decbin和bindec一下是为了防止IP数值过大int型存储不了出现负数。
        return bindec(decbin(ip2long($ip)));
    }




}