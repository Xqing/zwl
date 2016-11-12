/**
 * Created by wanglin on 2016/11/3.
 */
/*
 Ajax 三级省市联动
 settings 参数说明
 -----
 url:省市数据josn文件路径
 prov:默认省份
 city:默认城市
 dist:默认地区（县）
 nodata:无数据状态
 required:必选项
 ------------------------------ */
(function($){
    $.fn.cityChoose=function(settings){
        if(this.length<1){return;};

        // 默认值
        settings=$.extend({
            url:"../js/city.min.js",
            prov:null,
            city:null,
            dist:null,
            nodata:null,
            required:true
        },settings);

        var box_obj=this;
        var prov_obj=box_obj.find(".prov");
        var city_obj=$('.choose-city-popup').find(".city-list");
        var dist_obj=$('.choose-city-popup').find(".dist");

        var select_prehtml= "";
        var temp_html= "";
        var city_json;
        var myChoose = "";
        var flag = false;

        // 赋值市级函数
        var cityStart=function(){
            var prov_id=prov_obj.find('span.active').index();
            var prov_val=prov_obj.find('span.active').text();
            myChoose = "";
            flag = false;
            $('.choose-city-popup').find('.popup_title').html(prov_val);
            // 遍历赋值市级
            temp_html=select_prehtml;
            $.each(city_json.citylist[prov_id].c,function(i,city){
                temp_html+='<span class="each-city">'+city.n +'</span>';
            });
            city_obj.html(temp_html);
            //distStart();
        };

        // 赋值地区（县）函数
        var distStart=function(){
            var prov_id=prov_obj.find('span.active').index();
            var prov_val=prov_obj.find('span.active').text();
            var city_id=city_obj.find('span.current').index();
            var city_val=city_obj.find('span.current').text();
            $('.choose-city-popup').find('.dist-list p').html(prov_val +'>'+city_val);
            myChoose += prov_val +'>'+city_val;
            // 遍历赋值市级下拉列表
            temp_html=select_prehtml;
            if(city_json.citylist[prov_id].c[city_id].a){
                $.each(city_json.citylist[prov_id].c[city_id].a,function(i,dist){
                    temp_html+='<span class="each-dist">'+ dist.s +'</span>';
                });
                dist_obj.html(temp_html);
                flag = true;
            }

        };

        var init=function(){
            // 遍历赋值省份下拉列表
            temp_html=select_prehtml;
            $.each(city_json.citylist,function(i,prov){
                temp_html+='<span>'+prov.p+'</span>';
            });
            prov_obj.html(temp_html);

            // 选择省份时发生事件
            prov_obj.delegate('span','click',function(){
                $(this).parents().find('.active').removeClass('active');
                $(this).addClass('active');
                cityStart();
                $('.choose-city-popup').removeClass('hide');
            });

            // 选择市级时发生事件
            city_obj.delegate('span','click',function(){
                var $this = $(this);
                var $thisTop = parseInt($this.offset().top) - parseInt($('body').scrollTop()) + 30;
                var $thisLeft = $this.offset().left;
                $(this).parents().find('.current').removeClass('current');
                $(this).addClass('current');
                distStart();
                if(flag){
                    $('.choose-city-popup').find('.dist-list').removeClass('hide').css({'left':$thisLeft,'top':$thisTop});
                }else{
                    //如果没有区县则直接返回
                    $('.your-choose').append('<span>'+ myChoose +'</span>');
                    $('.popup_close').trigger('click');
                }
            });

            //如果有区县
            $('.choose-city-popup').find('.dist-list').delegate('span','click',function(){
                var dist_val = $(this).text();
                myChoose += '>' + dist_val;
                $('.your-choose').append('<span>'+ myChoose +'</span>');
                $('.popup_close').trigger('click');
            });

        };

        // 设置省市json数据
        if(typeof(settings.url)=="string"){
            $.getJSON(settings.url,function(json){
                city_json=json;
                init();
            });
        }else{
            city_json=settings.url;
            init();
        };
    };
})(jQuery);