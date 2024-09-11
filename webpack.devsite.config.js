import * as path from "path";
import fs from "fs";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

const __dirname = fs.realpathSync(process.cwd());

const commonConfig = {
  entry: "./public/",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    allowedHosts: "all",
  },
};

export default [commonConfig];
