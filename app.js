"use strict";

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const nunjucks = require('nunjucks');
const _ = require('underscore');

const IS_PROD = "NODE_ENV" in process.env && "production" === process.env.NODE_ENV;

const app = express();
app.set('port', (process.env.PORT || 5000));

if (!IS_PROD) {
  // setup the webpack server
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const wpconf = _.extend(require('./webpack.config.js'), {
    "context" : __dirname + '/'
  });

  const compiler = webpack(wpconf);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '/'
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/v1.0', serveStatic(path.join(__dirname,'/v1.0'), {maxAge:'0', index:false}));
}

// configure nunjucks template environment for express
nunjucks.configure(__dirname + '/templates', {
  autoescape : false,
  watch : !IS_PROD
}).express(app);

app.get('/', function(req, res) {
  const models = {
    "isProd" : IS_PROD
  }
  res.render('index.html', models);
});

app.listen(app.get('port'), () => console.log(`shopmsg-chart-demo running on port ${app.get('port')}`));