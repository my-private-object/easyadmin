<?php



namespace app\admin\model;


use app\common\model\TimeModel;

class GujiBooks extends TimeModel
{

    protected $table = "";

    protected $deleteTime = 'delete_time';

    public function cate()
    {
        return $this->belongsTo('app\admin\model\GujiCateHigh', 'cate_id', 'id');
    }

    public function cateHigh()
    {
    	return $this->belongsTo('app\admin\model\GujiCateHigh', 'cate_bid', 'id');
    }

    public function cateHighTwo()
    {
        return $this->belongsTo('app\admin\model\GujiCateHigh', 'cate_wbid', 'id');
    }

}