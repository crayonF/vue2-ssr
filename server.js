const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const path = require('path');
const fs = require('fs');


const isLocal = process.env.NODE_ENV === 'local'

const app = express();

let renderer
let readyPromise
const templatePath = path.resolve(__dirname, './index.html')
if (!isLocal) {
  // 读取模板文件
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 创建服务端渲染器
  const serverBundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');

  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,  // 推荐
    template,  // HTML 模板
    clientManifest,  // 客户端清单
  });
} else {
  // 本地开发环境下，使用dev-server来通过回调把生成在内存中的bundle文件传回
  // 通过dev server的webpack-dev-middleware和webpack-hot-middleware实现客户端代码的热更新
  // 以及通过webpack的watch功能实现服务端代码的热更新
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
        renderer = createBundleRenderer(bundle, options)
    }
  )
}

function render(req, res) {
  const context = { url: req.url };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found');
      } else {
        res.status(500).end('Internal Server Error');
      }
    } else {
      res.end(html);
    }
  });
}

// 静态资源
app.use('/', express.static(path.resolve(__dirname, './dist')));

// 处理所有请求
app.get('*', !isLocal ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
});

// 启动服务器
app.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});
