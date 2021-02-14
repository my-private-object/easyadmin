/**
* JS数据初始化
*
**/
//加入收藏
riss2.favorites = {
    addFavorite: function(url, userId, sourceId) {
        if(!userId || userId.length < 1) {
            //Msg.fail("请先登录!");
            xunwen(sourceId);
            return;
        } else {
            if(userId && sourceId) {
                var param = {};
                param["userId"] = userId;
                param["sourceId"] = sourceId;                
                riss2.ajax.request(url, "POST", param, function() {
                    alert(riss2.ajax.xmlHttp.responseText);
                });
            }
        }
    }
}
function xunwen(sourceId){
	var xwwin = $.layer({
	    shade: [0],
	    area: ['auto','auto'],
	    dialog: {
	        msg: '对不起，您还没有登录平台<br>您好可以选择“登录”或“加入临时书库”',
	        btns: 2,                    
	        type: 4,
	        btn: [' 登 录 ','+临时书库'],
	        yes: function(){
	        	layer.close(xwwin);
	            showDiv('login','login');
	        }, no: function(){
	            addTempLibrary(sourceId);
	        }
	    }
	});
}

function showSuccess(str){
	var success = $.layer({
	    shade: [0],
	    area: ['auto','auto'],
	    dialog: {
	        msg: str,
	        btns: 1,                    
	        type: 4,
	        btn: [' 确定 '],
	        yes: function(){
	        	layer.close(success);
	        }
	    }
	});
}

function addTempLibrary(rsdaId){
   $.ajax({    
       type:'get',        
       url: path + '/platform/booklibrary.htm?action=saveResourceTemp&id=' + rsdaId,    
       cache:false,    
       dataType:'json',  
       async:false,  
       success:function(data){  
           layer.alert(data, 11, !1);
       },
       error:function(XMLResponse){
       	   //layer.alert(XMLResponse.responseText, 11, !1);
    	   showSuccess(XMLResponse.responseText);
       }    
   }); 
}
function deleteTempLibrary(rsdaId){
   if(window.confirm("您确定要删除该书籍吗？")){
	   $.ajax({    
	       type:'get',        
	       url: path + '/platform/booklibrary.htm?action=deleteResourceTemp&id=' + rsdaId,    
	       cache:false,    
	       dataType:'json',  
	       async:false,  
	       success:function(data){  
	           window.location.reload();
	       },
	       error:function(XMLResponse){
	       	   window.location.reload();
	       }    
	   }); 
   }
}


function getCookieVal(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1) {
		endstr = document.cookie.length;
	}
	return unescape(document.cookie.substring(offset, endstr));
}
function getCookie(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) {
			return getCookieVal(j);
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) {
			break;
		}
	}
	return;
}

//获取浏览记录
function getSourceBrowseHistory() {
	try {
		var cookieIds = getCookie("browseHistoryList");
		sysUserPlatformFacade.getSourceBrowseHistory(cookieIds, function (data) {
			var msgs = eval("(" + data + ")");
			if (msgs.isError) {
				return;
			}
			var len = msgs.data.length;
			if (len > 0) {
				var txt = "";
				for (var i = 0; i < len; i++) {
					var browseHistory = msgs.data[i];
					try {
						txt += "<li class='subText'><a href='"+path+"/platform/resource.htm?id=" + browseHistory["rsdaId"] + "' title='" + browseHistory["rsdaTitle"] + "'>" + browseHistory["subRsdaTitle"] + "</a></li>";
					}
					catch (e) {
					}
				}
				var browseHistoryId = document.getElementById("browseHistory");
				if (browseHistoryId) {
					browseHistoryId.innerHTML = txt;
				}
			}
		});
	}
	catch (e) {
	}
}

