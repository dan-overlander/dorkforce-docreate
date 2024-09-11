import * as path from "path";
import fs from "fs";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

const __dirname = fs.realpathSync(process.cwd());

const commonConfig = {
  entry: "./src/index.ts",
  externals: {
    root: "DDS",
    commonjs2: "@dds/components",
    commonjs: "@dds/components",
    amd: "@dds/components",
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
    },
  },
  plugins: [
    new NodePolyfillPlugin(), // This plugin polyfills Node.js core modules
    new CompressionPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      crypto: path.resolve(
        __dirname,
        "node_modules/crypto-browserify/index.js"
      ),
    },
    fallback: {
      vm: "vm-browserify", // Specify browser-friendly replacements
    },
  },
};

const esmConfig = {
  ...commonConfig,
  mode: "production", // "development" | "production" | "none"
  output: {
    path: path.resolve(__dirname, "dist/esm"),
    library: {
      type: "module",
    },
    filename: "[name].js",
  },
  experiments: {
    outputModule: true,
  },
};

const umdConfig = {
  ...commonConfig,
  mode: "production", // "development" | "production" | "none"
  output: {
    path: path.resolve(__dirname, "dist/umd"),
    library: "DCR",
    libraryTarget: "umd",
    globalObject: "this",
    filename: "[name].umd.js",
  },
};

export default [esmConfig, umdConfig];
