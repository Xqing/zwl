$(function(){
   // 注册呼出注册协议
   $('#show_pro').on('click', function() {
       $('.agree-protocol').show();
   });

    //认证中心添加地址
    $('.certi-main').delegate('.add-adress','click',function(){
        var $this = $(this);
        var areaBox = $this.parents('p').siblings('.my-area');
        var prov = $this.parents('p').find('.prov').val();
        var city = $this.parents('p').find('.city').val();
        var dist = $this.parents('p').find('.dist').val();
        var newStr = '';
        var temp = '';
        var flag = false;
        if(prov){
            newStr += prov;
        }
        if(city){
            newStr += '-' + city;
        }
        if(dist){
            newStr += '-' + dist;
        }
        //去重
        if($('.my-area').find('span').length == 0){
            flag = true;
        }else{
            $('.my-area').find('span').each(function(i){
                var choosedArea = $(this).html().replace('<i>X</i>','');
                if(newStr == choosedArea){
                    flag = false;
                }else{
                    flag = true;
                }
            });
        }

        if(flag){
            temp = '<span>'+newStr+'<i>X</i></span>';
            areaBox.append(temp).removeClass('hide');
        }


    });
    //认证中心移除地址
    $('.certi-main').delegate('.my-area span i','click',function(){
        var $this = $(this);
        var areaBox = $this.parents('.my-area');
        $this.parents('span').remove();
        if(areaBox.find('span').length == 0){
            areaBox.addClass('hide');
        }

    });


});
