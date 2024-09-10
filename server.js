const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const path = require('path');
const fs = require('fs');

const app = express();

// 读取模板文件
const template = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');

// 创建服务端渲染器
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,  // 推荐
  template,  // HTML 模板
  clientManifest,  // 客户端清单
});

// 静态资源
app.use('/', express.static(path.resolve(__dirname, './dist')));

// 处理所有请求
app.get('*', (req, res) => {
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
});

// 启动服务器
app.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});
