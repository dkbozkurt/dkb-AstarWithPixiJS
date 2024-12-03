import { defineConfig } from 'vite';
import path from 'path'; // Ensure you import the 'path' module

// https://vitejs.dev/config/
export default defineConfig(() => {

	const isLocal = !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env);

	return {
		root: 'src/',
		base: '/',
		publicDir: '../static',
		resolve:{
			alias:{
				'@': path.resolve(__dirname, 'static')
			}
		},
		server: {
			fs:{
				allow:['..']
			},
			port:3000,
			host: true,
			open: isLocal ? '/#debug' : true,
		},
		build: {
			outDir: '../dist',
			emptyOutDir: true,
		},
	};
});