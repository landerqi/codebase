### 二维码生成

__已放入res项目__

1. 引入插件
    ```
    require('http://res.zhiniu8.com/assets/js/lib/jquery.qrcode.js');
    ```

1. 使用Demo
    ```
    //生成二维码
    var $erweima = $('.xxxxxx');    //放置二维码的对象
    var ua = navigator.userAgent;
    if(ua.indexOf("MSIE") > 0){
      if(ua.indexOf("MSIE 7.0") > 0 || (ua.indexOf("MSIE 8.0") > 0 && !!document.documentMode)){
        $erweima.qrcode({render:"table", width:120, height:120, correctLevel:0, text:'http://www.zhiniu8.com/h5live?uid=' + $erweima.attr('data-uid')});
      }else{
        $erweima.qrcode({width:120, height:120, correctLevel:0, text:'http://www.zhiniu8.com/h5live?uid=' + $erweima.attr('data-uid')});
      }
    } else {
      $erweima.qrcode({width:120, height:120, correctLevel:0, text:'http://www.zhiniu8.com/h5live?uid=' + $erweima.attr('data-uid')});   //text是二维码的内容
    }
    ```
