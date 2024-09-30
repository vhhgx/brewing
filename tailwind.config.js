/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // extend: {
    //   fontFamily: {
    //     lights: ['inter-light'],
    //     blod: ['inter-blod']
    //   },
    // },
    fontSize: {
      sm: ['14px', '20px'], // 注释
      // base: ['16px', '24px'], // 正文字体
      base: ['16px', 1.5], // 正文字体
      lg: ['20px', '30px'], // h4
      xl: ['24px', '36px'], // h3
      '2xl': ['32px', '48px'], // h2
      '3xl': ['48px', '60px'] // h1
      // '4xl': ['64px', '72px']
    },
    borderRadius: {
      DEFAULT: '4px',
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      large: '16px',
      full: '999px'
    },
    colors: {
      primary: '#2348B8',
      secondary: '#42b883'
    },
    // NOTE 字体大小
    fontSizes: {
      small: '14px',
      base: '16px',
      h1: '32px',
      h2: '28px',
      h3: '24px',
      h4: '20px'
    },
    // NOTE 行高
    lineHeights: {
      small: 1.4,
      base: 1.5,
      h1: 1.2,
      h2: 1.3,
      h3: 1.4,
      h4: 1.5
    }
  },
  plugins: []
}
