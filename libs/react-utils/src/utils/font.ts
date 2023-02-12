import localFont from '@next/font/local';

const font = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Variable.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
});

export default font;
