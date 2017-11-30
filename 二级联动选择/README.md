### 二级联动选择

__已放入res项目__

1. 引入数据文件及插件(已放入res项目下)
    ```
    require('http://res.zhiniu8.com/assets/js/lib/select/data.js');
    require('http://res.zhiniu8.com/assets/js/lib/select/jquery.city.select.js');
    ```

1. 使用Demo
    ```
    //资格证选择初始化
    $('#cert-type, #cert-post').citylist({
        data: provinceData,   //省市数据
        id: 'id',              //
        children: 'cities',    //
        name: 'name',
        metaTag: 'name'
    });
    ```