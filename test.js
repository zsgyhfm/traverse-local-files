/**
 * Created by yishan on 17/4/22.
 */
var path = require('path');
var fs = require('fs');

//1.指定文件夹的绝对路径
var abslot_path = path.resolve('../files')
//2.json的名称
var filename = 'test1'

//封装打印--console.log写的次数太多烦得很
function log(msg) {
    var time = Date.now()
    console.log(msg)
}


//json-母版   是母版 不是模板 - -!
var json = {
        id: 0,
        label: 'files',//这个是根目录的名称  根据传入的路径改变
        sup: '',//父级的路径
        children: []//如果有子目录的话 就要有这个数组
}
    ;
//记录父级目录
//var sup_mark = path.resolve('../files');
//获取文件列表
function getDir_list(abslot_path) {
    abslot_path = path.resolve(abslot_path);
    abslot_path = path.normalize(abslot_path)
    //记录当前文件夹的路径
    fs.readdir(abslot_path, function (err, files) {

        //遍历判断文件类型
        files.forEach(function (val, item) {
            //stat 要绝对路径 将val转成绝对路径
            //拼接路径  fp就是文件夹/文件的绝对路径
            var fp = path.join(abslot_path, val)
            //父级目录
            var sup_path = path.resolve(fp, '../');
            fs.stat(fp, function (err, stat) {

                if (stat.isDirectory()) {
                    //创建json
                    var data = {
                        label: val,
                        sup: sup_path,
                        children: []
                    };
                    //log('当前文件是---' + val+'父文件'+sup_path+'item===='+item);
                    //判断父级文件
                    //添加到json数组中

                    parent_dir(json, data);


                    //递归
                    getDir_list(fp);

                }
                if (stat.isFile()) {
                    //log('当前文件是---' + val+'父文件'+sup_path+'item===='+item);
                    //创建目录文件
                    var data = {
                        label: val,
                        sup:sup_path
                    };

                    //data.sup = path.normalize(data.sup)
                    log(data.sup)
                    parent_dir(json, data)
                }

            });
        });


    });

}


/**
 * 查找父级 并将子集添加到父级数组
 * @param parent  目录集合文件 总的json
 * @param child   当前的子级 json对象
 * @param index   子级的id
 */
function parent_dir(parent, child) {
    //先判断第一个节点是否是父节点
    var len = parent.label.length;
    var text = child.sup.substr(-len);
    if (parent.label == text) {
        parent.children.push(child);
    } else {
        //查找 id-1的目录
        var arr = parent.children;
        //遍历数组
        search(arr, child)

    }

}

//写入文件
function writefile(fp, data) {
    data = JSON.stringify(data);
    fs.writeFile(fp, data, {flag: 'w+'}, function (err) {
        if (err == null) {
            log('操作成功')
        }
    })
}
//将json写入到文件


/**
 *  查找传入节点的父节点 并加入到父节点的数组中
 * @param arr   总json
 * @param child  传入创建的json子节点
 */
function search(arr, child) {
    //val是每个json节点
    arr.forEach(function (val) {
        //1.先判断当前遍历的节点是否是文件夹--是否有children属性
        if ('children' in val) {
            //取得文件夹的名称
            var Dname = val.label;
            var child_sup = child.sup.substr(-Dname.length);

            //判断child json的父级
            if (Dname == child_sup) {
                //判断是否已经存入

                //val.children.add(child);
                val.children.push(child);
            } else {
                //当前节点不是传入child的父节点  继续向下遍历
                search(val.children, child);
                writefile(filename,json)
            }

        }
    })
}


/**
 *
 * @param fp 指定遍历的
 * @param fname
 * @param root
 */
module.exports = function (fp,fname) {
    if(fp==null){
        throw new Error('没有指定遍历的目录地址')
    }
    if(fname==null){
        throw new Error('没有指定写入的文件路径')
    }
    filename = fname;
    //路径切片
    //先取得当前系统的 文件分隔符
    var sep = path.sep;
    var fpath = fp.split(sep);
    json.label = fpath[fpath.length-1];
    getDir_list(fp);

};
