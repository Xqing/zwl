/**
 * Created by cdxiaqing1 on 2015/8/10.
 * settings 参数说明
 * -----
 * url:目录数据josn文件路径
 * nodata:无数据状态,none/hidden
 * select:是否为下拉级联
 */
(function($){
    $.fn.category=function(settings){
        if(this.length<1){return;};
        // 默认值
        settings=$.extend({
            url:null,
            nodata:"",
            select:true
        },settings);

        var box_obj=this;
        var clevel1_obj=box_obj.find(".sort1");
        var clevel2_obj=box_obj.find(".sort2");
        var clevel3_obj=box_obj.find(".sort3");
        var select_level1html=(settings.select) ? "<option selected disabled value='' class='hide'>请选择类目</option>" : "";
        var category_json;
        var l1Index = null;
        var l2Index = null;
        var sortHtml1 = "";
        var sortHtml2 = "";
        var sortHtml3 = "";

        // 赋值二级类目函数
        var level2Start=function(l1Index){
            clevel2_obj.empty().attr("disabled",true);
            clevel3_obj.empty().attr("disabled",true);

            var thisItem = category_json.categoryTree[l1Index];

            if(l1Index<0||typeof(thisItem.children)=="undefined"){
                if(settings.nodata=="none"){
                    clevel2_obj.css("display","none");
                    clevel3_obj.css("display","none");
                }else if(settings.nodata=="hidden"){
                    clevel2_obj.css("visibility","hidden");
                    clevel3_obj.css("visibility","hidden");
                };
                return;
            };

            if(settings.select){
                temp_html=select_level1html;
                $.each(thisItem.children,function(i,children){
                    temp_html+='<option value="'+children.name+'"clevel="'+children.level+'" cid="'+children.cid+'" data-cid="'+children.cid+'">'+children.name+'</option>';
                });

            }else{
                temp_html=select_level1html;
                $.each(thisItem.children,function(i,children){
                    temp_html+='<div class="item" clevel="'+children.level +'" cid="'+children.cid +'">' +children.name + '</div>';
                });
            }
            clevel2_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});


        };
        // 赋值三级类目函数
        var level3Start=function(l1Index,l2Index){
            clevel3_obj.empty().attr("disabled",true);
            var thisItem = category_json.categoryTree[l1Index].children[l2Index];

            if(l1Index<0||l2Index<0||typeof(thisItem.children)=="undefined"){
                if(settings.nodata=="none"){
                    clevel3_obj.css("display","none");
                }else if(settings.nodata=="hidden"){
                    clevel3_obj.css("visibility","hidden");
                };
                return;
            };
            if(settings.select){
                temp_html=select_level1html;

                $.each(thisItem.children,function(i,children){
                    temp_html+='<option value="'+children.name+'"clevel="'+children.level+'" cid="'+children.cid+'"data-cid="'+children.cid+'">'+children.name+'</option>';
                });
            }else{
                temp_html=select_level1html;
                $.each(thisItem.children,function(i,children){
                    temp_html+='<div class="item" clevel="'+children.level +'" cid="'+children.cid +'">' +children.name + '</div>';
                });
            }

            clevel3_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
        };
        //添加商品树形展示事件绑定
        var goodsBind = function(){
            // 选择一级目录时触发
            $(clevel1_obj.get(0)).children('.item').on("click",function(){
                var self = $(this);
                l1Index = self.index();
                self.siblings('.current').removeClass('current');
                self.addClass('current');
                sortHtml1 = self.html();
                level2Start(l1Index);
                $('.sort_tree span').html(sortHtml1);

            });

            // 选择二级目录时触发
            $('.sort2').delegate('.item','click',function(){
                var self = $(this);
                l2Index =self.index();
                self.siblings('.current').removeClass('current');
                self.addClass('current');
                sortHtml2 = self.html();
                level3Start(l1Index,l2Index);
                $('.sort_tree span').html(sortHtml1 + ">" + sortHtml2);
            });

            // 选择三级目录时触发
            $('.sort3').delegate('.item','click',function(){
                var self = $(this);
                sortHtml3 = self.html();
                self.siblings('.current').removeClass('current');
                self.addClass('current');
                $('.sort_tree span').html(sortHtml1 + ">" + sortHtml2+ ">" + sortHtml3);
            });
        }
        //搜索类目select下拉展示事件绑定
        var selectBind = function(){
            // 选择一级目录时触发
            $(clevel1_obj.get(0)).on("change",function(){
                l1Index=clevel1_obj.get(0).selectedIndex-1;
                level2Start(l1Index);
            });

            //选择二级目录时触发
            $(clevel2_obj.get(0)).on("change",function(){
                l1Index=clevel1_obj.get(0).selectedIndex-1;
                l2Index=clevel2_obj.get(0).selectedIndex-1;
                level3Start(l1Index,l2Index);
            });

        };

        //赋值一级目录
        var init=function(){
            if(settings.select){
                temp_html=select_level1html;
                $.each(category_json.categoryTree,function(i,obj){
                    temp_html+='<option value="'+obj.name+'"clevel="'+obj.level +'"cid="'+obj.cid+'"data-cid="'+obj.cid+'">'+obj.name+'</option>';
                });
                clevel1_obj.html(temp_html);
                selectBind();
            }else{
                temp_html=select_level1html;
                $.each(category_json.categoryTree,function(i,obj){
                    temp_html+='<div class="item" clevel="'+obj.level +'"cid="'+obj.cid+'">' +obj.name + '</div>';
                });
                clevel1_obj.html(temp_html);
                goodsBind();
            }
        };


        // 设置json数据
        if(typeof(settings.url)=="string"){
            $.getJSON(settings.url,function(json){

                if(json.result == true){
                    category_json = (json.messages)? json.messages :'empyt';
                    init();
                }else{
                    console.log('something wrong');
                }

            });
        }else{
            category_json=settings.url;
            init();
        };
    };
})(jQuery);
