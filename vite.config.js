import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// Set base path for GitHub Pages only in production
	base: mode === 'production' ? '/Offbeat-frontend/' : '/',
	server: {
		port: 5173,
		host: true,
		open: true
	},
	preview: {
		port: process.env.PORT || 4173,
		host: true
	},
	build: {
		// Ensure assets are built to dist folder for GitHub Pages
		outDir: 'dist',
		emptyOutDir: true,
		// Generate source maps for better debugging in development
		sourcemap: mode === 'development',
		// Optimize chunks for better loading
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					router: ['react-router-dom'],
					ui: ['@mui/material', '@mui/icons-material']
				}
			}
		}
	},
	// Define environment variables
	define: {
		'process.env.NODE_ENV': JSON.stringify(mode),
		'process.env.VITE_LOCAL': JSON.stringify(process.env.VITE_LOCAL || 'false')
	}
}))
