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