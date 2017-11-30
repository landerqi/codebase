### 分页器使用

1. 模板中：

    ```
    <div class="js-data--content"></div>    //此处class name 随意 , 数据内容区
    <div class="pagination"></div>          //这里class name 固定为这个, 页码生成区
    ```
1. 插件使用js代码片段:
    ```
    var Pagination = require('xx/xx/pagination');   //分页插件
    var xxxTpl = require('xx/xx/xxx');              //数据处理模板
    var Server = require('xx/xx/server');           //服务端接口

    var totalNum = 0,   //缓存总数据条数
        isInit = true;  //为true表示还未初始化，为false说明分页已经初始化，这样在点击页码切换的时候不会重新初始化


    var Page = {
      init: function {
        var self = this;

        //在此处执行分页数据请求函数
        self.pageAjx();

      }
      /*
      * 此函数初始化分页
      */
      initPage: function() {
        var self = this;
        Pagination.init({
          dataAll: totalNum,          //数据总个数，一般是后端接口返回
          loading: false,             //是否初始异步加载内容
          dataSize: 20,               //每页请求的个数
          dataFun: function(args){    //数据请求函数
            self.pageAjx(args);
          }
        });
      },
      /*
      * 此函数做数据请求及主要逻辑处理(数据请求函数)
      */
      pageAjx: function(args) {
        var self = this;

        //请求数据
        Server.getData({
          start: args ? args.offset : 0,     //请求的起始值
          count: args ? args.size : 20       //每页请求的个数
        }, ++window.reqCount).done(function(data) {

          //这里传一个自增的全局变量是为了保证展示数据正确（多个tab的时候，由于接口返回速度有快有慢，有可能填入的是其他接口返回的数据）
          if (window.reqCount !== this.reqCount) {
            return;
          }

          //这里把请求到的数据插入页面
          ....
          var html = xxxTpl(data);        //数据处理模板
          $('.js-data--content').html(html);  //插入页面

          totalNum = data.count; //把后端返回的数据总数赋值给totalNum

          //如果分页器未初始化
          if (isInit) {
            self.initPage();
            isInit = false;
          }

        })

      }
    }

    Page.init();

    ```
