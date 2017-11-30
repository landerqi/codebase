/**
* @yyalert 弹层组件
* @requires jquery 1.8.2+
*/
/* ==============================
    @version: 1.2.3
    @update: 20160913
    @author: liulong
    @desc:
        1. 修正btn赋值，默认给link 为 'javascript:;'
   =============================== */

/* ==============================
    @version: 1.2.2
    @update: 20160307
    @author: liulong
    @desc:
        1. 修正resize配置
        2. 移除检测到cmd环境后的require('jquery')
        3. 修改setting.position的处理逻辑，不传x 或y 则计算后赋给
   =============================== */

/* ==============================
    @version: 1.2.1
    @update: 20160129
    @author: liulong
    @desc:
        增加一个自定义参数，customClass: 弹窗自定义class
        默认btn增加type作为class
   =============================== */

/* ==============================
    @version: 1.2
    @update: 20160110
    @author: liulong
    @desc:
        bug修复：
            1. 修改了cmd封装，cmd引入的时候不会暴露yyalert到全局
   =============================== */

/* ==============================
    @version: 1.1
    @update: 20151113
    @author: liulong
    @desc:
        bug修复：
            1. 弹窗消失后resize事件没有移除，导致窗口发生resize事件时控制台报错；
            2. 蒙层高度计算错误导致的弹窗生成后页面底部出现大片空白；
            3. 按钮配置成link模式点击无法跳转；
            4. 内置按钮target无定义，传递为target="undefined"；
   =============================== */
