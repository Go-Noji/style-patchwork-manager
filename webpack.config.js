const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MODE = 'development';
const path = require('path');

module.exports = {
	mode: MODE,
	entry: {
		page: "./src/page.ts",
		background: "./src/background.ts",
		options: "./src/options/options.ts",
	},
	output: {
		filename: '[name].bundle.js',
		path: `${__dirname}/extension`
	},
	devtool: MODE === 'development' ? 'inline-source-map' : '',
	module: {
		rules: [
			{
				// 'ts-loader' で TypeScript をコンパイル
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				// '*.vue' ファイルも TS として認識させるためのオプション
				options: {
					appendTsSuffixTo: [/\.vue$/],
				},
			},
			{
				// 単一ファイルコンポーネントは vue-loader が処理
				test: /\.vue$/,
				exclude: /node_modules/,
				loader: 'vue-loader',
			},
			{
				test: /\.css$/,
				// 配列最後尾のローダーから実行される
				use: ['vue-style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts', '.scss', '.css', '.vue'],
		alias: {
			vue: 'vue/dist/vue.runtime.esm.js',
			'@': path.resolve(__dirname, 'src'),
		}
	},
	plugins: [new VueLoaderPlugin()]
};
