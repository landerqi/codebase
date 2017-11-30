### 弹框组件

__已放入res项目__

1. 在页面引入样式文件，和js文件, 样式以个人中心为基础样式:

    ```
    //在当前页面引用
    <style type="text/css">
      #include("finance/res/trunk/assets/css/plugins/yyalert.css")
    </style>

    //seajs config 中增加alias配置
    var config = seajs.config({
      base: "//act.zhiniu8.com/assets/js",
      alias: {
        'lib/yyalert': 'http://res.zhiniu8.com/assets/js/lib/yyalert.js'
      },
      map: [
        [/^(.*\.(?:js))(.*)$/i, '$1?ver={{moment unixtimestamp  format ="YYYYMMDDHHmmss"}}']
      ]
    });
    seajs.use("pages/xxx/xxx");

    //业务代码中require
    require('lib/yyalert');

    ```

    __备注：__
    ```
    //备注，res域名支持combo合并：
    //如果用这种方式引入样式文件，按照目前工作流的话，需放在default.hbs模版中
    <link rel="stylesheet" href="//res.zhiniu8.com/assets/css/??plugins/yylaert.css,xxx(nav).css,xxx(footer).css">
    <script src="http://res.zhiniu8.com/assets/js/??lib/yyalert.js,xx.js,xx.js"></script>
    ```

1.  使用代码片段：
    ```
    //html为传入的内容
    yyalert.confirm(html, {
      title: 'xxxxx',             //标题
      fixed: true,
      //liveTime: 3000,
      arrowPos: -1,
      width: 530,
      hasX: true,
      buttons: [
        {
          id: 'ok',
          value: '我知道了'
        },
        {
          id: 'cancel',
          value: '取消'
        }
      ],
      okCallback: function() {   // ok按钮回调
        this.removeSelf();       //关闭弹窗
      },
      cancelCallback: function() {
        //取消回调
      }
    }).addClass('pop--common');  //附加class
    ```