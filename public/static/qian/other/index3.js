var restSververDomain = location.protocol + "//" + document.domain + ":" + location.port + getContextPath();
var restSververPath = location.protocol + "//" + document.domain + ":" + location.port;
var WIDTHCOUNT = 352.847;
var HEIGHTCOUNT = 627.991;
var HEIGHTCOUNT_DOUBLE = 675;
var pageNumber;
function InitPage(currentViewType, keyword, currentPage, gpdfFile, suinId) {
    this.keyWord = keyword;
    this.currentPage = currentPage;
    this.gpdfFile = gpdfFile;

    this.SUINID = suinId;
    this.pageWidth = 465;
    this.pageHeight = 634;
    this.pdfPageCount = 0;
    this.pageCurrentData = {};
    this.pagePreviousData = {};
    this.pageNextData = {};
    this.pageLastData = {};
    this.wordFontSize = 19.499168;
    this.isFirst = true;
    this.currentViewType = currentViewType;
    this.tagObj = {};
    this.noteObj = {};
    this.scrollNode = {};
    this.scrollData = {};
}
$.extend(InitPage.prototype, {
    pageCurrent: function (callback) {
        // console.log(currentPage);
        var self = this;
        if (self.currentViewType == 'double') {/* 双页的异步加载*/
            self.pageNext();
            self.requestData(function (data) {
                console.log('pageCurrent');
                self.pageConfig(data.pageCount, data.title);

                self.pageCurrentData = data;
                self.render('#pageCurrent', self.pageCurrentData);
//                $('#box_content').myDrag({
//                    randomPosition:false,
//                    direction:'all',
//                    handler:false
//                });

                self.pagePrevious();
                self.pageLast();
            }, self.currentPage);

        } else {                                    //单页阅读
            self.requestData(function (data) {
                console.log('pageCurrent-else');
                self.pageConfig(data.pageCount, data.title);

                self.pageCurrentData = data;
                self.render('#pageCurrent', self.pageCurrentData);
                self.pagePrevious();
                self.pageNext();
                self.pageLast();
//                $('#box_content').myDrag({
//                    randomPosition:false,
//                    direction:'all',
//                    handler:false
//                });
            }, self.currentPage);
        }
    },
    pagePrevious: function () {
        var self = this;
        console.log(self.currentPage);
        // if (self.currentPage > 1) { // - michael
        if (self.currentPage >= 1) {
            self.requestData(function (data) {
                console.log(currentPage);
                console.log('pagePrevious');
                self.pagePreviousData = data;
            // }, self.currentPage - 1)
            }, self.currentPage)
        }

    },
    pageNext: function (callback) {
        var self = this;
        //if (self.currentPage < self.pageCount - 1) { // - michael
        if (self.currentPage < self.pageCount) {
            self.requestData(function (data) {
                // console.log('pageNext');
                self.pageNextData = data;
                if (self.currentViewType == 'double' || self.currentViewType == "scroll") {
                    self.render('#pageNext', self.pageNextData);
                }
                callback && callback();
            // }, parseInt(self.currentPage) + 2) // -michael
            }, parseInt(self.currentPage) + 1)
        }
    },
    pageLast: function (callback) {
        var self = this;
        if (self.currentPage < self.pageCount) {
            self.requestData(function (data) {
                // console.log('pageLast');
                self.pageLastData = data;
                if (self.currentViewType == "scroll") {
                    self.render('#pageLast', self.pageLastData);
                }
                callback && callback();
            // }, self.currentPage + 2) - michael
            }, self.currentPage + 1)
        }
    },
    nextPage: function () {
        var self = this;
        if (self.currentPage < self.pageCount) {
            self.hideWait();
            console.log(self.currentPage);
            self.currentPage += 1;
            console.log(self.currentPage);
            console.log('bbbbbbbbbbbbbb');
            self.pageMoveTransform('next', function() {
                self.updatePageNum(self.currentPage);

                /*当前页给上一页*/
                self.pagePreviousData = self.pageCurrentData;
                /*第三页给第当前页*/
                self.pageCurrentData = self.pageNextData;
                self.render('#pageCurrent', self.pageCurrentData);

                /*第四页给第三页*/
                self.pageNextData = self.pageLastData;
                if (self.currentViewType == 'double' && self.pageNextData) {
                    if (self.currentPage == self.pageCount) {
                        $('#box_content #pageNext').html("");
                    } else {
                        self.render('#pageNext', self.pageNextData);
                    }
                }
            });


            // if (self.currentPage < self.pageCount - 1) { - michael
            if (self.currentPage < self.pageCount) {
                /*获取最后一页*/
                self.pageLast();
            }
        } else {
           // alert("已经是最后一页！");
        }

    },
    previousPage: function () {
        var self = this;

        if (self.currentPage > 1) {
            self.hideWait();
            self.currentPage -= 1;
           self.pageMoveTransform('right', function(){
               self.updatePageNum(self.currentPage);
               /*第三页给最后一页*/
               self.pageLastData = self.pageNextData;

               /*第二页给第三页*/
               self.pageNextData = self.pageCurrentData;
               if (self.currentViewType == 'double' && self.pageNextData) {
                   self.render('#pageNext', self.pageNextData);
               }
               /*上一页给当前页*/
               self.pageCurrentData = self.pagePreviousData;
               self.render('#pageCurrent', self.pageCurrentData);
           });

            /*上一页从新获取*/
            self.pagePrevious();
        } else {
           // alert("已经是第一页！");
        }
    },
    requestData: function (callback, currentPage) {
        var self = this;
        var keyWord = self.keyWord;
        var gpdfFile = self.gpdfFile;
        // console.log(currentPage);
        // - michael
        // var urlAddr = restSververDomain + "/restcontrol/gpdfread/getGpdfContent/" + gpdfFile + "/" + currentPage + "/" +encodeURIComponent(keyWord);
        var urlAddr = restSververDomain + "/index/details/" + gpdfFile + "/" + currentPage + "/" +encodeURIComponent(keyWord);
        // var urlAddr = "http://182.18.36.71/platform/read.htm?rsdaId=711521610460081&pageId=1"
        // 去掉加载时候的加载文字提示20180405
        //self.wait("正在加载新一页");
        console.log(urlAddr);
        self.waitNoImg('')
        var isShowWaitProgress  = false;
        var timePress = null;
        $.ajax({
            url: urlAddr,
            method: "get",
            beforeSend:function () {
                clearTimeout(timePress);
                timePress =  setTimeout(function(){
                    if(!isShowWaitProgress){
                        self.wait("加载新页面中...")
                        console.log('加载新页面中...')
                    }
                }, 1000)
            },
            async: true,
            error: function (e) {
                self.closeWait();
                self.isError(e);
            },
            success: function (data) {
                console.log(data);
                //加载太快有问题  ,延迟去掉遮罩层
                var timer = null;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    self.closeWait();
                },1000);
                isShowWaitProgress = true
                pageNumber = data.pageCount;
                callback && callback(data);
            }
        })
    },
    setPageHeight: function () {
        var self = this;
        /*  var zoomRate = $(window).width()/16.01;
         $("#editZoomRate").val(zoomRate);
         $("#box_content").css({
         "width":WIDTHCOUNT+'px',
         "height":HEIGHTCOUNT+'px'
         });*/
    },
    lastPage: function () {
        var self = this;
        if (self.currentPage == self.pdfPageCount) {
            return true;
        }
    },
    render: function (wrapper, data) {
        var self = this;
        var zoomRate = self.zoomRate;

        self.setTextContentNew(zoomRate, wrapper, data);
    },

    setTextContentNew: function (zoomRate, wrapper, data) {
        var self = this;


        var textPlusHeight = 300;
        var textPlusWidth = 500;
        var marginWidth = data.marginWidth;
        var marginHeight = data.marginHeight;
        var pageContentWidth = (data.pageWidth);
        var pageContentHeight = (data.pageHeight);
        pdfPageCount = data.pageCount;
        if (pageContentWidth < textPlusWidth) {
            textPlusHeight = pageContentHeight * zoomRate;
            textPlusWidth = pageContentWidth * zoomRate;
        }
        else {
            textPlusWidth = textPlusWidth * zoomRate;
            zoomRate = textPlusWidth / pageContentWidth;
            textPlusHeight = pageContentHeight * zoomRate;
        }

        /*添加文字*/
        var textLayout = "";


        if  (data&&data.wordContentTab){
            var  wordContentTabLength = data.wordContentTab.length
            for (var index = 0; index < wordContentTabLength; index++) {
                var wordLeft = data.wordContentTab[index].wordTop * zoomRate +18;
                var wordTop = data.wordContentTab[index].wordLeft * zoomRate;

                if (wordTop < textPlusHeight - data.wordContentTab[index].wordWidth * zoomRate) {
                    var heightShowTxt = data.keyWord;
                    var heighttrad = Traditionalized(heightShowTxt);
                    var indexOf = heightShowTxt.indexOf(data.wordContentTab[index].wordText) ;
                    if( heighttrad.indexOf(data.wordContentTab[index].wordText)>-1){
                    	indexOf =  heighttrad.indexOf(data.wordContentTab[index].wordText);
                    	heightShowTxt = heighttrad;
                    }
                    if (indexOf  > -1) {
                    	
                	 	var hightWordFlag = true;
                        var wordArray = [];
                        for(var i=0;i<heightShowTxt.length;i++){
                        	wordArray[i] = heightShowTxt.substring(i,i+1);
                        }
                        
                        //自然  撒地方自然
                        try{
                        	for(var i =0 ;i<heightShowTxt.length;i++){
//                        		console.log("wordText:"+i );
//                        		console.log("wordArray"+wordArray[i] );
//                        		console.log("wordContentTab"+data.wordContentTab[index-indexOf+i].wordText );
                        		if(wordArray[i] != data.wordContentTab[index-indexOf+i].wordText ){
		                        	hightWordFlag = false;
		                        }
                        	}
                        }catch(e){
                        	//console.log("e"+e );
                        	hightWordFlag = false;
                        }
                         
                    	if(hightWordFlag){
                       		 textLayout = textLayout + '<span style="opacity: 0.3;position: absolute; top:' +
                            wordTop + 'px;left:' +
                            wordLeft + 'px;width:' +
                            data.wordContentTab[index].wordWidth * zoomRate + 'px;font-size:' +
                            data.wordContentTab[index].wordFontSize * zoomRate * 0.8 + 'px;background-color:#ee0728;color:#ee0728">' +
                            data.wordContentTab[index].wordText + '</span>';
                    	}else{
//                    		 textLayout = textLayout + '<span style=" position: absolute; top:' +
//	                            wordTop + 'px;left:' +
//	                            wordLeft + 'px;width:' +
//	                            data.wordContentTab[index].wordWidth * zoomRate + 'px;font-size:' +
//	                            data.wordContentTab[index].wordFontSize * zoomRate * 0.8 + 'px">' +
//	                            data.wordContentTab[index].wordText + '</span>';
                    	}
                            
                    }
                    else {
//                        textLayout = textLayout + '<span style=" position: absolute; top:' +
//                            wordTop + 'px;left:' +
//                            wordLeft + 'px;width:' +
//                            data.wordContentTab[index].wordWidth * zoomRate + 'px;font-size:' +
//                            data.wordContentTab[index].wordFontSize * zoomRate * 0.8 + 'px">' +
//                            data.wordContentTab[index].wordText + '</span>';
                    }
                }
            }
        }

        var tpl = '';
        tpl += '<div  class="gpdfReadPlus">';
        tpl += '<div  class="readPlusImage">';
        tpl += '<div  class="contentImage"><img id="pageimage"></div>';
        tpl += textLayout;
       // tpl += '<div class="readPlusText">' + textLayout + '</div>';
        tpl += '</div></div>';


        if (self.currentViewType == 'scroll') {
            wrapper = $('.scoroolWrapper').find(wrapper);
            wrapper.html("").append(tpl);
            wrapper.addClass('bookPage' + data.pageNum);
        } else {
            wrapper = $('body').find(wrapper);
            wrapper.html("").append(tpl);
            wrapper.attr('class','page bookPage' + data.pageNum);
        }


        self.isTag(wrapper, data);
        self.isNote(wrapper, data);


        wrapper.find(".readPlusImage").css({
            "width": textPlusWidth,
            "height": textPlusHeight
        });

        wrapper.find(".gpdfReadPlus").css({
            "width": textPlusWidth,
            "height": textPlusHeight
        });
        wrapper.find(".contentImage").css({
            "width": textPlusWidth,
            "height": textPlusHeight
        });
        wrapper.find(".readPlusText").css({
            "width": textPlusWidth,
            "height": textPlusHeight
        });


        WIDTHCOUNT = textPlusWidth;
        HEIGHTCOUNT = textPlusHeight;
        if (self.currentViewType == 'scroll') {
            /*  $('.scoroolWrapper').width(WIDTHCOUNT + 'px');
             $(".scoroolWrapper").find('.page').css({
             "width": WIDTHCOUNT + 'px',
             "height": HEIGHTCOUNT + 'px'
             });*/
            /* ;*/
            /* self.setScrollPageHeightArr();
             self.addMorePage()*/

        } else if (self.currentViewType == 'single') {
            $("#box_content").show().css({
                "width": WIDTHCOUNT + 'px',
                "height": HEIGHTCOUNT + 'px'
            });
        } else if (self.currentViewType == 'double') {
            $('#bookWrap').removeClass('view-single').removeClass('view-scroll').addClass('view-double');
            $("#box_content").show().css({
                "width": WIDTHCOUNT * 2 + 50 + 'px',
                "height": HEIGHTCOUNT + 'px'
            });
        }
        /* 添加图片*/
        wrapper.find('.contentImage').html("");
        // alert(data);
        // console.log(data);
        console.log(data.title);
        for (var imgindex = 0; imgindex < data.pageImage.length; imgindex++) {
            var imgtop = data.pageImage[imgindex].imageTop * zoomRate + 3.1;
            var imgleft = data.pageImage[imgindex].imageLeft * zoomRate + 2 - 0.2;
            var imgWidth = data.pageImage[imgindex].imageWidth * zoomRate;
            var imgHeight = data.pageImage[imgindex].imageHeight * zoomRate;

            var imgcontent = data.pageImage[imgindex].imageBytes;
            var imgtype = data.pageImage[imgindex].imageType;
            var pageImage = document.createElement("img");
            var imgtype = "png";
            pageImage.src = "data:image/" + imgtype + ";base64," + imgcontent.replace(/\n/g, "");
            pageImage.setAttribute("id", "pageimage" + imgindex);
            wrapper.find('.contentImage').append(pageImage);

            setTimeout(function() {
                $("#pageimage" + imgindex).css({
                    "top": imgtop,
                    "left": imgleft,
                    "height": imgHeight,
                    "position": "absolute",
                    "display": 'none'
                }).fadeIn();
            }, 500)
        }
    },


    getPageHeight: function (callback) {
        var self = this;
        $('body').addClass('hideLuiWait');
        self.requestData(function (data) {
            console.log('getPageHeight');
                if ($("#lui-wait").length > 0) {
                    $("#lui-wait").remove();
                    $('body').removeClass('hideLuiWait');
                }

            var zoomRate = self.zoomRate;
            var textPlusHeight = 300;
            var textPlusWidth = 500;
            var marginWidth = data.marginWidth;
            var marginHeight = data.marginHeight;
            var pageContentWidth = (data.pageWidth);
            var pageContentHeight = (data.pageHeight);
            pdfPageCount = data.pageCount;
            if (pageContentWidth < textPlusWidth) {
                textPlusHeight = pageContentHeight * zoomRate;
                textPlusWidth = pageContentWidth * zoomRate;
            }
            else {
                textPlusWidth = textPlusWidth * zoomRate;
                zoomRate = textPlusWidth / pageContentWidth;
                textPlusHeight = pageContentHeight * zoomRate;
            }

            WIDTHCOUNT = textPlusWidth;
            HEIGHTCOUNT = textPlusHeight;

            callback&&callback();
        } , self.currentPage);

    },
    bindEvent: function () {
        var self = this;
        $('.toolbar').on('click', '#zoomOut', function () {
            self.zoomOut();
        });
        $('.toolbar').on('click', '#zoomIn', function () {
            self.zoomIn();
        });

        /*切换阅读模式*/
        $('.toolbar-view-btn').off().on('click', function (e) {
            var currentId = e.currentTarget.id;
            // alert(currentId);
            /*
             if($(this).hasClass('toolbar-view-btn-selected'))return;
             */
            $('.toolbar-view-btn').removeClass('toolbar-view-btn-selected');
            $(this).addClass('toolbar-view-btn-selected');
            switch (currentId) {
                case "viewTypeSingle":
                    $('.toolbar').removeClass('title-view-double').removeClass('title-view-scroll').addClass('title-view-single');
                    self.currentViewType = "single";

                    break;
                case  "viewTypeDouble":
                    $('.toolbar').removeClass('title-view-single').removeClass('title-view-scroll').addClass('title-view-double');
                    self.currentViewType = "double";

                    break;
                case  "viewTypeScroll":
                    $('#bookWrap').removeClass('view-double').removeClass('view-single').addClass('view-scroll');
                    $('.toolbar').removeClass('title-view-double').removeClass('title-view-single').addClass('title-view-scroll');
                    self.currentViewType = "scroll";

                    break;
                default :
                    $('#bookWrap').removeClass('view-double').removeClass('view-scroll').addClass('view-single');
                    $('.toolbar').removeClass('title-view-double').removeClass('title-view-scroll').addClass('title-view-single');

                    self.currentViewType = "singe";

                    break;
            }
            self.initPageFromCurrentViewType();
        });

        /*输入页码*/
        $('#updatePageNum').on('keyup', function (e) {
            if (e.keyCode == 13) {
                $('.updatePageNumBtn').click();
            }
        });
        $('.updatePageNumBtn').on('click', function () {
            var pageValue = $('#updatePageNum').val();
            if (isNaN(Number(pageValue))) {  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                alert("请输入数字!")
            } else {
                if (parseInt(pageValue) <= 0) {
                    alert("请输入大于零的页码!")
                } else if (parseInt(pageValue) > self.pageCount) {
                    alert("请输入小于总页数的页码!")
                } else {
                    self.currentPage = parseInt(pageValue);
                    $('#updatePageNum').blur();
                    self.initPageFromCurrentViewType();
                }
            }
        }); 

        $('.turnPageMask').on('mouseenter', function (e) {
            var curId = $(this).attr("id");
            switch (curId) {
                case "leftTopMask":
                    $('.leftTop').css({
                        "transform": "translateX(100%) translateY(100%)"
                    });
                    break;
                case "rightTopMask":
                    $('.rightTop').css({
                        "transform": "translateX(-100%) translateY(100%) rotate(90deg)"
                    });
                    break;
                case "leftBottomMask":
                    $('.leftBottom').css({
                        "transform": "translateX(100%) translateY(-100%) rotate(-90deg)"
                    });
                    break;
                case "rightBottomMask":
                    $('.rightBottom').css({
                        "transform": "translateX(-100%) translateY(-100%) rotate(180deg)"
                    });
                    break;
            }
        });
        $('.turnPageMask').on('mouseout', function (e) {
            var curId = $(this).attr("id");
            switch (curId) {
                case "leftTopMask":
                    $('.leftTop').css({
                        "transform": "translateX(-100%) translateY(-100%)"
                    });
                    break;
                case "rightTopMask":
                    $('.rightTop').css({
                        "transform": "translateX(100%) translateY(-100%) rotate(90deg)"
                    });
                    break;
                case "leftBottomMask":
                    $('.leftBottom').css({
                        "transform": "translateX(-100%) translateY(100%) rotate(-90deg)"
                    });
                    break;
                case "rightBottomMask":
                    $('.rightBottom').css({
                        "transform": "translateX(100%) translateY(100%) rotate(180deg)"
                    });
                    break;
            }
        });

        $('#leftTopMask').on('mouseup', function () {
            self.previousPage();
        });

        $('#leftBottomMask').on('mouseup', function () {
            self.previousPage();
        });
        $('#rightTopMask').on('mouseup', function () {
            self.nextPage();
        });
        $('#rightBottomMask').on('mouseup', function () {
            self.nextPage();
        });


        /*第一页*/
        $('.l-panel-bbar-inner').on('click', '.l-bar-btnfirst', function () {
            if(self.currentViewType == 'scroll'){
                alert('滚动模式，滚动加载新一页');
                return;
            }
            self.currentPage = 1;
            self.initPageFromCurrentViewType();

        });

        /*上一页*/
        $('.l-panel-bbar-inner').on('click', '.l-bar-btnprev', function () {
            if(self.currentViewType == 'scroll'){
                alert('滚动模式，滚动加载新一页');
                return;
            }
            self.previousPage();
        });

        /*下一页*/
        $('.l-panel-bbar-inner').on('click', '.l-bar-btnnext', function () {
            if(self.currentViewType == 'scroll'){
                alert('滚动模式，滚动加载新一页');
                return;
            }
            self.nextPage();
        });
        /*最后一页*/
        $('.l-panel-bbar-inner').on('click', '.l-bar-btnlast', function () {
            if(self.currentViewType == 'scroll'){
                alert('滚动模式，滚动加载新一页');
                return;
            }
            self.currentPage = pageNumber;
            self.initPageFromCurrentViewType();
        });


        /*搜索*/
        $('#J_BookSearchBtn').on('click', function () {
            var key = $.trim($('#J_BookSearchInput').val());
            if (key == "") return;
            if (key == "*&*") return;
            $("#J_SearchAll").removeClass('open').css({"right": 0});

            $("#J_SearchAll").slideLeftShow(500);
            self.renderSearchList(key);
            self.keyWord = key;
        });
        /*搜索跳转页面*/
        $('#J_SearchAll').on('click', '.J_SearchAllRead', function (e) {
            var curPage = $(this).attr('data-page');
            self.currentPage = parseInt(curPage);
            self.initPageFromCurrentViewType();
            //  self.closeSearchDialog();

            $('.button-show').click();
        });

        /*关闭搜索*/
        $('#J_SearchClear').on('click', function () {
            self.closeSearchDialog();
        });
        $('#J_BookSearchInput').on('keyup', function (e) {
            if (e.keyCode == 13) {
                $('#J_BookSearchBtn').click();
            }
        });
        /* 隐藏显示搜索框*/
        $('.button-show').on('click', function () {
            if ($("#J_SearchAll").hasClass("open")) {
                $("#J_SearchAll").removeClass('open').animate({
                    "right": "0"
                }, 500);
                $(this).html('&lt');
            } else {
                $("#J_SearchAll").addClass('open').animate({
                    "right": "-310px"
                }, 500);
                $(this).html('&gt');
            }

        });


        /*添加书签*/
        $('#print').on('click', function () {


            if (!self.isLogin()) return;
            $('#layui-layer-shade2').show();
            $('#layui-layer2').show();
            $('.download-dialog-start').val($('#updatePageNum').val());
            $('.layui-layer-title').html('添加书签');
            $('#addInput').html('<label>描 述： </label><input id="currentReadTagName" type="text" class="download-dialog-end download-dialog-end1" name="comment">');

            self.isTagDialog = true;
            self.isNoteDialog = false;
        });
        /*添加笔记*/
        $('#addNode').on('click', function () {

            if (!self.isLogin()) return;
            $('#layui-layer-shade2').show();
            $('#layui-layer2').show();
            $('.download-dialog-start').val($('#updatePageNum').val());
            $('.layui-layer-title').html('添加笔记');
            $('#addInput').html('<label class="note-title">笔 记：</label><textarea id="currentReadTagName" class="download-dialog-end download-dialog-end2"></textarea>');

            // $('#addInput').html('<div class="noteTitle">笔记：</div><texteare id="currentReadTagName" type="textarea" class="download-dialog-end2" name="comment"></texteare>');

            self.isNoteDialog = true;
            self.isTagDialog = false;
        });


        $('.layui-layer-btn0').on('click', function () {
            $.cookie("currentReadPageNumber", $('.download-dialog-start').val());
            var tagPage = $('.download-dialog-start').val();
            var tagContent = $('#addInput').find("#currentReadTagName").val();


            if (isNaN(Number(tagPage))) {  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                alert("请输入数字!")
            } else {
                if (parseInt(tagPage) <= 0) {
                    alert("请输入大于零的页码!")
                } else if (parseInt(tagPage) > self.pageCount) {
                    alert("请输入小于总页数的页码!")
                } else {
                    self.currentPage = parseInt(tagPage);




                    if(self.isTagDialog){
                        self.tagObj[tagPage] = tagContent;
                        $.cookie("tag", JSON.stringify(self.tagObj));
                        $("#box_content").find('.bookPage'+tagPage).append('<span class="tagName"></span>');
                        $(".scoroolWrapper").find('.bookPage'+tagPage).append('<span class="tagName"></span>');
                    }

                    if(self.isNoteDialog){
                        self.noteObj[tagPage] = tagContent;
                        $.cookie("note", JSON.stringify(self.noteObj));
                        $("#box_content").find('.bookPage'+tagPage).append('<span class="noteName"></span>');
                        $(".scoroolWrapper").find('.bookPage'+tagPage).append('<span class="noteName"></span>');
                    }
                    self.closeTagDialog();
                }
            }
        });
        /* 关闭书签*/
        $('.layui-layer-btn1').on('click', function () {
            self.closeTagDialog();
        });
        $('.layui-layer-close1').on('click', function () {
            self.closeTagDialog();
        });
        /*显示书签列表*/
        $('.title-content').on('click', '.title-icon', function (e) {

            var tarNodeId = e.currentTarget.id;
            if (tarNodeId == "tagList") {
                $("#tagListBox").slideLeftShow(500);
                self.initTagList();
            } else if (tarNodeId == "nodeList") {
                $("#tagListBox").slideLeftShow(500);
                self.initNoteList();
            } else if (!$('#tagListBox').is(":hidden")) {
                self.closeTagListDialog();
            }
        });
        /*书签跳转页面*/
        $('#tagListBox').on('click', '.J_SearchAllRead', function (e) {
            var curPage = $(this).attr('data-page');
            self.currentPage = curPage;
            self.initPageFromCurrentViewType();
            self.closeTagListDialog();
        });
        /*删除书签*/
        $('#tagListBox').on('click', '.delete-tag', function (e) {
            var curPage = $(this).parent().find('.J_SearchAllRead').attr('data-page');
            $(this).parents(".search-all-box-item").remove();
            delete self.tagObj[curPage];
            $.cookie("tag", JSON.stringify(self.tagObj));
            $("#box_content").find('.bookPage'+curPage).find(".tagName").remove();
            if ($('#tagListBox').find("ul li").length == 0) {
                var tpl = "<li class='emptySecrch'>书签为空</li>"
                $('#tagListBox').find("ul").empty().append(tpl)
            }
        });
        /*删除笔记*/
        $('#tagListBox').on('click', '.delete-note', function (e) {
            var curPage = $(this).parent().find('.J_SearchAllRead').attr('data-page');
            $(this).parents(".search-all-box-item").remove();
            delete self.noteObj[curPage];
            $.cookie("note", JSON.stringify(self.noteObj));
            $("#box_content").find('.bookPage'+curPage).find(".noteName").remove();
            if ($('#tagListBox').find("ul li").length == 0) {
                var tpl = "<li class='emptySecrch'>笔记为空</li>"
                $('#tagListBox').find("ul").empty().append(tpl)
            }
        });

    },
    closeTagDialog: function () {
        $('#layui-layer-shade2').hide();
        $('#layui-layer2').hide();
    },
    initPageFromCurrentViewType: function () {
        var self = this;
        if (self.currentViewType == 'scroll') {

            self.initZoomRate();
            self.viewTypeScroll();
        } else if (self.currentViewType == 'single') {
            self.viewTypeSingle();
        } else if (self.currentViewType == 'double') {
            self.viewTypeDouble();
        }
    },
    closeSearchDialog: function () {
        $("#J_SearchAll").slideLeftHide(500);
        $('#J_SearchAllTitle').empty();
        $('#J_SearchAllList').empty();
        $('#J_BookSearchInput').empty();
    },
    closeTagListDialog: function () {
        $("#tagListBox").slideLeftHide(500);
        $('#tagListBox').empty();
    },
    /*渲染搜索列表*/
    renderSearchList: function (key) {
        var self = this;
        key = Traditionalized(key);
        self.requestSearchData(function (data) {
            var bookName = $('.toolbar-title').html();
            $('#J_SearchAllTitle').empty().html("在【" + bookName + "】找到与" + key + "相关的內容共【" + data.response.numFound + "】次，如下所示:");
            var datas = data.response.docs;

            var tpl = '';
            if (datas.length == 0) {
                tpl = "<li><div class='emptySecrch'>搜索内容为空</div></li>";
            }
            for (var i = 0; i < datas.length; i++) {
                var str = datas[i].content_solr_s;
                var keyLen = key.length;
                var num = str.indexOf(key);
                var str1 = str.substring(num - 10, num);
                var str2 = str.substring(num + keyLen, num + 10);

                //	str = str.substring(2,5)
                //    var $li = '<li class="search-all-box-item"><h4 class="search-all-box-item-chapter">' + (i + 1) + '.' + str1 + '<span style="color:#1b6197">' + key + '</span>' + str2 + '</h4><div class="search-all-box-item-page"><a data-page="' + datas[i].rsda_pdf_i + '" class="J_SearchAllRead" style="margin-right:20px;" href="javascript:;">P' + datas[i].rsda_pdf_i + '. 本页阅读</a><span class="qnjs q-blue">1</span></div></li>';
                var $li = '<li class="search-all-box-item"><h4 class="search-all-box-item-chapter">' + (i + 1) + '.' + str1 + '<span style="color:#1b6197">' + key + '</span>' + str2 + '</h4><div class="search-all-box-item-page"><a data-page="' + datas[i].rsda_pdf_i + '" class="J_SearchAllRead" style="margin-right:20px;" href="javascript:;">P' + datas[i].rsda_pdf_i + '. 本页阅读</a></div></li>';
                tpl += $li;
            }
            $('#J_SearchAllList').empty().append($('<ul>' + tpl + '</ul>'));
        }, key);
    },
    requestSearchData: function (callback, key) {
        var self = this;
        var rsda_id_s_number = self.gpdfFile;
//        var keyVal = encodeURIComponent("*" + Traditionalized(key) + "*");
//        var keyValTrad = encodeURIComponent("*" + Simplized(key) + "*");
//        var url = restSververPath + "/solr/gw/select?fq=content_solr_s:" + keyVal + " or content_solr_s:" + keyValTrad +  "&fq=rsda_id_s:" + rsda_id_s_number + "&indent=on&q=*:*&sort=rsda_pdf_i%20asc&wt=json&rows=1000";
//        
        self.wait("正在搜索");
        var keyVal = ("*" + Traditionalized(key) + "*");
        var keyValTrad = ("*" + Simplized(key)  + "*");
 //       var content_solr_s =  encodeURIComponent( "content_solr_s:" + keyVal + " or content_solr_s:" + keyValTrad )
       
        
            //var p = "/select?q=rsda_id_s:" + rsda_id_s_number + "&fq=" + content_solr_s + "&indent=on&sort=rsda_pdf_i%20asc&wt=json&rows=1000"
//	    var p = "/select?q=rsda_id_s:" + rsda_id_s_number + "&indent=on&sort=rsda_pdf_i%20asc&wt=json&rows=1000"
//	    var url =  restSververPath + "/ebook/platform/search.htm?action=searchKeyWord";
//	    
//        alert(key);
	    var data  = new Object();
	   
	    var p = "/select?q=rsda_id_l:" + rsda_id_s_number + "&indent=on&sort=rsda_pdf_i%20asc&wt=json&rows=1000"
        var url =  restSververPath + "/platform/search.htm?action=searchKeyWord";

	    var data  = new Object();
	    data.p = p;
	    data.keyWord =  key ;
        $.ajax({
            url: url, 
            data: data,
            method: "get",
            async: true,
            error: function (e) {
                self.closeWait();
                self.isError(e);
            },
            success: function (data) {
                self.closeWait();
                callback && callback(JSON.parse(data));
            }
        })
    },
    /*	翻书动画*/
    pageMoveTransform: function (dir, callback) {
        var self = this;
      //  var moveBar = $('<span class="pageMove pageMove' + dir + '"></span>');

        var moveWidth = $('.page_content').width();
        var roll = $("<div></div>", {
            css: {
                position: "absolute",
                border: "solid 1px #999",
                left: dir === 'next' ? (moveWidth + "px") : ('-'+moveWidth + "px"),
                top: "0",
                height: "100%",
                width: moveWidth + "px",
                background: "#fff",
                'z-index': 1000
            }
        }).appendTo($('.page_content'));
       // $('.page_content').append(moveBar);

        $(roll).animate({
            left: "0",
            width: self.currentViewType == 'double' ?  (parseInt(moveWidth) / 2 + "px") :(parseInt(moveWidth) + 'px')
        }, 1000, function () {
          //  $("#left").css({"background": "#fff"})
            callback&& callback()
            $(roll).fadeOut(300, function () {
                $(roll).remove();
            })
        });

       /* if (dir == "Previous") {
            $('.page_content').find('.pageMove').css({
                'left': moveWidth + 'px'
            });
            moveWidth = ( -moveWidth) + "px";
            $('.page_content').find('.pageMove').css({
                "transform": "translateX(0)",
                "transition": " All 1s ease-in-out"
            }).on('transitionend', function () {
               //  $(this).remove();
            });

        } else {
            moveWidth = moveWidth + "px";
            $('.page_content').find('.pageMove').css({
                "transform": "translateX(" + moveWidth + ")",
                "transition": " All 1s ease-in-out"
            }).on('transitionend', function () {
              //  $(this).remove();
            });
        }*/
        /*  var movePage='<div id="transPage" class="transPage transPage'+dir+'"><div class="front"></div><div class="back"></div><div/>';
         $('.page_content').append(movePage);
         var  $movePage = $('.page_content').find('.transPage');
         var timer = null;
         if (dir == "Previous") {
         $movePage.css({
         "transform": "perspective(800px) rotateY(180deg)",
         "-webkit-transform": "perspective(800px) rotateY(180deg)",
         "transition": " All 1s ease-in-out",
         " -webkit-transition": " All 1s ease-in-out"
         })
         } else {
         $movePage.css({
         "transform": "perspective(800px) rotateY(180deg)",
         " -webkit-transform": "perspective(800px) rotateY(180deg)",
         "transition": " All 1s ease-in-out",
         " -webkit-transition": " All 1s ease-in-out"
         })
         }
         clearTimeout(timer)
         timer = setTimeout(function(){
         if($movePage.length>0&&$('.lui-wait'.length!=0)){
         /!* $movePage.remove();*!/
         }
         },2000)*/
    },
    //滚动加载，懒加载每一页
    addMorePage: function () {
        var self = this;
        $(".scoroolWrapper").find('.page').scrollLoading({
            attr: 'data-page-number',
            container: "#bookWrap",
            callback: function (o) {
                var scrollPageNumber = this.attr('data-page-number');
                var $scrollPageNode = "#" + this.attr('id');

                self.requestData(function (data) {
                    consolog.log('addMorePage');
                    self.render($scrollPageNode, data);
                }, scrollPageNumber);
                self.closeWait();
            }
        });
    },
    //获取默认缩放比例
    initZoomRate: function () {
        var self = this;
        var zoomRate = $(window).width() / 16.01;
        $("#editZoomRate").val(zoomRate);
        self.zoomRate = Number($("#editZoomRate").val()) / 100;

    },
    //滚动模式
    viewTypeScroll: function () {
        var self = this;
        $('#box_content').hide();
        $('#pageCurrent').html("");
        $('#pageNext').html('');
        $('.scoroolWrapper').empty();

        $('body').addClass('hideLuiWait');
        self.getPageHeight(function () {
            var num = pageNumber + 1;
            var scrollTpl = "";
            for (var i = 1; i < num; i++) {
                var scrollPage = '<div data-page-number="' + i + '" id="scrollPage' + i + '"  class="page newPage"><span class="load-img"></span></div>';

                scrollTpl += scrollPage;
            }
            $('.scoroolWrapper').append(scrollTpl);

            self.setScrollPageHeightArr();
            //定位到目标页
            var scP = "scrollPage" + self.currentPage;
            window.location.hash = "";
            window.location.hash = scP;
            self.currentViewType = "scroll";
            // self.updatePageNum(self.currentPage);
            self.addMorePage();
        });

    },

    setScrollPageHeightArr: function () {
        var self = this;

        $('.scoroolWrapper').width(WIDTHCOUNT + 'px');
        $(".scoroolWrapper").find('.page').css({
            "width": WIDTHCOUNT + 'px',
            "height": HEIGHTCOUNT + 'px'
        });

        var sArr = [];
        var onePageOutHeight = $('.scoroolWrapper').find('.page').height() + 5;
        for (var i = 0; i < pageNumber; i++) {
            var curH = ( onePageOutHeight * i);
            sArr.push(curH);
        }

        $('.view-scroll').off().on('scroll', function () {
            var scrollTimer = null;
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function () {
                var scrollTopNum = $('.view-scroll').scrollTop() + 60;
                for (var j = 1; j < sArr.length; j++) {
                    if (scrollTopNum > sArr[j] && scrollTopNum < sArr[j + 1]) {
                        if (j == sArr.length || j == (sArr.length - 1)) {
                            self.updatePageNum(j);
                        } else {
                            self.updatePageNum(j + 1);
                        }
                    }
                   /* if(scrollTopNum< sArr[1]){
                        self.updatePageNum(1);
                    }*/
                }
            }, 100)
        });
    },
    renderScroll: function () {
        var self = this;
    },
    viewTypeSingle: function () {
        var self = this;
        $('.scoroolWrapper').empty();
        $("#box_content").find('.page').empty();
        window.location.hash = "";
        self.initZoomRate();
        self.getPageHeight(function(){
            $('#bookWrap').removeClass('view-double').removeClass('view-scroll').addClass('view-single');
            $("#box_content").show().css({
                "width": WIDTHCOUNT + 'px',
                "height": HEIGHTCOUNT + 'px' 
            });
            self.currentViewType = 'single';
            // console.log(currentPage);
            self.updatePageNum(self.currentPage);
            self.pageCurrent();
        });


    },
    viewTypeDouble: function () {
        var self = this;
        $('.scoroolWrapper').empty();

        window.location.hash = "";

        self.initZoomRate();

      /*  self.getPageHeight(function(){

        });*/
        $("#box_content").find('.page').empty();


        self.currentViewType = 'double';
        self.updatePageNum(self.currentPage);

        self.pageCurrent();

    },
    /*放大*/
    zoomOut: function () {
        var self = this;
        var zoomRate = 100;
        var editZoomRate = Number($("#editZoomRate").val());
        if (editZoomRate < 160) {
            editZoomRate = editZoomRate + 10;
            $("#editZoomRate").val(editZoomRate);
            zoomRate = Number($("#editZoomRate").val()) / 100;

            self.zoomRate = zoomRate;

            if (self.currentViewType == 'single') {

                self.setTextContentNew(zoomRate, '#pageCurrent', self.pageCurrentData);

            } else if (self.currentViewType == 'double') {
                self.setTextContentNew(zoomRate, '#pageCurrent', self.pageCurrentData);
                self.setTextContentNew(zoomRate, '#pageNext', self.pageNextData);
            } else if (self.currentViewType == 'scroll') {
                /*   var scrollNodeCurrent = self.scrollNode;
                 for(var key in scrollNodeCurrent){
                 self.setTextContentNew(zoomRate , key , scrollNodeCurrent[key]);
                 }*/

                self.viewTypeScroll();
            }
        }
        else {
            alert("已经是最大。");
        }
        
    },
    /*缩小*/
    zoomIn: function () {
        var self = this;
        var zoomRate = 100;
        var editZoomRate = Number($("#editZoomRate").val());
        self.zoomRate = zoomRate;

        if (editZoomRate > $(window).width() / 16.01) {
            editZoomRate = editZoomRate - 10;
            $("#editZoomRate").val(editZoomRate);
            zoomRate = Number($("#editZoomRate").val()) / 100;

            self.zoomRate = zoomRate;
            if (self.currentViewType == 'single') {
                self.setTextContentNew(zoomRate, '#pageCurrent', self.pageCurrentData);
            } else if (self.currentViewType == 'double') {
                self.setTextContentNew(zoomRate, '#pageCurrent', self.pageCurrentData);
                self.setTextContentNew(zoomRate, '#pageNext', self.pageNextData);
            } else if (self.currentViewType == 'scroll') {
                /* var scrollNodeCurrent = self.scrollNode.length;
                 self.setTextContentNew(zoomRate , self.scrollNode[0] , self.scrollData[0]);*/

                self.viewTypeScroll();
            }
        } else {
            alert("已经是最小。");
        }
    },
    /*更新输入框页码*/
    updatePageNum: function (num) {
        var self = this;
        $('#updatePageNum').val(num);
        // console.log(num);
        // console.log(currentPage);
        self.currentPage = num;
    },
    /*总页码*/
    pageConfig: function (num, title) {
        var self = this;
        $('#pageCount').html(num);
        $('.toolbar-title').html(title).attr('title', title);

        self.pageCount = num;
    },
    isError: function (e) {
        var self = this;
        //
        //   $('#box_content').html("加载失败，请刷新");

        $('#closeOnlaodDialog').show();
        $('#layui-layer-shade3').show();
        $('#closeOnlaod').on('click', function () {
            location.reload();
        });
    },
    wait: function (str) {
        var waitHtml = $('<div class="lui-wait" id="lui-wait"><span></span><div class="lui-tips toast"><div class="tips-toast">' + str + '</div></div></div>');
        if ($("#lui-wait").length) {
            waitHtml.appendTo($('body'));
            this.isLoading = true;
        }
    },
    // 只是添加遮罩层，无图片
    waitNoImg: function (str) {
        var waitHtml = $('<div class="lui-wait" id="lui-wait"><div class="tips-toast">' + (str ? str : "") + '</div></div>');
        if (!$("#lui-wait").length) {
            waitHtml.appendTo($('body'));
            this.isLoading = true;
        }
    },
    closeWait: function () {
        if ($("#lui-wait").length > 0) {
            $("#lui-wait").remove();
            $('body').removeClass('hideWait');
            this.isLoading = false;

            $('.pageMove').css({
                "left": 0
            })
        }
    },
    hideWait: function () {
        $('body').addClass('hideWait');
    },
    isTag: function (obj, page) {
        var self = this;
        //获取标签信息
        var currentTag = $.cookie("tag") ? JSON.parse($.cookie("tag")) : {};
        self.tagObj = currentTag;
        for (tagPage in currentTag) {
            if (tagPage == page.pageNum) {
                $('#bookWrap').find(obj).append('<span class="tagName"></span>');
            }
        }
    },
    isNote: function (obj, page) {
        var self = this;
        //获取标签信息
        var currentNote = $.cookie("note") ? JSON.parse($.cookie("note")) : {};
        self.noteObj = currentNote;
        for (tagPage in currentNote) {
            if (tagPage == page.pageNum) {
                $('#bookWrap').find(obj).append('<span class="noteName"></span>');
            }
        }
    },
    initTagList: function () {
        var self = this;
        var currentTag = $.cookie("tag") ? JSON.parse($.cookie("tag")) : {};
        var i = 0;
        var tpl = '';
        var tpl1 = '<div class="search-all-box-header">书签列表<a  class="search-all-clear" id="closeTagDialog" href="javascript:;">×</a></div>';

        for (tagPage in currentTag) {
            i += 1;
            var $li = '<li class="search-all-box-item"><h4 class="search-all-box-item-chapter">' + i + '.<span style="color:#1b6197"></span></h4><h3>书签内容：' + currentTag[tagPage] + '</h3><div class="search-all-box-item-page"><a data-page="' + tagPage + '" class="J_SearchAllRead" style="margin-right:20px;" href="javascript:;">P' + tagPage + '. 本页阅读</a><span class="delete-tag">×</span></div></li>';
            tpl += $li;
        }
        if(i==0){
            tpl = "<li class='emptySecrch'>书签为空</li>"
        }
        $('#tagListBox').empty().append(tpl1 + '<ul>' + tpl + '</ul>');
        /*设置高度*/
        $("#tagListBox ul").height($(window).height()-30-48+'px');
        $('#tagListBox').find('#closeTagDialog').on('click', function () {
            self.closeTagListDialog();
        })
    },
    initNoteList: function () {
        var self = this;
        var currentTag = $.cookie("note") ? JSON.parse($.cookie("note")) : {};
        var i = 0;
        var tpl = '';
        var tpl1 = '<div class="search-all-box-header">笔记列表<a  class="search-all-clear" id="closeTagDialog" href="javascript:;">×</a></div>';

        for (tagPage in currentTag) {
            i += 1;
            var $li = '<li class="search-all-box-item"><h4 class="search-all-box-item-chapter">' + i + '.<span style="color:#1b6197"></span></h4><h3>笔记内容：' + currentTag[tagPage] + '</h3><div class="search-all-box-item-page"><a data-page="' + tagPage + '" class="J_SearchAllRead" style="margin-right:20px;" href="javascript:;">P' + tagPage + '. 本页阅读</a><span class="delete-note">×</span></div></li>';
            tpl += $li;
        }
        if(i==0){
            tpl = "<li class='emptySecrch'>笔记为空</li>"
        }
        $('#tagListBox').empty().append(tpl1 + '<ul>' + tpl + '</ul>');
        /*设置高度*/
        $("#tagListBox ul").height($(window).height()-30-48+'px');

        $('#tagListBox').find('#closeTagDialog').on('click', function () {
            self.closeTagListDialog();
        })
    },
    isLogin2: function () {
        var self = this;
        var uId = self.SUINID;
        if (uId == "") {

            $('#loginDiv').show();
            return false;
        } else {
            return true;
        }
    },
    isLogin: function () {
            return true;
    }
});


