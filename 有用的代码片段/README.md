### 代码片段

#### 函数节流方法（在需要滚动触发事件时非常有用）
```
  /**
   * 函数节流方法
   * @param Function fn 延时调用函数
   * @param Number delay 延迟多长时间
   * @param Number atleast 至少多长时间触发一次
   * @return Function 延迟执行的方法
   */
  function throttle (fn, delay, atleast) {
    var timer = null;
    var previous = null;

    return function () {
      var now = +new Date();

      if ( !previous ) previous = now;
      if ( atleast && now - previous > atleast ) {
        fn();
        // 重置上一次开始时间为本次结束时间
        previous = now;
        clearTimeout(timer);
      } else {
        clearTimeout(timer);
        timer = setTimeout(function() {
          fn();
          previous = null;
        }, delay);
      }
    }
  }

```

#### 格式化数字
```
  /*
  * 格式化数字 xxxxxx => xxx,xxx,xxx
  * @pram {Number} strNum
  * @return {{String}} xxx,xxx,xxx
  */
  formatNum: function (strNum) {
    var num = strNum + '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(num)) {
      num = num.replace(rgx, '$1,$2');
    }
    return num;
  },
```

#### 格式化数字2
```
  /*
  * 格式化数字
  * @param {number} num
  * @param {object} opt
  *  opt.decimals    保留几位小数，默认为0
  *  opt.useGrouping 是否分组，默认不分组，如果为true则默认以 ','分组
  *  opt.separator   分组符号，默认为 ','      如： {$ pipe.string.formatNumber(3111999, {useGrouping: true}) $}  会展示为： 3,111,999
  *  opt.suffix      后缀单位 ,这里只是单纯加单位，数值换算请自行处理，如：{$ pipe.string.formatNumber(32999/10000, {decimals:2, suffix: '万'}) $} 会展示为： 3.30万
  * @return {{String}}
  */
  s.formatNumber = (num, opt) => {
    let option = {
      decimals: 0,
      useGrouping: false,
      separator: ',',
      suffix: '',
    }
    option = Object.assign(option, opt);
    num = num.toFixed(option.decimals);
    num += '';
    let x, x1, x2, rgx;
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    rgx = /(\d+)(\d{3})/;
    if (option.useGrouping) {
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + option.separator + '$2');
      }
    }
    return x1 + x2 + option.suffix;
  }
```