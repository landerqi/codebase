### 宝箱组件这里也存一份，方便查找

__已放入res项目__


#### 使用
1. 在页面引入样式文件，和js文件：

    ```
    <style type="text/css">
        #include("finance/res/trunk/assets/css/cobraBox.css")
    </style>

    <script src="http://res.zhiniu8.com/assets/js/cobraBox.js"></script>

    ```

1. 在业务js中new一个宝箱实例：

    ```
    var boxOne = new CobraBox('target', options)

    ```

    `target` 为需要插入DOM的id名，比如：`<div id="target"> </div>`。

    `options` 为配置项：

    ```
    {
      useCountDown: true,    //是否使用倒计时
      hoverTips: 'http://cms-bucket.nosdn.127.net/299da30e61e4476b97c521215609cc2320160926101527.jpeg',
      countTime: 8,
      animate: 'shake-cute',
      disableCobraImg: 'xxx',
      unOpenCobraImg: 'xxx',
      openCobraImg: 'xxx',
      preCondition: false,
      useOverlay: false
    }
    ```

        > useCountDown: 是否使用倒计时, 默认为false。
        > hoverTips: hover提示，可以传文本或者图片地址，图片提示宽度为220。
        > countTime： 到计时长，单位秒。
        > animate：宝箱动画效果，目前有4种--`shake`,`shake-rotate`,`shake-hard`,`shake-cute`,推荐用`shake-cute`。不传则默认无动画。
        > disableCobraImg：宝箱不能点击状态图片，图片地址，不传则用默认图片，图片尺寸：94x92。
        > unOpenCobraImg：宝箱可点击状态图片，图片地址，不传则用默认图片，图片尺寸：94x92。
        > openCobraImg：宝箱打开状态图片，图片地址，不传则用默认图片，图片尺寸：123x138。
        > preCondition: 是否有前置条件，默认为false, 如果为true，会添加class: `js-pre--condition`供业务自行处理。
        > useOverlay：宝箱是否可叠加，默认为false，如果为true，则可叠加，可叠加宝箱，倒计时会失效。

1. 收到宝箱通知后：

    执行

    ```
    boxOne.recieveCobraBox(boxId, boxToken, hoverTip, sucUniq);
    ```

        > boxId: 宝箱id，
        > boxToken: 宝箱token。

        > ##### 新增两个可选参数：
        > hoverTip: 有时候需要在插入宝箱时，动态修改hover提示内容，可以从这里传入。
        > sucUniq: 有时成功提示需要传一些动态内容，可以通过此字段传入，比如：‘成功领取 xxxxxx 的拜师宝箱’。

    此时页面中会插入宝箱。


#### 注意：
  如果有多个类型不同宝箱，需要自右依次向左展示，可以自己用一个div包裹所有宝箱，然后右浮动宝箱，比如(具体可以参考zhiniu项目下：teacherLiveShow.hbs文件)：

  ```
    <div>
      <div id="target1"></div>                         //宝箱一
      <div id="target2"></div>                         //宝箱二
      <div id="target3"></div>                         //宝箱三
    </div>
  ```