(function() {

var PREFIX = 'yyalert';

function factory($){

    var isIE6 = /MSIE 6/i.test(navigator.userAgent);

    var $$ = function() {
        var _selector = arguments[0]

        if(typeof _selector == 'string') {
            arguments[0] = '.'+PREFIX+'-'+_selector;
        }

        return $.apply($, arguments);
    }

    var tpl = {
        parseStr: function(str, cfg) {
            var _re = /({%([\w]+?)%})/g;

            return str.replace(_re, function() {
                var _val = cfg[arguments[2]];
                if(typeof _val == 'undefined') {
                    _val = '';
                }
                return _val.toString();
            });
        },

        frame:
        '<div id="{%id%}" class="{%prefix%}-layer {%type%} {%customClass%}">\
            <div class="{%prefix%}-wrapper">\
                <table><tr><td>\
                    {%header%}\
                    {%close_icon%}\
                    <div class="{%prefix%}-content">{%content%}</div>\
                    {%buttons%}\
                </td></tr></table>\
                {%arrow%}\
            </div>\
        </div>',

        header:
        '<h4 class="{%prefix%}-header">\
            <span class="{%prefix%}-title">{%title%}</span>\
        </h4>',

        closeIcon:
        '<i class="{%prefix%}-icon-x"></i>',

        buttons:
        '<div class="{%prefix%}-buttons">{%button_list%}</div>',
        buttonItem:
        '<a href="{%link%}" {%target%} class="{%prefix%}-btn-item {%classname%} {%btn_type%}" rel="{%btn_type%}"><i>{%btn_name%}</i></a>',

        arrow:
        '<i class="{%prefix%}-arrow {%dir%}"></i>',

        mask:
        '<div class="{%prefix%}-mask"></div>',

        fixLayer:
        '<iframe class="{%prefix%}-iframe" src="about:blank"></ifarme>'
    }

    /**
    * 用来管理各种盒子
    */
    var base = {
        uid: 0,
        cache: {},

        /**
        * 删除指定弹层相关DOM
        */
        removeBox: function(uid) {
            var _box = this.cache[uid];

            if(_box) {
                _box.__liveTimeout && clearTimeout(_box.__liveTimeout);
                _box.trigger('box_remove');
                $(window).off('resize', core.boxResizePos);
                _box.remove();

                base.cache[uid] = null;
                delete base.cache[uid];

                var remove_mask = true;

                for(var i in this.cache) {
                    if(this.cache[i].__withMask) {
                        remove_mask = false;
                        break;
                    }
                }


                remove_mask && base.removeMask();

            }
        },

        /**
        * 蒙层控制
        */
        showMask: function() {
            if(!$$('mask').length) {

                var _mask = tpl.parseStr(tpl.mask,{prefix:PREFIX}),
                    _iframe = tpl.parseStr(tpl.fixLayer,{prefix:PREFIX});

                $(_mask).appendTo(document.body);

                isIE6 && $(_iframe).appendTo(document.body);
            }

            this.resizeMask();
        },
        resizeMask: function() {
            $$('mask').css({
                width: $(document).width(),
                height: $(document).height()
            });

            isIE6 && $$('iframe').css({
                width: $(document).width(),
                height: $(document).height()
            });
        },

        removeMask: function() {
            $$('mask').remove();
            isIE6 && $$('iframe').remove();
        }
    };

    /**
    * 暴露各种盒子的方法
    */
    var box = {
        removeSelf: function() {
            base.removeBox(this.uid);
        },
        setPosition: function(settings, notAdjust) {
            settings = settings || this.settings;

            var _box = base.cache[this.uid];

            // if (_box === undefined) {
            //     return ;
            // }

            if(_box.outerWidth() < core.minWidth) {
                $('table',_box).width(core.minWidth);
            }

            if(settings.reTarget) {
                var SPACE = settings.arrowSpace || 0;

                var _target = $(settings.reTarget);

                if(!_target.length) {
                    return this.setPosition();
                }

                var _arrow = $$('arrow', _box),
                    _boxArrowSize = [0,0];

                if(_arrow.length) {
                    _boxArrowSize = [_arrow.width(),_arrow.height()];
                }

                if(typeof settings.arrowPos == 'undefined') {
                    settings.arrowPos = .5;
                }
                if(typeof settings.rePos == 'undefined') {
                    settings.rePos = .5;
                }

                var target_offset = _target.offset();

                switch(settings.dir) {
                    case 'left': {
                        if(settings.autoAdjust && !notAdjust) {
                            if(target_offset.left - _box.outerWidth() - _boxArrowSize[0] - SPACE < 0) {
                                settings.dir = 'right';

                                _arrow.removeClass(PREFIX+'-arrow-left').addClass(PREFIX+'-arrow-right');

                                return _box.setPosition(settings, true);
                            }
                        }

                        _arrow.css({
                            left: _box.width()-2,
                            top: _box.height()*settings.arrowPos - _boxArrowSize[1]/2
                        }).removeClass(PREFIX+'-arrow-right').addClass(PREFIX+'-arrow-left');

                        _box.css({
                            left: target_offset.left - _box.outerWidth() - _boxArrowSize[0] - SPACE,
                            top: target_offset.top + _target.outerHeight()*settings.rePos - _box.outerHeight()*settings.arrowPos
                        });

                        break;
                    }
                    case 'right': {
                        if(settings.autoAdjust && !notAdjust) {
                            if(target_offset.left + _target.outerWidth() + _boxArrowSize[0] + SPACE + _box.outerWidth() > $(document).width()) {
                                settings.dir = 'left';

                                _arrow.removeClass(PREFIX+'-arrow-right').addClass(PREFIX+'-arrow-left');

                                return _box.setPosition(settings, true);
                            }
                        }

                        _arrow.css({
                            left: -_boxArrowSize[0],
                            top: _box.height()*settings.arrowPos - _boxArrowSize[1]/2
                        }).removeClass(PREFIX+'-arrow-left').addClass(PREFIX+'-arrow-right');

                        _box.css({
                            left: target_offset.left + _target.outerWidth() + _boxArrowSize[0] + SPACE,
                            top: target_offset.top + _target.outerHeight()*settings.rePos - _box.outerHeight()*settings.arrowPos
                        });

                        break;
                    }
                    case 'up': {
                        if(settings.autoAdjust && !notAdjust) {
                            if(target_offset.top - _box.outerHeight() - _boxArrowSize[1] - SPACE < 0) {
                                settings.dir = 'down';

                                _arrow.removeClass(PREFIX+'-arrow-up').addClass(PREFIX+'-arrow-down');

                                return _box.setPosition(settings, true);
                            }
                        }

                        _arrow.css({
                            left: _box.width()*settings.arrowPos - _boxArrowSize[0]/2,
                            top: _box.height()-2
                        }).removeClass(PREFIX+'-arrow-down').addClass(PREFIX+'-arrow-up');

                        _box.css({
                            left: target_offset.left + _target.outerWidth()*settings.rePos - _box.outerWidth()*settings.arrowPos,
                            top: target_offset.top - _box.outerHeight() - _boxArrowSize[1] - SPACE
                        });

                        break;
                    }
                    case 'down': {
                        if(settings.autoAdjust && !notAdjust) {
                            if(target_offset.top + _target.outerHeight() + _boxArrowSize[1] + SPACE + _box.outerHeight() > $(document).height()) {
                                settings.dir = 'up';

                                _arrow.removeClass(PREFIX+'-arrow-down').addClass(PREFIX+'-arrow-up');

                                return _box.setPosition(settings, true);
                            }
                        }

                        _arrow.css({
                            left: _box.width()*settings.arrowPos - _boxArrowSize[0]/2,
                            top: -_boxArrowSize[1]
                        }).removeClass(PREFIX+'-arrow-up').addClass(PREFIX+'-arrow-down');

                        _box.css({
                            left: target_offset.left + _target.outerWidth()*settings.rePos - _box.outerWidth()*settings.arrowPos,
                            top: target_offset.top + _target.outerHeight() + _boxArrowSize[1] + SPACE
                        });
                        break;
                    }

                    case 'center': {
                        _arrow.hide();

                        _box.css({
                            left: target_offset.left + _target.outerWidth()/2 - _box.outerWidth()/2,
                            top: target_offset.top + _target.outerHeight()/2 - _box.outerHeight()/2
                        });

                        break;
                    }


                }

            }else {
                var _top, _left;

                if (settings.position) {
                    _top = settings.position.y !== undefined ? settings.position.y : ($(window).height()-_box.outerHeight())/2;
                    _left = settings.position.x !== undefined ? settings.position.x : ($(window).width()-_box.outerWidth())/2;
                } else {
                    _top = ($(window).height()-_box.outerHeight())/2;
                    _left = ($(window).width()-_box.outerWidth())/2;
                }
                _box.css({
                    position: (settings.fixed && !isIE6) ? 'fixed':'absolute',
                    top: _top,
                    left: _left
                });
            }

            return this;
        },
        setContent: function(str) {
            var _box = base.cache[this.uid];

            if(_box) {
                $$('content', _box).html(str);
            }

            return this;
        }
    }

    var core = {
        /**
        * 弹窗最小宽度
        */
        minWidth: 140,
        /**
        * 弹层是否监听resize事件，自适应大小
        */
        resize: true,
        /**
        * 弹窗创建方法
        * @return {jQuery Element Object}
        * @param {String} type 类型
        * @param {Object} settings 配置
        *
        *   基本配置
        *   settings.content {String} 弹层的内容
        *   settings.customClass {String} 弹层的自定义class,
        *   settings.title {String} 弹层的标题
        *   settings.fixed {Boolean} 弹层的position是否是fixed
        *   settings.resize {Boolean} 弹层是否监听resize事件，自适应大小
        *   settings.hasX {Boolean} 弹层是否有关闭的叉
        *   settings.noMask {Boolean} 是否不需要后面的蒙层
        *   settings.liveTime {Number} 弹层多长时间后自动消失，默认0为不自动消失
        *   settings.width {Number} 弹层宽度
        *   settings.position {Object} 指定弹层绝对位置，例如｛x:0,y:0｝
        *   settings.alone {Number} 弹层显示时，是否需要移除其他弹层
        *       说明 2:同类弹层互斥，1:所有弹层互斥，0:不互斥。默认值为1.
        *   settings.buttons {Array} 弹层的按钮列表，长度为0时不显示
        *       说明 配置内置按钮：['ok','cancel']
        *            配置自定义按钮：[{id:'btnid',value:'点我',callback:function(box){console.log('呵呵')}}]
        *            混合配置：['ok',{id:'btnid',value:'点我',callback:function(box){console.log('呵呵')}}]
        *            重置内置按钮：[{id:'ok',value:'接受',style:'lightgray'},{id:'cancel',value:'不接受',callback:function(){console.log('呵呵')}}]
        *            纯链接：[{id:'link-xx',value:'点我',link:'http://g.cn', target:'_blank'}]
        *
        *   相对位置与箭头配置
        *   settings.reTarget {HTML Element|JQ Element Object} 弹层定位的参考元素对象
        *   settings.dir {String} 弹层相对reTarget的方向 取值:left right up down center
        *   settings.arrowPos {Number} 指定弹层箭头的偏移位置，取值区间[0,1]，例如中间就为0.5，超出取值范围不显示箭头
        *   settings.rePos {Number} 指定弹层相对reTarget的偏移位置，取值区间[0,1]，例如中间就为0.5
        *   settings.autoAdjust {Boolean} 位置不够显示时是否自动调整方向
        *   settings.arrowSpace {Number} 箭头与reTarget的间隔
        *
        *   事件配置
        *   settings.okCallback {Function} 弹层点了OK按钮后的回调
        *   settings.cancelCallback {Function} 弹层点了cancel按钮后的回调
        *   settings.xCallback {Function} 弹层点了x后的回调
        *   settings.closedCallback {Function} 弹层消失后的回调
        */
        create: function(type, settings) {
            var _header = close_icon = _buttons = _arrow = _mask = '';

            core.minWidth = settings.minWidth || core.minWidth;
            core.resize = settings.resize && core.resize;

            //标题模板
            if(settings.title) {
                _header = tpl.parseStr(tpl.header, {
                    title:settings.title,
                    prefix: PREFIX
                });
            }

            //XX模板
            if(settings.hasX) {
                close_icon = tpl.parseStr(tpl.closeIcon, {
                    prefix: PREFIX
                });
            }

            //箭头模板
            if(settings.dir) {
                settings.arrowPos = isNaN(settings.arrowPos) ? .5 : settings.arrowPos;

                if(settings.arrowPos>=0 && settings.arrowPos<=1) {
                    _arrow = tpl.parseStr(tpl.arrow, {
                        dir: PREFIX+'-arrow-'+settings.dir,
                        prefix: PREFIX
                    });
                }else {
                    settings.arrowPos = 0;
                }
            }

            //按钮生成
            if(settings.buttons && settings.buttons.length) {
                _buttons = this.createButtonsTpl(settings.buttons);
            }


            //整体模板
            var _html = tpl.parseStr(tpl.frame, {
                id: PREFIX+'-box-'+ base.uid,
                customClass: settings.customClass ? settings.customClass: '',
                type: PREFIX+'-layer-'+type,
                header: _header,
                close_icon: close_icon,
                content: settings.content,
                buttons: _buttons,
                arrow: _arrow,
                prefix: PREFIX
            });

            //判断互斥
            var remove_boxes = [];
            if(typeof settings.alone == 'undefined') {
                settings.alone = 1;
            }

            if(settings.alone === 1) {
                remove_boxes = $$('layer');
            }else if(settings.alone === 2) {
                remove_boxes = $$('layer-'+type);
            }

            $.each(remove_boxes, function(i, item) {
                base.removeBox(item.id.replace(PREFIX+'-box-', ''));
            });

            //加入到页面，放到cache中，暴露一些方法
            var _box = $(_html).appendTo(document.body);
            $('table',_box).width(settings.width || 'auto');
            _box.width(settings.width || 'auto');
            _box.uid = base.uid;
            _box.settings = settings;

            base.cache[_box.uid] = $.extend(_box, box);

            //有X没标题的时候，移出一点空间
            if(settings.hasX && !settings.title) {
                $$('content', _box).css('paddingRight', '20px');
            }


            //持续时间控制
            var _this = this;

            if(settings.liveTime) {
                _box.__liveTimeout && clearTimeout(_box.__liveTimeout);

                _box.__liveTimeout = setTimeout(function(){
                    base.removeBox(_box.uid);
                }, settings.liveTime);
            }

            //事件初始化
            this.eventInit(_box, settings);

            //如果是异步加载数据
            if(settings.ajaxUrl) {
                _box.setContent('<p class="'+PREFIX+'-loading">数据加载中...</p>');

                $.ajax({
                    url: settings.ajaxUrl,
                    data: settings.ajaxParams || {}
                }).done(settings.ajaxCallback);
            }

            //各种定位
            _box.setPosition(settings);


            //蒙层控制
            if(!settings.noMask) {
                base.showMask();
                _box.__withMask = true;
            }

            base.uid++;

            return _box;
        },

        /*
        * 移除绑定在window上的resize事件
        */
        boxResizePos: function(event) {
            var curBox = event.data.curBox,
                curSettings = event.data.curSettings;
            if(base.__resizeTimeout) {
                clearTimeout(base.__resizeTimeout);
                base.__resizeTimeout = null;
            }

            base.__resizeTimeout = setTimeout(function() {
                curBox.setPosition(curSettings);
                // 重置遮罩mask的大小
                curSettings.noMask || base.showMask();
            }, 0);
        },

        /**
        * 各种事件监听
        */
        eventInit: function(box, settings) {
            if (core.resize) {
                $(window).on('resize', {
                    curBox: box,
                    curSettings: settings
                }, core.boxResizePos);

            }

            $$('buttons', box).on('click','.'+PREFIX+'-btn-item', function(e) {
                var _type = $(this).attr('rel');
                if (_type.indexOf('link-') === -1) {
                    box.trigger(_type+'_onclick');
                    e.preventDefault();
                }
            });

            if(settings.buttons && settings.buttons.length) {
                $.each(settings.buttons, function(i, data) {
                    if(data.callback) {
                        box.bind(data.id+'_onclick', function() {
                            data.callback.call(box);
                        });
                    }
                });
            }

            $$('icon-x', box).bind('click', function() {
                if(typeof settings.xCallback == 'function') {
                    settings.xCallback.call(box);
                }else {
                    base.removeBox(box.uid);
                }

                box.trigger('x_onclick');
            });

            if(typeof settings.okCallback == 'function') {
                box.bind('ok_onclick', $.proxy(settings.okCallback, box));
            }else {
                box.bind('ok_onclick', function() {
                    base.removeBox(box.uid);
                });
            }

            if(typeof settings.cancelCallback == 'function') {
                box.bind('cancel_onclick', $.proxy(settings.cancelCallback, box));
            }else {
                box.bind('cancel_onclick', function() {
                    base.removeBox(box.uid);
                });
            }

            if(typeof settings.closedCallback == 'function') {
                box.bind('box_remove', $.proxy(settings.closedCallback, box));
            }
        },

        createButtonsTpl: function(list) {
            var _html = '';

            for(var i=0,l=list.length;i<l;i++) {
                switch(list[i]) {
                    case 'ok': {
                        _html += tpl.parseStr(tpl.buttonItem, {
                            btn_name: '确定',
                            btn_type: 'ok',
                            link: 'javascript:;',
                            prefix: PREFIX
                        });
                        break;
                    }
                    case 'cancel': {
                        _html += tpl.parseStr(tpl.buttonItem, {
                            btn_name: '取消',
                            btn_type: 'cancel',
                            link: 'javascript:;',
                            prefix: PREFIX
                        });
                        break;
                    }

                    default: {
                        if(typeof list[i] == 'object') {
                            var _data = list[i];

                            _html += tpl.parseStr(tpl.buttonItem, {
                                btn_type: _data.id,
                                btn_name: _data.value,
                                classname: _data.style,
                                link: _data.link || 'javascript:;',
                                target: 'target='+(_data.target ? _data.target : '""'),
                                prefix: PREFIX
                            });
                        }
                    }
                }

            }

            return tpl.parseStr(tpl.buttons,{
                button_list: _html,
                prefix: PREFIX
            });

        }

    }

    return {
        alert: function(str,settings) {

            var _box = core.create('alert', $.extend({
                content: str,
                fixed: true,
                liveTime: 3000,
                arrowPos: -1
            },settings||{}));

            return _box;
        },

        confirm: function(str,settings) {
            var _box = core.create('confirm', $.extend({
                content: str,
                buttons: ['ok',{id:'cancel',style:PREFIX+'-btn-reset',value:'取消'}]
            },settings||{}));

            return _box;
        },

        notice: function(str,settings) {
            var _box = core.create('notice', $.extend({
                content: str,
                liveTime: 3000,
                reTarget: document.body,
                dir: 'center',
                noMask: true
            },settings||{}));

            return _box;
        },

        dialog: function(url,settings) {
            var _box = core.create('dialog', $.extend({
                ajaxUrl: url,
                ajaxCallback: function(r) {

                    if(r && r.code && r.msg) {
                        _box.setContent('<p class="'+PREFIX+'-noresult">'+data.msg+'</p>');

                    }else if(r && r.data) {
                        _box.setContent(r.data);

                    }else if(typeof r == 'string') {
                        _box.setContent(r);

                    }else {
                        _box.setContent('<p class="'+PREFIX+'-noresult">暂无内容</p>');
                    }

                    _box.setPosition(settings);
                },
                hasX: true
            },settings||{}));

            return _box;
        },
        customBox: function(type, settings) {
            return core.create(type, settings);
        }
    };

}

// cmd环境
if (typeof define === 'function') {
    var jq;

    if (!window.jQuery) {
        try {
            //jq = require('jquery');

        } catch(err) {
            throw err;
        }
    } else {
        jq = window.jQuery;
    }

    define(function(require, exports, module) {
        module.exports = factory(jq);
    });

// 非cmd环境
} else {
    window[PREFIX] = factory(window.jQuery);
}

})();
