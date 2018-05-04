/**
 * 键名
 * url
 * type
 * data
 * success
 * */
function ajax(option) {
    var xhr = new XMLHttpRequest(),
        url = option.url,
        type = option.type,
        data = option.data === undefined ? null : option.data,
        success = option.success;
    if(type == 'get' && data) {
        url += '?' + data;
        data = null;
    }
    open(type,url);
    if(type == 'post' && data) {
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    }
    xhr.onreadystatechange = function () {
        if(xhr.readystate == 4 && xhr.status == 200){
            if(xhr.ResponseHeader.indexOf('XML') == -1){
                success(xhr.responseText);
            }else {
                success(xhr.responseXML);
            }

        }
    };
    end(data);
}