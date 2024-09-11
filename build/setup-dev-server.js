const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.conf')
const serverConfig = require('./webpack.server.conf')

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    } catch (e) {
        console.error(e)
    }
}

module.exports = function setupDevServer (app, templatePath, cb) {
    let bundle
    let template
    let clientManifest

    let ready
    const readyPromise = new Promise(resolve => { ready = resolve })
    const update = () => {
        if (bundle && clientManifest) {
            ready()
            cb(bundle, {
                template,
                clientManifest
            })
        }
    }

    // read template from disk and watch
    template = fs.readFileSync(templatePath, 'utf-8')
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        console.log('index.html template updated.')
        update()
    })
    // modify client config to work with hot middleware
    clientConfig.entry = ['webpack-hot-middleware/client', clientConfig.entry]
    clientConfig.output.filename = '[name].js'
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )

    // dev middleware
    const clientCompiler = webpack(clientConfig)
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        noInfo: true
    })
    app.use(devMiddleware)
    // 在client webpack结合vue-ssr-webpack-plugin完成编译后，
    // 获取devMiddleware的fileSystem，读取内存中的bundle，并通过传入的回调更新server.js中的bundle
    clientCompiler.plugin('done', stats => {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) return
        clientManifest = JSON.parse(readFile(
            devMiddleware.fileSystem,
            'vue-ssr-client-manifest.json'
        ))
        update()
    })

    // hot middleware
    app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig)
    // 获取基于memory-fs创建的内存文件系统对象
    const mfs = new MFS()
    
    serverCompiler.outputFileSystem = mfs
    // 设置文件重新编译监听并通过传入的回调更新server.js中的bundle
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))

        // read bundle generated by vue-ssr-webpack-plugin
        bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
        update()
    })
    return readyPromise
}
