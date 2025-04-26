// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Poppins', 'sans-serif']
			},
			fontSize: {
				h1: ['2.5rem', { lineHeight: '1.2' }], // 40px
				h2: ['2rem', { lineHeight: '1.3' }], // 32px
				h3: ['1.5rem', { lineHeight: '1.4' }], // 24px
				body: ['1rem', { lineHeight: '1.6' }], // 16px
				small: ['0.875rem', { lineHeight: '1.6' }] // 14px
			},
			borderRadius: {
				sm: '0.25rem', // 4px
				md: '0.5rem', // 8px
				lg: '1rem', // 16px
				full: '9999px' // Full circle
			},
			colors: {
				primary: '#1D4ED8',
				secondary: '#64748B',
				accent: '#10B981',
				muted: '#F3F4F6',
				dark: '#111827'
			},
			borderWidth: {
				DEFAULT: '1px',
				2: '2px'
			},
			boxShadow: {
				card: '0 2px 8px rgba(0, 0, 0, 0.05)',
				button: '0 1px 3px rgba(0, 0, 0, 0.1)'
			},
			container: {
				center: true,
				padding: {
					DEFAULT: '1.5rem', // 24px (px-6)
					sm: '2rem', // 32px
					md: '3rem', // 48px
					lg: '4rem', // 64px
					xl: '6rem', // 96px
					'2xl': '8rem' // 128px
				}
			}
		}
	},
	plugins: []
};

export default config;
