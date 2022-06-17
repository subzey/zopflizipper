import { URL, fileURLToPath } from 'url';
import * as Webpack from "webpack"; // For typings only

/** @type {Webpack.Configuration} */
export default {
	mode: 'development',
	devtool: 'hidden-nosources-source-map',
	entry: [
		"./src/main.js",
		"./src/index.html",
	],
	output: {
		path: fileURLToPath(new URL('./dist/', import.meta.url))
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				// .html are not JS modules,
				// these should just be copied
				type: 'asset/resource',
				generator: {
					filename: '[name][ext]'
				}
			}
		]
	}
	// resolve: {
	// 	alias: {},
	// }
}
