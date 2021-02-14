/**$(function(){
	var flag = false;
		$(".main_menu_lie ul li a.dynamicGroup").hover(function(){
			if($(this).parent("li").attr("status") != "true" && $(this).next("ul").html()){
				$(this).next("ul").removeAttr("style").find("p").hide().toggle("fast");
			}
		},function(){
			var $thiz = $(this);
			setTimeout(function(){
				if($thiz.parent("li").attr("status") != "true" && $thiz.next("ul").html() && !flag){
					$thiz.next("ul").removeAttr("style").find("p").show().toggle("fast");
				}
			},100);
		})
		$(".main_menu_lie ul.disShow").hover(function(){
			flag = true;
		},function(){
			flag = false;
			if($(this).parent("li").attr("status") != "true" && $(this).html()){
				$(this).removeAttr("style").find("p").show().toggle("fast");
			}
		})
})**/

/**
$(function(){
	var $target = undefined;
		$(".main_menu_lie ul li a.dynamicGroup").hover(function(){
			if(!$target || ($target && $target.html()!= $(this).next("ul").html())){
				if($(this).next("ul").html()){
					if($target)$target.removeAttr("style").slideUp("fast");
					$(".main_menu_lie ul li ul.disShow").each(function(){
						if($(this).css("display") == 'block');
					})
					if($(this).next("ul.disShow").css('display') == 'none'){
						$(this).next("ul.disShow").slideDown("fast");
					}
				}
			}
		},function(){
			if($(this).next("ul").html()){
				$target = $(this).next("ul");
			}
		})
})
**/

$(function(){
	$(".main_menu_lie ul li span.clickUp").click(function(){
		if($(this).next("ul.disShow").css('display') == 'none'){
			$(this).next("ul.disShow").slideDown("fast");
			$(this).css("background","url(../images/dhminguo/down.png) no-repeat 0 0")
		}else{
			$(this).next("ul.disShow").slideUp("fast");
			$(this).css("background","url(../images/dhminguo/up.png) no-repeat 0 0")
		}
	});
});


