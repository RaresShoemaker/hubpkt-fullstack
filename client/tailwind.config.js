const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#0D4AE7',
				secondary: '#848484',
				bg: '#1b215d'
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem'
			},
			backgroundImage: {
				'gradient-custom': 'linear-gradient(180deg, rgba(9, 13, 35, 0.79), rgba(29, 35, 67, 0.79))',
				'gradient-blur':
					'linear-gradient(180deg, rgba(44, 74, 194, 0) 0%, rgba(4, 10, 31, 0.8) 55.5%, #000000 100%)',
				'gradient-text-discover': 'linear-gradient(90deg, #FFF 0%, #3CADEF 100%);',
				'gradient-text-hot': ' linear-gradient(90deg, #FFF 0%, #F79422 100%)'
			},
			blur: {
				84: '84.2105px'
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities, addBase }) {
			addUtilities({
				'.glass': {
					background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(0, 0, 0, 0.00) 76.61%)',
					'border-radius': '24px 0px 0px 24px',
					'backdrop-filter': 'blur(22px)',
					'-webkit-backdrop-filter': 'blur(22px)'
				},
				'.glass-white': {
					background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(0, 0, 0, 0.00) 76.61%)',
					'border-radius': '24px',
					'backdrop-filter': 'blur(22px)',
					'-webkit-backdrop-filter': 'blur(22px)'
        },
				'.glass-black': {
          'background': 'rgba(0,0,0,0.2)',
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(7.7px)',
          '-webkit-backdrop-filter': 'blur(7.7px)',
        },

				'.text-gradient': {
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					color: 'transparent'
				}
			});
		})
	]
};
