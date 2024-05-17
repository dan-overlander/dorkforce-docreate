import * as webpack from "webpack";
import * as path from "path";
import fs from "fs";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

const __dirname = fs.realpathSync(process.cwd());

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    externals: {
        "@dds/components": "DDS"
    },
    mode: "development", // "development" | "production" | "none"
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
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module'
        },
        filename: "[name].js",
    },
    experiments: {
        outputModule: true
    },
    plugins: [
        new NodePolyfillPlugin(), // This plugin polyfills Node.js core modules
        new CompressionPlugin(),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            crypto: path.resolve(__dirname, "node_modules/crypto-browserify/index.js"),
        },
        fallback: {
            vm: "vm-browserify", // Specify browser-friendly replacements
        },
    },
};

export default config;
