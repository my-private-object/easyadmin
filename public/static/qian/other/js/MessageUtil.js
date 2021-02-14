var Msg = {
	 
	/**
	 * 显示提示信息
	 * msgTitle: 显示信息，默认为提交成功
	 * showtime: 显示时间(秒)
	 * htmlTager: 提示标签
	 */
	showMsg : function (msgTitle, showtime, htmlTager) {
		 Msg.removeAlertItem();
		 var y = document.body.scrollTop;
         var pageHiegh = document.body.clientHeight / 2;
         
         //alert("y:" + y + " pageHigth:" + pageHiegh);
         
         var messageBoxDiv = document.createElement("div");
         messageBoxDiv.id = 'MessageBox';
         messageBoxDiv.className = 'MessageBox';
         //messageBoxDiv.style.top = (y + pageHiegh-25) + "px";
         messageBoxDiv.style.top = "50%";
         messageBoxDiv.style.display="block";
         
         messageBoxDiv.innerHTML = htmlTager;
         
         document.body.appendChild(messageBoxDiv);
          
	},
	
	/**
	 * 提示信息
	 * msgTitle: 显示信息，默认为提交成功
	 * showtime: 显示时间(秒)
	 */
	alert : function (msgTitle, showtime) {
		 if(msgTitle == null){
			 msgTitle = "提交成功";
		 }
		 if(showtime == null){
		 	 showtime = 2;
		 }
		 var tager = "<table cellpadding='0px' cellspacing='0px'><tr><td class='msg_left'>&nbsp;</td><td class='msg_content'>"+msgTitle+"</td><td class='msg_right'></td></tr></table>";
		 Msg.showMsg(msgTitle, showtime, tager);
		 setTimeout(Msg.removeAlertItem,showtime*1000);
	},
	
	/**
	 * 成功提示信息
	 * msgTitle: 显示信息，默认为提交成功
	 * showtime: 显示时间(秒)
	 */
	success : function (msgTitle, showtime) {
		 if(msgTitle == null){
			 msgTitle = "提交成功";
		 }
		 if(showtime == null){
		 	 showtime = 2;
		 }
		 var tager = "<table cellpadding='0px' cellspacing='0px'><tr><td class='success_left'>&nbsp;</td><td class='msg_content'>"+msgTitle+"</td><td class='msg_right'></td></tr></table>";
		 Msg.showMsg(msgTitle, showtime, tager);
		 setTimeout(Msg.removeAlertItem,showtime*1000);
	},
	
	/**
	 * 失败提示信息
	 * msgTitle: 显示信息，默认为对不起，提交失败
	 * showtime: 显示时间(秒)
	 */
	fail : function (msgTitle, showtime) {
		 if(msgTitle == null){
			 msgTitle = "对不起，提交失败";
		 }
		 if(showtime == null){
		 	 showtime = 2;
		 }
		 var tager = "<table cellpadding='0px' cellspacing='0px'><tr><td class='fail_left'>&nbsp;</td><td class='msg_content'>"+msgTitle+"</td><td class='msg_right'></td></tr></table>";
		 Msg.showMsg(msgTitle, showtime, tager);
		 setTimeout(Msg.removeAlertItem,showtime*1000);
	},
	
	/**
	 * 等待提示信息
	 * msgTitle: 显示信息，正在提交您的请求，请稍后...
	 * showtime: 显示时间(秒)
	 */
	wait : function (msgTitle, showtime) {
		 if(msgTitle == null){
			 msgTitle = "正在提交您的请求，请稍后...";
		 }
		 Msg.showDisplay(); 
		 var tager = "<table cellpadding='0px' cellspacing='0px'><tr><td class='wait_left'><img src='"+root+"/images/message/loading.gif' style='vertical-align:middle;'></img></td><td class='msg_content'>"+msgTitle+"</td><td class='msg_right'></td></tr></table>";
		 Msg.showMsg(msgTitle, showtime, tager);
		 if(showtime != null){
			 setTimeout(hide,showtime*1000);
		 }
	},
	
	hide : function () {
		Msg.removeAlertItem();
		Msg.closeDisplay();
	},
	
	
	/**
	 * 根据对象id将元素闻从页面中删除
	 * itemId : html元素Id
	 */    
	removeAlertItem : function () {
	    var md=document.getElementById("MessageBox");
	    if(md != null){
		    md.style.display = "none";
		    document.body.removeChild(md); //删除提示框区域
	    }
	},
	
	/**
	 * 屏蔽层显示	
	 **/
	 showDisplay : function (){
	 	var displayObj = document.createElement("div");
	 	
		var bodyheight=document.documentElement.clientHeight;//内容可视区域的高度,一般是最后一个工具条以下到状态栏以上的这个区域，与页面内容无关。
		var bodyscrollHeight=document.body.scrollHeight;//页面内容的实际高度；  
 		if(bodyscrollHeight<bodyheight){
		    displayObj.style.height=bodyheight+'px';
		}else{
		    displayObj.style.height=bodyscrollHeight+'px';
		}
	
	 	displayObj.id="displayDivId";
	 	displayObj.className="displayDiv";
	 	
 		//displayObj.style.width=width+"px";
 		//displayObj.style.height=height+"px";
	 	document.body.appendChild(displayObj); 
	 },
	 //关闭遮罩层
	 closeDisplay : function (){
	 		 var displayDiv=document.getElementById("displayDivId");
		    if(displayDiv != null){
			    document.body.removeChild(displayDiv); //删除屏蔽层
		    }
	 }
}




