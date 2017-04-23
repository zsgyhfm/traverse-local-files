var path = require('path');
var fs = require('fs');
var tra = require('./test.js');

//指定需要遍历的目录
var abslot_path = path.resolve('../data');
//传入目录路径  和  保存的文件位置
tra(abslot_path,'save.json')
