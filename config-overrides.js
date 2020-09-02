const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }

    config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            { from: 'node_modules/tinymce/skins', to: 'static/js/skins' }
          ]
        })
    );

    return config;
}

// require.context(
//   'file-loader?name=[path][name].[ext]&context=node_modules/tinymce/skins',
//   true,
//   /.*/
// );
