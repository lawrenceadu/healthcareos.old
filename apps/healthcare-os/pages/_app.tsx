import { font, helpers, http } from '@healthcare/utils';
import { ToastContainer } from 'react-toastify';
import { SSRProvider } from '@restart/ui/ssr';
import { SWRConfig } from 'swr';
import { AppProps } from 'next/app';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import Head from 'next/head';

import PatientProvider from '../contexts/Patient';
import StoreProvider from '../contexts/Store';
import Script from 'next/script';
import NoSSR from '../components/libs/NoSSR';

import './styles.scss';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to Healthcare OS</title>
      </Head>
      <Script id="tawkto">
        {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/645395bd31ebfa0fe7fbf006/1gvj81s0a';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();`}
      </Script>

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
