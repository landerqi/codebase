### 自定义滚动条

__已放入res项目__

1. 引入插件(已放入res项目下)
    ```
    //在当前页面引用
    <style type="text/css">
      #include("finance/res/trunk/assets/css/plugins/jscrollpant.css")
    </style>

    //js引用
    require('http://res.zhiniu8.com/assets/js/lib/jquery.mousewheel.js');
    require('http://res.zhiniu8.com/assets/js/lib/jquery.jscrollpane.js');
    ```

1. 使用Demo:
    ```
    var pane = $('.scroll-pane'); //需要用到自定义滚动条的DOM
    pane.jScrollPane(
      {
        autoReinitialise: true,              //这个是自动更新，比如聊天公屏，内容是动态增加的，这里要设置为true
        mouseWheelSpeed: 100,                //滚动速度
        enableKeyboardNavigation: false,     //这个是键盘方向键控制滚动吧
        showArrows: true,                    //为true, 滚动条上下(或左右)两端会出现一个点击按钮
        arrowScrollOnHover: true,            //为true, 鼠标移动到两端按钮上，会自动滚动
        verticalArrowPositions: 'before',    //箭头的位置，值：'before', 'after', 'os', 'split'
        horizontalArrowPositions: 'before',  //箭头的位置，值：'before', 'after', 'os', 'split'
        hijackInternalLinks: true            //锚点滚动
      }
    );

    //如果需要使用他的api，需先获取
    var api = pane.data('jsp');

    //api使用简例
    $('#but-scroll-to').bind(
      'click',
      function()
      {
        // Note, there is also scrollToX and scrollToY methods if you only
        // want to scroll in one dimension
        // api方法调用, scrollTo
        api.scrollTo(parseInt($('#toX').val()), parseInt($('#toY').val()));
        return false;
      }
    );

    $('#but-scroll-by').bind(
      'click',
      function()
      {
        // Note, there is also scrollByX and scrollByY methods if you only
        // want to scroll in one dimension
        // api方法调用, scrollBy
        api.scrollBy(parseInt($('#byX').val()), parseInt($('#byY').val()));
        return false;
      }
    );

    api.getContentPane().append(
      $('<p />').text('This is paragraph number ' + i++)
    );

    //如果不设置'autoReinitialise', 有新内容也可以这样手动更新
    api.reinitialise();

    ```

__更详细使用方法请看: [官方文档地址](http://jscrollpane.kelvinluck.com/#examples)__