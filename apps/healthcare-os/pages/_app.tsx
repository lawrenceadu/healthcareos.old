import { font, helpers, http } from '@healthcare/utils';
import { SSRProvider } from '@restart/ui/ssr';
import { SWRConfig } from 'swr';
import { AppProps } from 'next/app';
import Head from 'next/head';

import './styles.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to Healthcare OS</title>
      </Head>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>

      <SWRConfig
        value={{
          fetcher: (url) => http.get(url).then((response) => response),
          dedupingInterval: 1000 * 60 * 1,
          shouldRetryOnError: false,
          revalidateOnFocus: true,
        }}
      >
        <SSRProvider>
          <main className={helpers.classNames('app h-full overflow-auto')}>
            <Component {...pageProps} />
          </main>
        </SSRProvider>
      </SWRConfig>
    </>
  );
}

export default CustomApp;
