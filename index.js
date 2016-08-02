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
    
    var traceModId = settings.traceModId || 'libs/core.trace',
        traceModUrl;
    
    fis.util.map(ret.src, function(subpath, file) {
        if ( file.isJsLike && file.id.indexOf(traceModId) !== -1 ) {
            traceModUrl = file.url;
        }
    });
    
    
    // 为页面文件增加core.trace
    fis.util.map(ret.src, function(subpath, file) {
        
        if (file.isHtmlLike && file.isViews && file.useTrace!==false) {
            
            // 当前view对应的js文件
            var jsName = file.id.replace(/\.vm/, '.js'),
                coretraceInDeps = false,
                hasFramework = /\b__FRAMEWORK_CONFIG__\b/g.test(file.getContent());
            
            
            // 2016-7-12 jiajianrong
            // 遍历js文件，加入trace依赖
            fis.util.map(ret.src, function(subpath, file) {
                // 当前vm存在对应的js文件
                if ( file.isJsLike && file.id===jsName ) {
                    file.requires.unshift(traceModId);
                    coretraceInDeps = true;
                }
            });
            
            
            var content = file.getContent();
            
            // </body>结束
            content = content.replace(/(\<\s*\/\s*body\s*\>)/ig, function() {
                // 逻辑转移到coretrace
                // #[[<script> document.addEventListener( "DOMContentLoaded", ' + fStr + ' )</script>]]#
                
                // ---------------------
                // 2016-7-12 jiajianrong
                // 不直接输出标签，改为输出至file.requires数组
                // ---------------------
                var str = '\n    <script>require("' + traceModId + '");</script> \n' + RegExp.$1;
                if ( !coretraceInDeps || !hasFramework ) {
                    str = '\n    <script src="' + traceModUrl + '"></script>' + str;
                }
                return str;
            });
            
            file.setContent(content);
        }
    })
};
