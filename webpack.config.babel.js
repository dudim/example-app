import path from 'path';
import webpack from 'webpack';

const isDebug = process.env.NODE_ENV !== 'production';

const webpackConfig = {
	context: __dirname,
	entry: './app/index.jsx',
	output: {
		path: path.resolve(__dirname, 'public/assets/scripts/'),
		filename: 'app.min.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: [
							['es2015', { modules: false }],
							'stage-0',
							'react',
						],
					},
				}],
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'eslint-loader',
					options: {
						configFile: '.eslintrc',
						failOnWarning: false,
						failOnError: false,
						fix: true,
					},
				},
			},
			{
				test: /\.styl$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'stylus-loader',
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	plugins: [],
	watch: isDebug,
	devtool: isDebug ? 'eval' : false,
};

if (!isDebug) {
	webpackConfig.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: isDebug,
		}),
	);
	webpackConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
	);
}

module.exports = webpackConfig;
