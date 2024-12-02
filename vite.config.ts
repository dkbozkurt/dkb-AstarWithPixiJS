import { defineConfig } from 'vite';
import path from 'path'; // Ensure you import the 'path' module

import { viteSingleFile } from "vite-plugin-singlefile"
import { createHtmlPlugin } from 'vite-plugin-html';
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const outDir = process.env.OUT_DIR || 'dist';

	return {
		root: 'src/',
		base: '/',
		clearScreen: false,
		publicDir: '../static',
		resolve:{
			alias:{
				'@': path.resolve(__dirname, 'static')
			}
		},
		json:{
			stringify : true,
		},
		plugins: [
			glsl(),
			viteSingleFile({ removeViteModuleLoader: true }),
			createHtmlPlugin({
				minify: {
					collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    minifyCSS: true,
                    minifyJS: true,
                    minifyURLs: true,
					ignoreCustomComments: [/(<!--@cc_on|@if\s*\([^)]+\))[\s\S]*?(?=\s*<!--@|\s*$)/gi],
                    processConditionalComments: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeAttributeQuotes: true,
                    sortAttributes: true,
                    sortClassName: true,
                    trimCustomFragments: true,
                    useShortAttributeNames: false,
                    useShortCommentBlocks: false,
                    keepClosingSlash:true,
				}
			})
		],
		server: {
			fs:{
				allow:['..']
			},
			port:3000,
			host: true,
			open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
		},
		build: {
			target: 'esnext',
			sourcemap: false,
			emptyOutDir: false,
			outDir: path.resolve(__dirname, outDir),
			base: './',
			assetsInlineLimit: 0, // ! Inline asset limit removed
			cssCodeSplit: false,
			minify: 'esbuild',
			clearScreen: true,
			copyPublicDir: false, // ! Wont copy the assets into dist folder
			rollupOptions: {
				makeAbsoluteExternalsRelative: true,
				output: {
					compact: true,
					hashCharacters: 'base64',
					inlineDynamicImports: true,
				},
				treeshake :{
					preset: 'recommended',
				}
			},
			esbuildOptions: {
                minify: true,
				treeShaking: true,
				sourceMap: false,
				bundle: true,
                loader: {
                    '.svg': {
                        minify: true,
						compress: true,
                    },
					'.png': {
						minify: true,
                        compress: true,
					},
					'.hdr': {
						minify: true,
                        compress: true,
					}
                },
			}
		},
		assetsInclude: [ 
			'**/*.png', '**/*.jpe?g', '**/*.hdr',
			'**/*.mp4', '**/*.mp3', '**/*.mov', '**/*.wav',
			'**/*.glb', '**/*.gltf',
			'**/*.ttf', '**/*.otf', '**/*.xml', '**/*.woff', '**/*.woff2',
			'**/*.json',
		],
	};
});