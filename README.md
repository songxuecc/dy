
一: 项目webpack升级
1. 配置步骤
2. 资源打包
    1. vue配置
    2. es6语言配置
    3. css&less
    4. 图片&svg&音频&font
3. 环境区分和优化
    1. 公共：resolve & plugins & optimization & stats
        1. externals 排除外部依赖打包到bundle中
        2. resolve 缩小查找范围
        3. plugins 
            1. DefinePlugin 变量替换 
            2. WebpackBar 打包进度展示 
            3. WebpackBuildNotifierPlugin(废弃) 构建完成提示 
            4. FriendlyErrorsWebpackPlugin 配置终端输出日志 
            5. LodashModuleReplacementPlugin 按需引入 
            6. VueLoaderPlugin 热重载 
            7. HardSourceWebpackPlugin 缓存 webpack 内部模块 
            8. happypack 多线程打包 
        4. optimization splitChunks& runtimeChunk(manifest)
        5. stats bundle 配置终端输出日志
    2. 开发：devtool & output & plugins & devServer & optimization 
        1. devtool 调试方式
        2. output 输出 动态加载
        3. plugins 
            1. HtmlWebpackPlugin 动态生成html 
            2. ScriptExtHtmlWebpackPlugin manifest内联到index.html 
            3. MiniCssExtractPlugin 提取css 
            4. HotModuleReplacementPlugin 热替换 
        4. devServer 提供本地服务
        5. optimization moduleIds 持久化缓存
    3. 生产：devtool & output & plugins & devServer & optimization
        1. devtool 调试方式
        2. output 输出 动态加载
        3. plugins 
            1. CleanWebpackPlugin 删除dist
            2. MiniCssExtractPlugin 提取css 
            3. CopyWebpackPlugin 复制目录
            4. ScriptExtHtmlWebpackPlugin manifest内联到index.html 
            5. OptimizeCssAssetsPlugin css压缩
            6. CompressionPlugin 压缩生成gzip
        4. optimization
            1. moduleIds 
            2. UglifyJsPlugin
            3. OptimizeCssAssetsPlugin
        5. performance

一: 静态资源整理
1. icon
2. images
3. fonts
4. css

二： 代码优化
1. 目录整理与模块划分
2. 公共逻辑抽离 createLoading、modelExtengs、listModel
3. 按需加载与全局注册



js插件
1. 自定义plugin实现热更新
2. react项目配置
3. 动态加载