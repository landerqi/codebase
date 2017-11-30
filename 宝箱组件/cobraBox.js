
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.CobraBox = factory();
  }
}(this, function(require, exports, module) {

  /**
  * cobraBox.js
  * by @xieqi
  */

  // target = 选择插入宝箱的id字符串，或者对象
  // options = 配置项，请看下方

  var CobraBox = function(target, options) {
    var self = this;

    //默认配置
    self.options = {
      hoverTip: '',        //hover提示信息,有可能是text, img
      disableCobraImg: '//res.zhiniu8.com/assets/images/cobra_box/treasure-mask.png',   //不可点击宝箱图片
      unOpenCobraImg: '//res.zhiniu8.com/assets/images/cobra_box/treasure.png',         //未打开宝箱图片
      openCobraImg: '//res.zhiniu8.com/assets/images/cobra_box/treasure-open.png',      //已经打开宝箱图片
      preCondition: false,       //是否有前置条件
      useCountDown: false,       //是否倒计时
      countTime: 10,             //倒计时剩余时间, 单位秒
      animate: '',               //是否需要动画，默认为空
      useOverlay: false          //是否可叠加
    };

    //配置项拓展
    if (options && typeof options === 'object') {
      for (var key in self.options) {
        if (options.hasOwnProperty(key)) {
          self.options[key] = options[key];
        }
      }
    }

    /**
    * 获取cookie值
    * @param {String} name  键名
    */
    self._getCookie = function(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    };

    self.version = function() {return '0.0.1';};
    self.d = (typeof target === 'string') ? $('#' + target) : target;
    self.open = false;                   //宝箱是否已经打开
    self.boxIds = [];                    //缓存boxId
    self.boxTokens = [];                 //缓存boxToken
    self.hoverTips = [];                 //缓存hover提示
    self.uniqOnes = [];                  //缓存一个特别字段，可用于成功提示中的动态内容
    self.uid = self._getCookie('yyuid'); //获取YYuid
    if (self.options.useOverlay === true) {self.options.useCountDown = false}; //如果可以叠加，则不需要倒计时

    /*
    * 收到宝箱通知
    * @param {number} boxId 新增宝箱id
    * @param {number} boxToken 新增宝箱token
    */
    self.recieveCobraBox = function(boxId, boxToken, hoverTip, uniqOne) {
      //console.log('新增宝箱 before', self.boxIds);
      //console.log('新增宝箱 before', self.boxTokens);

      //如果是可叠加宝箱才追加数组
      if (!!self.options.useOverlay) {
        self.boxIds.push(boxId);
        self.boxTokens.push(boxToken);
        if (!!hoverTip) self.hoverTips.push(hoverTip);
        if (!!uniqOne) self.uniqOnes.push(uniqOne);
      } else {
        self.boxIds[0] = boxId;
        self.boxTokens[0] = boxToken;
        if (!!hoverTip) self.hoverTips[0] = hoverTip;
        if (!!uniqOne) self.uniqOnes[0] = uniqOne;
      }
      //console.log('ddddddddddddddd', hoverTips);
      //console.log('新增宝箱 after', self.boxIds);
      //console.log('新增宝箱 after', self.boxTokens);

      self._createBoxToPage(); //加载宝箱
      self._updateBoxNum();  //宝箱数量UI更新
    };

    /*
    * 宝箱数量UI更新
    */
    self._updateBoxNum = function() {
      var num = self.boxIds.length,
          $jsCobraItemNum = self.d.find('.js-cobra--item__num'),
          $jsCobraItemBox = self.d.find('.js-cobra--item__box'),
          $jsCobraItemOpen = self.d.find('.js-cobra--item__open'),
          $jsCobraGetBoxTis = self.d.find('.js-cobra--getBoxTips'),
          $jsCobraItem = self.d.find('.js-cobra--item');
      var html = [
        '<div class="cobra--item__num js-cobra--item__num">', num, '</div>'
      ].join('');

      //更新hover提示
      //console.log(self.hoverTips);
      if (self.hoverTips.length > 0) {
        //console.log(self.hoverTips);
        self._tipsView(self.hoverTips[num - 1]);
      }

      if (num > 1) {
        if ($jsCobraItemNum.length > 0) {
          $jsCobraItemNum.html(num);
        } else {
          $jsCobraItem.append(html);
        }
        //还有宝箱未领取，2秒后复原
        setTimeout(function() {
          $jsCobraGetBoxTis.remove();
          $jsCobraItemOpen.hide();
          $jsCobraItemBox.show();
        }, 2000);
      } else if (num === 1) {
        self.d.find('.js-cobra--item__num').remove();
        //还有宝箱未领取，2秒后复原
        setTimeout(function() {
          $jsCobraGetBoxTis.remove();
          $jsCobraItemOpen.hide();
          $jsCobraItemBox.show();
        }, 2000);
      } else if (num === 0) {
        //没有宝箱则删除宝箱, 也是2秒后
        setTimeout(function() {
          $jsCobraGetBoxTis.remove();
          self.d.empty();
        }, 2000);
      }

    };

    //事件绑定
    self._bind = function() {
      var $jsCobraItem = self.d.find('.js-cobra--item'),
          $jsCobraItemBox = self.d.find('.js-cobra--item__box'),
          $cobraItemBox = self.d.find('.cobra--item__box'),
          $jsCobraItemOpen = self.d.find('.js-cobra--item__open');

      //宝箱点击领取宝物事件
      $jsCobraItemBox.on('click', function() {
        var $this = $(this);
        var uniqOne;
        var data = {
          'boxId': self.boxIds.pop(),
          'boxToken': self.boxTokens.pop()
        };

        //如果有成功提示字段
        if (self.uniqOnes.length > 0) uniqOne = self.uniqOnes.pop();

        //如果未登录，弹出登录框
        if (!self.uid) {
          window.ZNNAV.LR.login();
          return;
        }

        //当有前置条件class, 及disable的时候，不能领取
        if ($this.hasClass('disable') || $this.hasClass('js-pre--condition')) {
          return;
        }

        //置为不可点击
        $this.addClass('disable');
        //发起领取请求
        $.ajax({
          url:'http://api-cobra.zhiniu8.com/1.0/cobra/competeBox',
          dataType:'jsonp',
          data:{appId:1004, sign:'', data:JSON.stringify(data)}
        })
        .done(function(json){
          $this.removeClass('disable');
          if (json.data.code === 1) {
            //领取成功
            if (json.data.isSuccess) {
              var successHtml = self._getBoxTipsView(json.data.gift, uniqOne);
              $jsCobraItem.append(successHtml);
              $this.hide();
              $jsCobraItemOpen.show();
            } else {
              //宝箱已被领完处理
              var boxOverHtml = self._getBoxTipsView('宝箱已被领完');
              $jsCobraItem.append(boxOverHtml);
              $this.hide();
              $jsCobraItemOpen.show();
            }
            self._updateBoxNum();  //宝箱数量UI更新
          } else {
            //领取失败, 重新保存id, token
            alert('获取宝箱礼物出错，请重新点击尝试！');
            self.boxIds.push(data.boxId);
            self.boxTokens.push(data.boxToken);
          }
        });
      });

      //hover提示
      if (self.hoverTips.length > 0) {
        self._tipsView(self.hoverTips[self.hoverTips.length - 1]);
      } else if (self.options.hoverTip != '') {
        self._tipsView(self.options.hoverTip);
      }
    };

    /*
    * 宝箱UI
    * @return {string} html 宝箱结构html
    */
    self._boxView = function() {
      var boxBg = !!self.options.useCountDown ? self.options.disableCobraImg :  self.options.unOpenCobraImg,
          extendClassName = '';

      if (!!self.options.useCountDown) {
        extendClassName += ' disable';
      }
      if (!!self.options.preCondition) {
        extendClassName += ' js-pre--condition';
      } else {
        extendClassName += ' js-cobra--item__box';
      }
      if (!!self.options.animate != '') {
        extendClassName += ' ' + self.options.animate;
      }

      var html = [
        '<div class="cobra--item js-cobra--item">',
          '<div class="js-cobra--item__countDown cobra--item__countDown">',
          '</div>',
          '<div class="cobra--item__box', extendClassName, '" style="background-image: url(', boxBg, ');">',
          '</div>',
          '<div class="js-cobra--item__open cobra--item__open" style="background-image:url(', self.options.openCobraImg, ')">',
          '</div>',
        '</div>'
      ].join('');

      return html;
    };

    /*
    * hover提示UI
    * @param {string} tipContent 提示文本或者图片地址
    */
    self._tipsView = function(tipContent) {
      var modifyHtml = '',
          $jsCobraItem = self.d.find('.js-cobra--item'),
          $cobraItemBox = self.d.find('.cobra--item__box'),
          html = [];

      if (!!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(tipContent)) {
        modifyHtml = '<img src="' + tipContent + '" alt="" />';
      } else {
        modifyHtml = '<span>' + tipContent + '</span>';
      }
      html = [
        '<div class="cobra--hoverTips js-cobra--hoverTips">',
          '<div class="cobra--hoverTips__arrow">',
          '</div>',
          '<div class="cobra--hoverTips__content">', modifyHtml, '</div>',
        '</div>'
      ].join('');

      self.d.find('.js-cobra--hoverTips').remove();
      $jsCobraItem.append(html);
      var $jsCobraHoverTips = self.d.find('.js-cobra--hoverTips');
      $cobraItemBox.hover(function(){
        $jsCobraHoverTips.show();
      }, function() {
        $jsCobraHoverTips.hide();
      });
    };

    /*
    * 宝箱领取提示
    * @return {object, string} tipContent
    */
    self._getBoxTipsView = function(tipContent, uniqOne) {
      var modifyHtml = '',
          html = [];

      if (typeof tipContent === 'string') {
        modifyHtml = '<span>' + tipContent + '</span>';
      } else if (typeof tipContent === 'object') {
        modifyHtml = '<p>成功领取 ' + uniqOne;
        modifyHtml += '<i class="bag-icon-' + tipContent.giftType + '"></i><em>' + tipContent.giftDesc + '</em> X ' + tipContent.giftCount;
        modifyHtml += '</p>';
      } else {
        return;
      }
      html = [
        '<div class="cobra--getBoxTips js-cobra--getBoxTips">',
          '<div class="cobra--getBoxTips__arrow">',
          '</div>',
          '<div class="cobra--getBoxTips__content">', modifyHtml, '</div>',
        '</div>'
      ].join('');

      return html;
    };

    /*
    * 倒计时方法
    * @param {function} callback 倒计时执行完成回调
    */
    self._countDown = function(callback) {
      var countDownItem = self.d.find('.js-cobra--item__countDown'),
          timer,
          time = 1000 * self.options.countTime;
      timer = setInterval(function() {
        if (time > 0) {
          var mm = parseInt(time / 1000 / 60 % 60, 10);//计算剩余的分钟数
          var ss = parseInt(time / 1000 % 60, 10);//计算剩余的秒数
          countDownItem.html(self._formateCountDownTime(mm) + '<b>:</b>' + self._formateCountDownTime(ss));
          time = time - 1000;
        } else if (time == 0) {
          clearInterval(timer);
          !!callback && callback();
        }
      }, 1000);
    };

    /*
    * 补0
    * @param {number} t
    * @return {number}
    */
    self._formateCountDownTime = function(t) {
      t < 10 ? t = '0' + t : 1;
      return t;
    };

    /*
    * 生成宝箱
    */
    self._createBoxToPage = function() {
      var html = self._boxView();
      self.d.html(html);

      //如果需要倒计时，加载倒计时
      if (!!self.options.useCountDown) {
        var $jsCodraItemCountDown = self.d.find('.js-cobra--item__countDown');
        var $jsCodraItemBox = self.d.find('.js-cobra--item__box');
        $jsCodraItemCountDown.show();
        $jsCodraItemBox.removeClass(self.options.animate); //倒计时前移除动画
        self._countDown(function() {
          //倒计时结束处理
          $jsCodraItemBox.removeClass('disable')
            .css('background-image', 'url(' + self.options.unOpenCobraImg + ')');
          $jsCodraItemCountDown.hide();
          $jsCodraItemBox.addClass(self.options.animate); //复原动画
        });
      }

      self._bind();
    };
  };

  return CobraBox;

}));

