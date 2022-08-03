## mini-webpack


1、创建compiler类，传入配置文件config和回调函数callback
2、编译工具类compilation
3、使用tapable库创建一些异步钩子，保存在hooks中
4、调用内部方法，注册所有的plugin
5、在运行run方法，之前，先调用下之前声明的beforeRun钩子，触发对应的调用事件
6、创建compilation工具类
7、-- 内部声明make异步方法进行编译，处理符合loader条件的文件，再就是将内部所有通过require引入的文件，转换成__webpack_require__函数，这么变主要是因为webpack将所有编译的模块都存储在闭包中，只能通过该方法获取
8、-- 编译时使用深度遍历函数遍历，先处理loader，然后改写require，改写require使用@babel/*来改写
9、利用收集的编译后的模块，注入到ejs模板字符串中进行拼接，生成bundle文件
10、在emit生成bundle文件时，利用md5Hash来判断缓存，提升打包速度


