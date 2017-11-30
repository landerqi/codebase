/**
 * Created by guojinrong on 3/30 2016.
 * @分页插件 Pagination
 * @return {
 *    index 索引
 *    len 每页数据量
 *  }
 */
define(function(require, exports, module) {
    //缓存变量
    var dataFun  = new Function(),
        $pagination = $(".pagination"),
        dataSize = 6,
        dataIndex = 0,
        dataCode = 1,
        pageSize = 10,
        dataAll = 0,
        totalPage = 0;
    

    var Pagination = {
        /**
         * @description 初始化分页设置
         * @method init
         * @param {Object} args 分页设置
         * args.pageSize:页码显示的个数
         * args.dataSize:数据列表每页的个数
         * args.dataAll:数据总个数
         * args.dataFun:数据请求函数
         * args.loading:是否初始异步加载内容
         * */
        init:function(args){
            pageSize = args.pageSize || 10;
            dataSize = args.dataSize || 6;
            dataAll = args.dataAll || 0;
            dataCode = args.dataCode || 1;
            dataFun = args.dataFun;
            totalPage = Math.ceil(dataAll / dataSize);//总共有多少页
            this.create(dataCode);
            args.loading && dataFun({offset: 0, size: dataSize});
        },

        /**
         * @description 创建分页view
         * @method create
         * @param {Number} dataCode 当前页码
         * */
        create:function(dataCode){
            var html = "",
                len = 0,
                i = 1;
            //是否满足分页条件
            if(dataAll > dataSize){
                //第一页则不显示：首页/上一页
                if(dataCode == 1){
                    html += '<span class="paging-false">首页</span>';
                    html += '<span class="paging-false">上一页</span>';
                } else {
                    html += '<a class="paging-first">首页</a>';
                    html += '<a class="paging-prev">上一页</a>';
                }

                //分页码不足10页时
                if(totalPage <= pageSize){
                    len = totalPage;
                } else {
                    if(dataCode > pageSize - 4){
                        len = (dataCode + 4) <= totalPage ? (dataCode + 4) : totalPage;
                        i = len - pageSize + 1;
                    }
                    else {
                        len = pageSize;
                    }
                }
                //生产页码
                for(; i <= len; i++){
                    if(dataCode == i){
                        html += '<span class="paging-false paging-cur">' + i + '</span>';
                    } else {
                        html += '<a class="paging-code">' + i + '</a>';
                    }
                }
                
                //最后一页则不显示：下一页/末页
                if(dataCode == totalPage){
                    html += '<span class="paging-false">下一页</span>';
                    html += '<span class="paging-false">末页</span>';
                } else {
                    html += '<a class="paging-next">下一页</a>';
                    html += '<a class="paging-last">末页</a>';
                }
            }
            $pagination.html(html);
        },

        request:function(dataCode){
            dataIndex = dataCode - 1;
            Pagination.create(dataCode);
            dataFun({offset: dataIndex * dataSize, size: dataSize});
        }
    };

    // //分页相关委托事件
    $pagination
        //点击页码
        .on("click", ".paging-code", function(){
            dataCode = parseInt( $(this).html() );
            Pagination.request(dataCode);
        })
        //下一页
        .on("click", ".paging-next", function(){
            if(dataCode >= totalPage){
                dataCode = totalPage;
            } else {
                ++ dataCode;
            }
            Pagination.request(dataCode);
        })
        //上一页
        .on("click", ".paging-prev", function(){
            if(dataCode <= 1){
                dataCode = 1;
            } else {
                -- dataCode;
            }
            Pagination.request(dataCode);
        })
        //首页
        .on("click", ".paging-first", function(){
            dataCode = 1;
            Pagination.request(dataCode);
        })
        //末页
        .on("click", ".paging-last", function(){
            dataCode = totalPage;
            Pagination.request(dataCode);
        });

    module.exports = Pagination;
});
