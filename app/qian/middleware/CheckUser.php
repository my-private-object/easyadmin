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


        $uri = $request->server('REQUEST_URI');
        // echo $uri;

        // dump($uri);
        // 验证登录
        if( 
            strstr($uri, 'guji') == false &&
            $uri != '/gj/Login.login' && 
            $uri != '/gj/Login.login/index.html' && 
            $uri != '/gj/login.Login/userVerify.html' && 
            (!session('uid')||!session('username')) 
        ) {

            $url = url('Login.login/index');
            return redirect($url);
            // return redirect('http://localhost:81/gj/Login.login');
        }

        // 验证超时
        if ( 
            strstr($uri, 'guji') == false &&
            $uri != '/gj/Login.login' && 
            $uri != '/gj/Login.login/index.html' && 
            $uri != '/gj/login.Login/userVerify.html' && 
            ((session('last_time') - time()) <= 0) 
        ) {
            session('username', null);
            session('uid', null);
            $url = url('Login.login/index');
            return redirect($url);
            // return redirect('http://localhost:81/gj/Login.login');
        } else {
            session('last_time',time()+1800 );
        }
   
        return $next($request);

    }

}