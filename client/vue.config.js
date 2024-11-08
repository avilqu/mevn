const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      proxy: {
        "/api": {
          target: "https://localhost:3443",
          changeOrigin: true,
          logLevel: "debug",
        },
      },
    },
  },
});
