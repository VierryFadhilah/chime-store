const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    index: "./src/index.js",
    app: "./src/app.js",
    login: "./src/login.js",
    admin: "./src/admin.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  watch: true,

  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "app.html",
      template: "./src/app.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "admin.html",
      template: "./src/admin.html",
      inject: false,
    }),
  ],
};
