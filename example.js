var path = require('path');
var fs = require('fs');
var Tra = require('./traverse.js');

//传入目录路径  和  保存的文件位置
function getfiles(fp,callback){
    var arr = []
    var fp = path.normalize(fp);
    fs.readdir(fp, function (err,files) {
        files.forEach(function (val) {
            arr.push(path.resolve('../product',val));
        })
        if(callback){
            callback(arr)
        }
    })
}
//获取目录下的产品分类
getfiles('../product',function (data) {
    data.forEach(function (val) {
       new Tra(val,'../test',['.json']);
    })
});


function print(msg){
    console.log(msg)
}


//指定单个目录--
//new Tra('目录地址','输出文件保存地址');
