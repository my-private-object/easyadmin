//改变分类color
function addBg(id){
	var hid = id;
	var al = document.getElementById(hid).getElementsByTagName("a");
	for(var i = 0 ; i < al.length ;i++ ){
		al[i].style.color='#900809';
	}
}
function cleanBg(id){
	var hid = id;
	var al = document.getElementById(hid).getElementsByTagName("a");
	for(var i = 0 ; i < al.length ;i++ ){
		al[i].style.color='#856A3F';
	}
}

function turnLink(o){
	var i = o;
	if(i == 1){
		window.open("/minguo-dh/platform/list.htm?action=typeList&type=1");
	}else if(i == 2){
		window.open("/minguo-dh/platform/list.htm?action=typeList&type=3");
	}else if(i == 3){
		window.open("/minguo-dh/platform/list.htm?action=master");
	}
}


function showTypeDiv(type,id,tid){
	if(type==''){return;}
	if(id==''){return;}
	switch (type){
		case 'type':
			document.getElementById('typeDiv').style.display="";
			 $.ajax({
	           type:'post',
	           url:'/minguo-dh/platform/search.htm?action=getTypeList&rdtyType=' + id,
	           async:false,
	           success:function(json){
	             $(".type_list").html(json);
	           }
	       });
			break;
		case 'nian':
			$(".type_top_p2").html("年份分类法");
			document.getElementById('nian-type-Div').style.display="";
			break;
		case 'zimu':
			$(".type_top_p2").html("字母分类法");
			document.getElementById('py-type-Div').style.display="";
			break;
		case 'dashi':
			$(".type_top_p2").html("大师经典图书系列");
			document.getElementById('ds-type-Div').style.display="";
			 $.ajax({
	           type:'post',
	           url:'/minguo-dh/platform/search.htm?action=getResCreator',
	           async:false,
	           success:function(json){
	             $(".ds-list").html(json);
	           }
			 });
			break;
		default:
			return;
	}
	//$(".type_top_p1").html(name);
	if(tid==1){$(".type_top_p2").html("中图分类法");}
	if(tid==2){$(".type_top_p2").html("民国分类法");}
	if(tid==3){$(".type_top_p2").html("年份分类法");}
	if(tid==4){$(".type_top_p2").html("字母分类法");}
	if(tid==5){$(".type_top_p2").html("大师经典图书系列");}
}
//隐藏层
function hideTypeDiv(){
	document.getElementById('comeOut').style.display="none";
	document.getElementById('typeDiv').style.display="none";
	document.getElementById('nian-type-Div').style.display="none";
	document.getElementById('py-type-Div').style.display="none";
	document.getElementById('ds-type-Div').style.display="none";
}