//定义窗体对象
var Win = {
	/**
	 * 显示弹出窗口
	 * windowWidth: 窗口宽度
	 * windowHeight: 窗口高度
	 * contentElementId: 显示内容的元素ID
	 */
	show : function (windowWidth, windowHeight, contentElementId, title, haveClose) {
		 Msg.showDisplay();
		 if(title == null){
		 	 title = " 提示";
		 }
         var windowBoxDiv = document.getElementById("WindowBox");
         if(windowBoxDiv == null){
	         windowBoxDiv = document.createElement("div");
	         windowBoxDiv.id = 'WindowBox';
	         windowBoxDiv.className = 'windowBox';
	         windowBoxDiv.style.display="block";
	         windowBoxDiv.style.width = windowWidth;
	         windowBoxDiv.style.height = windowHeight;
	         
	         
	         var _left = (document.documentElement.clientWidth/2) - (windowWidth/2);
	         var _top = (document.documentElement.clientHeight/2)-(windowHeight/2)+document.documentElement.scrollTop;
	         if(_left < 1){
	         	 _left = (document.body.clientWidth/2) - (windowWidth/2);
	         }
	         if(_top < 1){
	         	_top = (document.body.clientHeight/2)-(windowHeight/2)+document.body.scrollTop;
	         }
	         
	         if(_left < 1 || _top < 1){
		         var w = 0 - parseInt(windowWidth) / 2; //向左偏移窗体宽度的一半
		         var h = 0 - parseInt(windowHeight) / 2; //向上偏移窗体高度的一半
		         
		         windowBoxDiv.style.marginLeft = w + "px";
		         windowBoxDiv.style.marginTop  = h + "px";
	         }else{
		         windowBoxDiv.style.top = _top + "px";
		         windowBoxDiv.style.left = _left + "px";
	         }
	         
	         
	        
	        if(contentElementId){
	        	var ele = document.getElementById(contentElementId);
		        var table = "<table class='formTable' cellpadding='0' cellspacing='0' style='width:"+windowWidth+"px;height:"+windowHeight+"px'><tr class='formTitle' id='formTitle' onmousedown=\"formMove(event)\"><td style='font-size:12px;'>"+title+"</td><td class='close' align='right'>";
		        if(haveClose){
		        	table += "<a href='javascript:Win.hide();'><img src='"+root+"/images/message/close.gif' /></a>";
		        }
		        table += "</td></tr><tr><td colspan='2' class='contentTd'><div style='height:"+(windowHeight-28)+"px'>"+ele.innerHTML+"</div></td></tr></table>";
		        var formTable = document.createElement("table");
	        	if(ele != null){
	        		ele.style.display="none";
	        		windowBoxDiv.innerHTML = table;
	        		//var content = document.getElementById("formContent");
	        		//content.appendChild(ele);
	        		//windowBoxDiv.innerHTML = ele.innerHTML;
	        		document.body.removeChild(ele)
	        	}
	        }
	        document.body.appendChild(windowBoxDiv);
         }else{
         	windowBoxDiv.style.display="block";
         }
	},
	
	//删除弹出窗口
	close : function () {
		var md=document.getElementById("WindowBox");
	    if(md != null){
		    md.style.display = "none";
		    document.body.removeChild(md); 
	    }
	    Msg.closeDisplay();
	},
	
	//隐藏弹出窗口
	hide : function () {
		var md=document.getElementById("WindowBox");
	    if(md != null){
		    md.style.display = "none";
	    }
	    Msg.closeDisplay();
	}
}

	


//根据浏览器的大小自动改变屏蔽层的大小
window.onresize = function() {
		 var displayObj = document.getElementById("displayDivId"); 
		 if(displayObj!=null){
			 var width = document.body.clientWidth+document.body.scrollLeft+document.body.scrollWidth;
			 var height = document.body.clientHeight+document.body.scrollTop+document.body.scrollHeight;  
		     displayObj.style.width=width+"px";
			 displayObj.style.height=height+"px";
		 }
}
 





/****************移动层**************************/
var posX;
var posY;
var fdiv;       
function formMove(e)
{
	fdiv = document.getElementById("WindowBox");           
    if(!e) e = window.event;  //IE
    posX = e.clientX - parseInt(fdiv.style.left);
    posY = e.clientY - parseInt(fdiv.style.top);
    document.onmousemove = mousemove;           
}
document.onmouseup = function()
{
    document.onmousemove = null;
}
function mousemove(ev)
{
    if(ev==null) ev = window.event;//IE
    var _left = (ev.clientX - posX) + "px";
    fdiv.style.left = _left;
    fdiv.style.top = (ev.clientY - posY) + "px";
}

/****************移动层END**************************/
 //验证日期格式是否为yyyy-MM-dd或yyyy-M-d
function dateCheck(str){
    var reg=/^(\d{4})([-])(\d{1,2})([-])(\d{1,2})/;
    var b = reg.test(str);
    return b;
}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 