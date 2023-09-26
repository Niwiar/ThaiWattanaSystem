import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const niwiarTheme: CustomThemeConfig = {
	name: 'niwiar',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': 'var(--color-surface-100)',
		'--on-secondary': 'var(--color-surface-100)',
		'--on-tertiary': 'var(--color-surface-500)',
		'--on-success': 'var(--color-error-100)',
		'--on-warning': 'var(--color-surface-100)',
		'--on-error': 'var(--color-surface-100)',
		'--on-surface': 'var(--color-secondary-700)',
		// =~= Theme Colors  =~=
		// primary | #59B5E2
		'--color-primary-50': '230 244 251', // #e6f4fb
		'--color-primary-100': '222 240 249', // #def0f9
		'--color-primary-200': '214 237 248', // #d6edf8
		'--color-primary-300': '189 225 243', // #bde1f3
		'--color-primary-400': '139 203 235', // #8bcbeb
		'--color-primary-500': '89 181 226', // #59B5E2
		'--color-primary-600': '80 163 203', // #50a3cb
		'--color-primary-700': '67 136 170', // #4388aa
		'--color-primary-800': '53 109 136', // #356d88
		'--color-primary-900': '44 89 111', // #2c596f
		// secondary | #616993
		'--color-secondary-50': '231 233 239', // #e7e9ef
		'--color-secondary-100': '223 225 233', // #dfe1e9
		'--color-secondary-200': '216 218 228', // #d8dae4
		'--color-secondary-300': '192 195 212', // #c0c3d4
		'--color-secondary-400': '144 150 179', // #9096b3
		'--color-secondary-500': '97 105 147', // #616993
		'--color-secondary-600': '87 95 132', // #575f84
		'--color-secondary-700': '73 79 110', // #494f6e
		'--color-secondary-800': '58 63 88', // #3a3f58
		'--color-secondary-900': '48 51 72', // #303348
		// tertiary | #22263E
		'--color-tertiary-50': '222 222 226', // #dedee2
		'--color-tertiary-100': '211 212 216', // #d3d4d8
		'--color-tertiary-200': '200 201 207', // #c8c9cf
		'--color-tertiary-300': '167 168 178', // #a7a8b2
		'--color-tertiary-400': '100 103 120', // #646778
		'--color-tertiary-500': '34 38 62', // #22263E
		'--color-tertiary-600': '31 34 56', // #1f2238
		'--color-tertiary-700': '26 29 47', // #1a1d2f
		'--color-tertiary-800': '20 23 37', // #141725
		'--color-tertiary-900': '17 19 30', // #11131e
		// success | #50B27C
		'--color-success-50': '229 243 235', // #e5f3eb
		'--color-success-100': '220 240 229', // #dcf0e5
		'--color-success-200': '211 236 222', // #d3ecde
		'--color-success-300': '185 224 203', // #b9e0cb
		'--color-success-400': '133 201 163', // #85c9a3
		'--color-success-500': '80 178 124', // #50B27C
		'--color-success-600': '72 160 112', // #48a070
		'--color-success-700': '60 134 93', // #3c865d
		'--color-success-800': '48 107 74', // #306b4a
		'--color-success-900': '39 87 61', // #27573d
		// warning | #CDA244
		'--color-warning-50': '248 241 227', // #f8f1e3
		'--color-warning-100': '245 236 218', // #f5ecda
		'--color-warning-200': '243 232 208', // #f3e8d0
		'--color-warning-300': '235 218 180', // #ebdab4
		'--color-warning-400': '220 190 124', // #dcbe7c
		'--color-warning-500': '205 162 68', // #CDA244
		'--color-warning-600': '185 146 61', // #b9923d
		'--color-warning-700': '154 122 51', // #9a7a33
		'--color-warning-800': '123 97 41', // #7b6129
		'--color-warning-900': '100 79 33', // #644f21
		// error | #F44336
		'--color-error-50': '253 227 225', // #fde3e1
		'--color-error-100': '253 217 215', // #fdd9d7
		'--color-error-200': '252 208 205', // #fcd0cd
		'--color-error-300': '251 180 175', // #fbb4af
		'--color-error-400': '247 123 114', // #f77b72
		'--color-error-500': '244 67 54', // #F44336
		'--color-error-600': '220 60 49', // #dc3c31
		'--color-error-700': '183 50 41', // #b73229
		'--color-error-800': '146 40 32', // #922820
		'--color-error-900': '120 33 26', // #78211a
		// surface | #EAF3F6
		'--color-surface-50': '252 253 254', // #fcfdfe
		'--color-surface-100': '251 253 253', // #fbfdfd
		'--color-surface-200': '250 252 253', // #fafcfd
		'--color-surface-300': '247 250 251', // #f7fafb
		'--color-surface-400': '240 247 249', // #f0f7f9
		'--color-surface-500': '234 243 246', // #EAF3F6
		'--color-surface-600': '211 219 221', // #d3dbdd
		'--color-surface-700': '176 182 185', // #b0b6b9
		'--color-surface-800': '140 146 148', // #8c9294
		'--color-surface-900': '115 119 121' // #737779
	}
};
