### 日期选择组件

__已放入res项目__

这个插件配置非常丰富

1. 引入插件
    ```
    require('http://res.zhiniu8.com/assets/js/lib/My97DatePicker/WdatePicker.js');
    ```

1. 使用Demo
    ```
     $searchStartTime                     //input输入框, 开始时间
        .on('click', function() {
          new WdatePicker({
            dateFmt: 'yyyy-MM-dd',        //数据格式
            readOnly: true,               //只读
            isShowToday: false,
            //minDate:'%y-%M-{%d+4}',     //限制最小时间
            maxDate: '#F{$dp.$D(\'table--search__timeEnd\')||\'%y-%M-%d\'}',   //'table--search__timeEnd'为结束时间input的id, 这里意思是最大时间不能超过结束时间，或者今天
            skin: 'twoer',                //皮肤: 'default', 'twoer', 'whyGreen'
            onpicked: function() {
            }
          });
        });

      $searchEndTime                     //input输入框, 结束时间
        .on('click', function() {
          new WdatePicker({
            dateFmt: 'yyyy-MM-dd',       //数据格式
            readOnly: true,              //只读
            isShowToday: false,
            minDate: '#F{$dp.$D(\'table--search__timeStart\')}',  //'table--search__timeStart'为开始时间input的id，这里意思是最小时间不能超过开始时间
            maxDate: '%y-%M-%d',         //最大时间不能超过今天
            skin: 'twoer',               //皮肤: 'default', 'twoer', 'whyGreen'
            onpicked: function() {
            }
          });
        });
    ```

__更详细使用方法请看: [官方文档地址](http://my97.net/dp/demo/index.htm)__