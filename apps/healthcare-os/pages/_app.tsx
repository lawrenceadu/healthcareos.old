import { font, helpers, http } from '@healthcare/utils';
import { ToastContainer } from 'react-toastify';
import { SSRProvider } from '@restart/ui/ssr';
import { SWRConfig } from 'swr';
import { AppProps } from 'next/app';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import Head from 'next/head';

import PatientProvider from '../contexts/Patient';
import StoreProvider from '../contexts/Store';
import NoSSR from '../components/libs/NoSSR';

import './styles.scss';

dayjs.extend(relativeTime);

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

      <NoSSR>
        <SWRConfig
          value={{
            fetcher: (url) => http.get(url).then((response) => response),
            // dedupingInterval: 1000 * 60 * 15,
            shouldRetryOnError: false,
            revalidateOnFocus: true,
          }}
        >
          <SSRProvider>
            <main className={helpers.classNames('app h-full overflow-auto')}>
              <StoreProvider>
                <PatientProvider>
                  <Component {...pageProps} />
                </PatientProvider>
              </StoreProvider>
              <ToastContainer hideProgressBar newestOnTop />
            </main>
          </SSRProvider>
        </SWRConfig>
      </NoSSR>
    </>
  );
}

export default CustomApp;
