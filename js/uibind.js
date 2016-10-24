$(function(){
    /**
     * 弹窗关闭
     */
    $('.popup').delegate('.popup_close','click',function() {
        $(this).parents('.popup').hide();
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

});
