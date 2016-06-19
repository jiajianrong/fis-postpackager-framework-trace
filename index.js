'use strict';

/*
 * 2016-6-19
 * jiajianrong@58.com
 * 
 * 此处只简单requie('libs/core.trace')
 * 
 * 所有逻辑均已移至
 * https://github.com/jiajianrong/jr8-proj-demo/blob/master/static/libs/core.trace.js
 * 



var onetimeFlag = false;

module.exports = function (content, file, conf) {

    if ( !onetimeFlag ) {
        onetimeFlag = true;
        conf.traceUrlPrefix && _updateCoreTrace(conf.traceUrlPrefix);
    }
    
    if (file.isHtmlLike && file.isViews && file.useTrace!==false) {
            
        var content = file.getContent();
        
        // </body>结束 --- 发送日志数据
        content = content.replace(/(\<\s*\/\s*body\s*\>)/ig, function() {
            return '\n  <script>alert(33)</script>  #[[<script> document.addEventListener( "DOMContentLoaded", ' + fStr + ' )</script>]]#\n' + RegExp.$1;
            
        });
        
        return content;
    }


};





function _updateCoreTrace(prefix) {

    var fs = require('fs'),
        coretrace = process.cwd() + '/static/libs/core.trace.js',
        reg = /__framework_placeholder_trace_url_prefix__/,
        data,
        newdata;
    
    if (!fs.existsSync(coretrace))
        return;
    
    data = fs.readFileSync(coretrace, {'encoding': 'utf8'});
    
    if ( !data || !data.trim().length || !reg.test(data) )
        return;
    
    newdata = data.replace( reg, prefix );
    
    
    fs.writeFileSync(coretrace, newdata);
}

*/





module.exports = function (ret, conf, settings, opt) {
    
    var coretrace = ret.map.res['static/libs/core.trace.js'],
        coretraceUri = coretrace.uri;
    
    // 为页面文件增加core.trace
    fis.util.map(ret.src, function(subpath, file) {
        
        if (file.isHtmlLike && file.isViews && file.useTrace!==false) {
            
            var content = file.getContent();
            
            // </body>结束 --- 引入coretrace
            content = content.replace(/(\<\s*\/\s*body\s*\>)/ig, function() {
                // 逻辑转移到coretrace
                // #[[<script> document.addEventListener( "DOMContentLoaded", ' + fStr + ' )</script>]]#
                return '\n    <script src="' + coretraceUri + '"></script> \n    <script>require("libs/core.trace");</script> \n' + RegExp.$1;
            });
            
            file.setContent(content);
        }
    })
};
