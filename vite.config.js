import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: process.env.NODE_ENV === 'production' ? '/Offbeat-frontend/' : '/',
	define: {
		'import.meta.env.VITE_LOCAL': process.env.NODE_ENV === 'production' ? '"true"' : 'undefined',
	},
	preview: {
		port: process.env.PORT || 4173,
		host: true
	},
	// After setting-up a backend, this can automoate the copying process of the built files:
	// build: {
	// 	outDir: '../backend/public',
	// 	emptyOutDir: true,
	// },
	// If we want to build a local version (that uses local services)
	// define: {
	// 	'process.env.VITE_LOCAL': 'true'
	// }

})
