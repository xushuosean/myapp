# nodejs搭建后台

> 教你如何一步一步搭建nodejs后台

## 1、技术概览

| 使用技术         | 框架名称 | 备注                        |
| ---------------- | -------- | --------------------------- |
| 后台语言：nodejs | express  |                             |
| 数据库：mongodb  | 无       | 但会用到mongose模块进行操作 |

## 2、搭建准备

1、安装nodejs

首先在本地安装nodejs环境，详见[Nodejs安装步骤](https://www.runoob.com/nodejs/nodejs-install-setup.html)

2、安装MongoDB数据库

这里放的是windows平台安装方法，详情见[Windows MongoDB](https://www.runoob.com/mongodb/mongodb-window-install.html)

> 请务必选择配置MongoDB服务的方式进行数据库的开启！！！
>
> 最好此时就打开MongoDB的连接

> 在命令行中使用MongoDB非常不方便，所以这里推荐使用adminMongo，可在github上面clone下来，下面附使用方法

```javascript
1.从github克隆到本地
git clone https://github.com/mrvautin/adminMongo
2.进入仓库
cd adminMongo
3.安装node_modules
npm install
4.启动项目
npm start
5.访问地址
http://127.0.0.1:1234
```

> 进入后需要填写数据库名称，和本地ip地址mongodb://127.0.0.1:27017即可，点击connect就可以进行连接了

**如果此步出错，请检查第二步的数据库连接是否可行**

检查方法：在浏览器中打开http://127.0.0.1:27017/，如果出现以下提示，则数据库开启成功

> ```
> It looks like you are trying to access MongoDB over HTTP on the native driver port.
> ```

3、创建express项目

```
1.创建express项目，名为myapp
express myapp
2.进入myapp项目中
cd myapp
3.安装依赖
npm install
4.启动项目
npm start
```

4、安装进程守护supervisor

```
1.在命令行运行以下命令
npm install -g supervisor
2.如果是linux和macos请使用以下命令
sudo npm install -g supervisor
输入密码后即可进行安装
```

> 安装成功后，在package.json文件中对scripts选项进行配置

```javascript
"scripts": {
    "start": "node ./bin/www",
    "dev": "supervisor ./bin/www"
  },
```

5、运行项目

> 这时候我们就可以去启动项目了

```
npm run dev
```

请务必检查MongoDB数据库是否开启成功

## 3、nodejs连接数据库

1、在myapp文件夹下创建sql文件夹

```
mkdir sql			// 当然你也可以直接创建
```

2、创建db.js

```javascript
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/daysapp';// daysapp为数据库名称，如果没有这个数据库，会直接创建，有则直接使用

mongoose.connect(DB_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})

mongoose.connection.on('disconnected', () => {
  console.log('数据库断开')
})

mongoose.connection.on('error', () => {
  console.log('数据库连接异常')
})

// 将此文件作为一个模块 暴露出去，供别人调用
module.exports = mongoose;

```

> 既然有了数据库连接，在哪里使用呢？当然是在数据表里面使用了

3、在sql文件夹下创建collection/users.js

```javascript
const mongoose = require('./../db.js'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

// 设计用户表的集合
const userSchema = new Schema({ // 设计用户集合的字段以及数据类型
  userid: {type: String },
  openid: { type: String },
  nickName: { type: String },
  avatarUrl: { type: String },
  city: { type: String },
  country: { type: String },
  province: { type: String },
  gender: { type: String },
  language: { type: String }
})

module.exports = mongoose.model('User', userSchema);

```

> 这里的例子是我连接微信小程序做的用户表

4、既然有了连接，势必要对数据库进行操作，在sql文件夹下创建index.js

```javascript
const sql = {
  // 数据库集合靠函数去传递
  insert (CollectionName, insertData) {
    // 数据库的操作属于异步操作，后续的业务逻辑会交给执行的那个单位
    return new Promise((resolve, reject) => {
      CollectionName.insertMany(insertData, (err) => {
        if (err) throw err;
        resolve()
      })
    })
  },
  delete (CollectionName, deleteData, deleteType) {
    deleteType = deleteType || 'deleteOne' // 默认为删除单条数据

    return new Promise((resolve, reject) => {
      CollectionName[deleteType](deleteData, (err) => {
        if (err) throw err;
        resolve()
      })
    })
  },
  update (CollectionName, whereObj, updateObj, updateType) {
    updateType = updateType || 'updateOne'
    return new Promise((resolve, reject) => {
      CollectionName[updateType](whereObj, updateObj, (err) => {
        if (err) throw err;
        resolve()
      })
    })
  },
  find (CollectionName, whereObj, showObj) {
    return new Promise((resolve, reject) => {
      CollectionName.find(whereObj, showObj).exec((err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
  }
}

module.exports = sql

```

> 此时就写好了对数据库的操作，接下来我们对数据库进行操作

