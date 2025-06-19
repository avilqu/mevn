const { defineConfig } = require("@vue/cli-service");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      proxy: {
        "/api": {
          target: `http://localhost:${process.env.HTTP_PORT || 3000}`,
          changeOrigin: true,
          logLevel: "debug",
        },
      },
    },
  },
});