jQuery.fn.slideLeftHide = function (speed, callback) {
    this.animate({
        width: "hide",
        paddingLeft: "hide",
        paddingRight: "hide",
        marginLeft: "hide",
        marginRight: "hide"
    }, speed, callback);
};
jQuery.fn.slideLeftShow = function (speed, callback) {
    this.animate({
        width: "show",
        paddingLeft: "show",
        paddingRight: "show",
        marginLeft: "show",
        marginRight: "show"
    }, speed, callback);
};

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

$('#J_BookSearchInput').val(decodeURIComponent(GetQueryString("keyWord")));
$("#J_SearchAllList").height($(window).height()-30-48-48+'px');


function JTPYStr()
{
    return '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';
}
function FTPYStr()
{
    return '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';
}
function Traditionalized(cc){
    var str='',ss=JTPYStr(),tt=FTPYStr();
    for(var i=0;i<cc.length;i++)
    {
        if(cc.charCodeAt(i)>10000&&ss.indexOf(cc.charAt(i))!=-1)str+=tt.charAt(ss.indexOf(cc.charAt(i)));
        else str+=cc.charAt(i);
    }
    return str;
}
function Simplized(cc){
    var str='',ss=JTPYStr(),tt=FTPYStr();
    for(var i=0;i<cc.length;i++)
    {
        if(cc.charCodeAt(i)>10000&&tt.indexOf(cc.charAt(i))!=-1)str+=ss.charAt(tt.indexOf(cc.charAt(i)));
        else str+=cc.charAt(i);
    }
    return str;
}

