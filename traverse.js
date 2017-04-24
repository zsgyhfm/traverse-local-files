/**
 * Created by yishan on 17/4/22.
 */
var path = require('path');
var fs = require('fs');

//封装打印--console.log写的次数太多烦得很
function log(msg) {
    var time = Date.now()
    console.log(msg)
}


function DirList(dirpath,savefile_path,filetype) {
    log(savefile_path)
    this.init(dirpath,savefile_path,filetype);
}
DirList.prototype = {

    init: function (dirpath,savefile_path,filetype) {

        if(dirpath==null){
            throw new Error('没有指定遍历的目录')
        }
        if(filetype==null){
            this.filetype='all'
        }else {
            this.filetype = filetype
        }
        this.fs = fs;
        this.dirpath = dirpath;
        var sep = path.sep;
        var arr = dirpath.split(sep)
        this.savepath = path.normalize(savefile_path+'/'+arr[arr.length-1]+'.json');
        //json-母版   是母版 不是模板 - -!
        this.json = {
            id: 0,
            label: arr[arr.length-1],//这个是根目录的名称  根据传入的路径改变
            sup: '',//父级的路径
            cur:dirpath,
            children: []//如果有子目录的话 就要有这个数组
        };
        //调用
        this.getDir_list(dirpath);
    },
    //获取文件列表
    getDir_list: function (abslot_path) {
        log('获取文件列');
        var that = this
        abslot_path = path.resolve(abslot_path);
        abslot_path = path.normalize(abslot_path);
        //指定保存路径
        //记录当前文件夹的路径
        this.fs.readdir(abslot_path, function (err, files) {

            //遍历判断文件类型
            files.forEach(function (val, item) {
                //stat 要绝对路径 将val转成绝对路径
                //拼接路径  fp就是文件夹/文件的绝对路径
                var fp = path.join(abslot_path, val);
                //父级目录
                var sup_path = path.resolve(fp, '../');
                fs.stat(fp, function (err, stat) {

                    if (stat.isDirectory()) {
                        //创建json
                        var data = {
                            label: val,
                            sup: sup_path,
                            cur:fp,
                            children: []
                        };
                        //添加到json数组中
                        that.parent_dir(that.json, data);
                        //递归
                        that.getDir_list(fp);
                    }
                    if (stat.isFile()) {
                        //判断当前文件是不是指定的类型
                        var ext = path.extname(fp);

                       if (that.filetype!=''){
                           var a =  that.filetype.indexOf(ext);
                           log('-----------');
                           log(a)
                           log(ext)
                          if(a>-1){
                              //创建目录文件
                              var data = {
                                  label: val,
                                  sup: sup_path,
                                  cur:fp
                              };
                              log(data.label)
                              that.parent_dir(that.json, data);

                          }
                           //如果只有一层（不包括指定的根目录）这里就结束遍历了
                           that.writefile(that.savepath,that.json)
                          }
                       }




                });
            });


        });

    },
    /**
     * 查找父级 并将子集添加到父级数组
     * @param parent  目录集合文件 总的json
     * @param child   当前的子级 json对象
     * @param index   子级的id
     */
    parent_dir: function (parent, child) {

        //先判断第一个节点是否是父节点
        var len = parent.label.length;
        var text = child.sup.substr(-len);
        if (parent.label == text) {
            parent.children.push(child);
        } else {
            //查找 id-1的目录
            var arr = parent.children;
            //遍历数组
            this.search(arr, child)
        }
        this.writefile(this.savepath, this.json)

    },
    /**
     *  查找传入节点的父节点 并加入到父节点的数组中
     * @param arr   总json
     * @param child  传入创建的json子节点
     */
    search: function (arr, child) {
        var that = this
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
                    that.search(val.children, child);
                    //写入文件
                    //log(val)
                    //that.writefile(that.savepath, that.json);
                }

            }
        })

    },
    //将json写入到文件
    writefile: function (fp, data) {
        if (!fp) {
            throw new Error('没有指定保存路径')
        }
        data = JSON.stringify(data);
        fs.writeFile(fp, data, {flag: 'w+'}, function (err) {
            log('开始保存文件')
            if (err == null) {
                log('写入成功成功')
            } else {
                log(err)
            }
        })
    }

}



module.exports = DirList;
