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
	},
	resolve: {
		fallback: {
			stream: false,
			path: false,
			fs: false,
		},
		alias: [
			{
				'name': 'jszip',
				'alias': 'jszip/lib/index.js',
				onlyModule: true,
			},
			{ // Comment this out to disable zopfli
				'name': 'pako',
				'alias': fileURLToPath(
					new URL('./src/zopfli-pako-adapter.js', import.meta.url)
				),
			}
		],
	}
}
