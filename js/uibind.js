$(function(){
    /**
     * 弹窗关闭
     */
    $('.popup').delegate('.popup_close','click',function() {
        $(this).parents('.popup').addClass('hide');
        $('.choose-city-popup').find('.dist-list').addClass('hide');
    });
    
     //失焦关闭
    $(document).mouseup(function(e){
        var _con = $('.popup_card');
        if(!_con.is(e.target) && _con.has(e.target).length === 0){
            $('.popup').hide();
        }
    });
    $(window).scroll(function(event) {
        var scTop = $(document).scrollTop();
        // console.log(scTop)
        if(scTop >= 0 && scTop < 800){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg1').addClass('current');
        }
        if(scTop >= 800 && scTop < 1600){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg2').addClass('current');
        }
        if(scTop >= 1600 && scTop < 2400){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg3').addClass('current');
        }
        if(scTop >= 2400 && scTop < 3200){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg4').addClass('current');
        }
        if(scTop >= 3200 && scTop < 4800){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg5').addClass('current');
        }

        if(scTop >= 4800){
            $('.short-bar').find('.current').removeClass('current');
            $('#a-bg6').addClass('current');
        }
    });

    /**
     * 起止起止日期使用方法
     *  <div class="data_choose_time inline">
     *      <label>成交时间：</label>
     *      <input  class="laydate-icon" id="laydate-start">
     *      <label>至</label>
     *      <input  class="laydate-icon" id="laydate-end">
     *  </div>
     */
    $('#laydate-start').on('click', function(event) {
        laydate(start);
    });
    $('#laydate-end').on('click', function(event) {
        laydate(end);
    });
    var start = {
        elem: '#laydate-start',
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#laydate-end',
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };

    $('#biz-date').on('click', function(event) {
        laydate();
    });

    /**
     * input数字输入限制
     * onlyLong-只能输入整数的方法 class类名：inputOnlyLong
     * onlyFloat-只能输入带小数点的数字 class类名：inputOnlyFloat
     * 使用方式：
     *
     */

    $('body').delegate('.inputOnlyFloat','keyup',function(){
        var $this = $(this);
        onlyFloat(event,$this);
    });
    $('body').delegate('.inputOnlyFloat','blur',function(){
        var $this = $(this);
        checkNum($this);
    });

    $('body').delegate('.inputOnlyLong','keyup',function(){
        var $this = $(this);
        onlyLong(event,$this);
    });
    $('body').delegate('.inputOnlyLong','blur',function(){
        var $this = $(this);
        checkNum($this);
    });

    /**
     * keyup监控 textarea移除错误提示
     */
    $('body').delegate('textarea.error','keyup',function(){
        var $this = $(this);
        $this.removeClass('error');
    });
    $('body').delegate('input.error','keyup',function(){
        var $this = $(this);
        $this.removeClass('error');
    });
    $('body').delegate('select.error','change',function(){
        var $this = $(this);
        $this.removeClass('error');
    });


    /**
     * 只能输入数字的方法
     * @param event
     * @param node
     */
    function onlyLong (event,node) {
        //响应鼠标事件，允许左右方向键移动
        event = window.event||event;
        if(event.keyCode == 37 | event.keyCode == 39){
            return;
        }
        var thisVal = node.val();
        node.val(thisVal.replace(/\D/g,''));
    }

    /**
     * 可以输入数字和小数点的方法
     * @param event
     * @param node
     */
    function onlyFloat(event,node){
        //响应鼠标事件，允许左右方向键移动
        event = window.event||event;
        if(event.keyCode == 37 | event.keyCode == 39){
            return;
        }
        var thisVal = node.val();
        var newVal = thisVal.replace(/[^\d.]/g,"").replace(/^\./g,"").replace(/\.{2,}/g,".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

        node.val(newVal);
    }

    /**
     * 可以输入小数点时，去处最后一个小数点
     * @param node
     */
    function checkNum(node){
        //为了去除最后一个.
        var thisVal = node.val();
        node.val(thisVal.replace(/\.$/g,""));
    }

    function checkTel(node){
        var tel = node.val();
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        if (reg.test(tel)) {
            
        }else{
            node.addClass('error');
        };
    }






    //业务逻辑
    //密码提示悬停出现
    $('.pwd-tips').hover(function() {
        $(this).addClass('showTips');
    }, function() {
        $(this).removeClass('showTips');
    });
    //选项卡们
    $('.collection-table').on('click', '.collection-tab span', function() {
        var $this = $(this);
        $this.parents('.collection-tab').find('.active').removeClass('active');
        $this.addClass('active');
    });
    $('.debt-main').on('click', '.tab a', function() {
        var $this = $(this);
        $this.parents('.tab').find('.current').removeClass('current');
        $this.addClass('current');
    });



    //资债中心筛选逻辑
    $('.asset-main-content').find('.choose-box p').delegate('span','click',function(){
        var $this = $(this);
        $this.parents('p').find('.active').removeClass('active');
        $this.addClass('active');
    });
    $('.your-choose').delegate('span','click',function(){
        $(this).remove();
    });




    //首页轮播
    $('.index-strengths').find('.strengths-bar').delegate('span','click',function () {
        var $this = $(this);
        var thisIndex = $this.index();
        $this.parents('.strengths-bar').find('.current').removeClass('current');
        $this.addClass('current');
        $('.index-strengths-wrapper').find('.j-slider-item.current').removeClass('current');
        $('.index-strengths-wrapper').find('.j-slider-item').eq(thisIndex).addClass('current');

    });
    


});
