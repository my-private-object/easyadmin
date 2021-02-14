//主页中间部分切换
function changeDiv(obj,num){
	if(num==1){
		$("body").addClass("img_src1");
		$(".content").show();
		$(".gjtype").hide();
		$(".hot").hide();
		$(obj).parent().parent().find("li").removeClass("xf");
		$(obj).parent().addClass("xf");
	}
	if(num==2){
		$("body").addClass("img_src2");
		$(".gjtype").show();
		$(".content").hide();
		$(".hot").hide();
		$(obj).parent().parent().find("li").removeClass("xf");
		$(obj).parent().addClass("xf");
	}
	if(num==3){
		$("body").addClass("img_src3");
		$(".hot").show();
		$(".content").hide();
		$(".gjtype").hide();
		$(obj).parent().parent().find("li").removeClass("xf");
		$(obj).parent().addClass("xf");
		changeYes(1001);
	}
}



//显示层
function showDiv(flag,info){
	if(flag==''){return;}
	if(info==''){return;}
	switch (flag){
		case 'login':
			document.getElementById('loginDiv').style.display="";
			break;
		default:
			return;
	}
}

//隐藏层
function hideLoginDiv(){
	document.getElementById('comeOut').style.display="none";
	document.getElementById('loginDiv').style.display="none";
	// 清空表单
	document.getElementById("loginName").value='用户名';
	document.getElementById("password").value='密码';
	document.getElementById("errorMsg").innerHTML = "";
}

function showLs(){
	$(".ls").show();
}
function hideLs(){
	$(".ls").hide();
}

//头部检索开始
function show_searchType(){
	$(".select_span2").show();
}
function hide_searchType(){
	$(".select_span2").hide();
}
function change(type,name){
	$(".select_span2").hide();
	$(".select_span1").html(name);
	$("#searchType").val(type);
}
function initheadq(keyWord){
	if(keyWord=='请输入关键词...'){
		$("#keyWord").val("");
	}
}
function outheadq(){
	if($("#keyWord").val().length<1){
		$("#keyWord").val("请输入关键词...");
	}
}	
//简单检索
function searchSubmit(){
	$("#searchForm").submit();
}
//高级检索
function hightSearch(){
	location.href=basePath + "/platform/search.htm?action=moresearch";
}
/*********************阅读************************/
function readRecord(url,suinId,rsdaId){
	var result;
	if(!suinId || suinId.length > 0){
		result=sysUserPlatformFacade.addResReadRecord(suinId,rsdaId);
	}else{
		result=sysUserPlatformFacade.addResReadRecord(0,rsdaId);
	}
	window.open(url);
	hideDetailDiv();
}

/*********************读书吧笔记************************/
function readNotes(suinId,rsdaId,pageId,notes){
	alert(rsdaId)
	var result;
	if(suinId !=''){
		result=sysUserPlatformFacade.addResReadNotes(suinId,rsdaId,pageId,notes);
	}else{
		 xunwenNotes();
         return;
		//result=sysUserPlatformFacade.addResReadRecord(0,rsdaId);
	}
	//window.open(url);
	//hideDetailDiv();
}

function xunwenNotes( ){
	var xwwin = $.layer({
	    shade: [0],
	    area: ['auto','auto'],
	    dialog: {
	        msg: '对不起，您还没有登录平台<br>您好可以选择“登录”',
	        btns: 2,                    
	        type: 4,
	        btn: [' 登 录 ','取消'],
	        yes: function(){
	        	layer.close(xwwin);
	            showDiv('login','login');
	        }, no: function(){
	        	layer.close(xwwin);
	        }
	    }
	});
}
/************************删除收藏***************************/
function deleteFav(scfId){
	if(confirm('您确定要删除该收藏吗？')){
		location.href=basePath + "/user/favorite.htm?action=delScFavorite&scfId=" + scfId;
	}
}

/************************删除阅读记录***************************/
function deleteReco(recoId){
	if(confirm('您确定要删除该阅读记录吗？')){
		location.href=basePath + "/usercenter/readRecord.htm?action=delReadRecord&recoId=" + recoId;
	}
}
