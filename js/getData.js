var get = {};
get.err = false;
get.error = function () {
    get.err = true;
    console.log('error');
    $('#error').show();
    $(window).on('hashchange', function(){
        $('#error').hide();
    })
};
/* 从新包装ajax */
get.get = function(url, success, error){
    $.ajax({
        url: url,
        success: success,
        error: error || get.error
    });
};
/* 页面初始化
*  url 是3级文件路径如 2018/20180425/20180425_001
*  index 是可选的模块编号 如 index=1 => 20180425_001_1.json
* */
get.init = function (url, index) {
    var path = url.trim().split('/');
    if(path.length == 3) {
        get.hideContent();
        get.showNav();
        get.dayData(path[0] + '/' + path[1]);
        get.pageData(path[0] + '/' + path[1], path[2]);
        if(index) {
            get.hideNav();
            get.showContent();
            get.moduleData(url, index);
        }
    } else {
        get.error();
    }
};
/* 输出日报版面目录
*  url 是2级文件路径 如2018/20180425
* */
get.dayData = function (url) {
    if(get.err) return;
    var path = url.trim().split('/'),
        lastPath = path[path.length - 1];
    get.get(url + '/' + lastPath + '.json', function(data){
        if(data.length) {
            var html = '';
            data.forEach(function(item, i){
                html += '<li><a href="javascript:">第' + ('0' + ++i).substr(-2) + '版：' + item.title + '</a><a href="' + url + '/' + lastPath + '_' + ('00' + i).substr(-3) + '/' + item.file + '">test</a></li>';
            });
            $('#nav-pages').html(html);
        }
    });
};

/* 输出当前版面的模块导航
*  url 是2级文件路径 如2018/20180425
*  index 是版面变号 如 index=1 => 20180425_001.json
* */
get.pageData = function(url, index) {
    if(get.err) return;
    var path = url.trim().split('/'),
        lastPath = path[path.length - 1],
        childPath = lastPath + '_' + ('00' + index).substr(-3),
        newurl = url + '/' + childPath;
    get.get(newurl + '/' + childPath + '.json', function(data){
        /* 加载图片*/
        var src = newurl + '/' + data.img;
        if(data.img) $('#img').attr('src', src).on('load', function(){
            $('canvas').attr('width', $(this).width()).attr('height', $(this).height());
        }).parent().css('background-image','url('+src+')');
        /* 版面标题和PDF文件 */
        $('.nav-self-middle').html(
            '<span>第' + ('0' + index).substr(-2) + '版：<strong>' + data.title + '</strong></span>' +
            '<span><a href="javascript:">上一版</a><a href="javascript:">下一版</a></span>' +
            '<a href="' + newurl + '/' + data.file + '">test</a>'
        );
        /* 添加路径和标题导航 */
        if(data.coords) {
            var html1 = '',
                html2 = '';
            data.coords.forEach(function(item, i){
                html1 +=  '<area href="javascript:" shape="poly" coords="'+ item + '" data-path="' + item + '" data-title="' + data.navSelf[i] + '">';
                html2 += '<li data-path="' + item + '">' + data.navSelf[i] + '</li>';
            });
            $('#map-path').html(html1);
            $('#nav-self').html(html2);
        }
    } );
};

/* 输出模块内容
*  url 是3级文件路径 如2018/20180425/20180425_001
*  index 是模块编号 如 index=1 => 20180425_001_1.json
* */
get.moduleData = function(url,index) {
    var path = url.trim().split('/'),
        lastPath = path[path.length - 1];
    get.get(url + '/' + lastPath + '_' + index + '.json',function(data){
        var html = (data.title ? '<h5>' + data.title + '</h5>' : '') +
                   (data.head ? '<h2>' + data.head + '</h2>' : '') +
                   (data.writer ? '<h5>' + data.writer + '</h5>' : '');
        if(data.content) data.content.forEach(function(item){
           html += '<p>' + item + '</p>'
        });
        $('#container').html(html);
    });
};
get.hideNav = function() {
    $('.nav-pages').addClass('hide');
};
get.showNav = function() {
    $('.nav-pages').removeClass('hide');
};
get.hideContent = function() {
    $('#container').hide();
};
get.showContent = function() {
    $('#container').show();
};




