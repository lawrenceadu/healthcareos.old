import { helpers } from '@healthcare/utils';

import Patient from '../../../components/libs/Patient';
import Layout from '../../../components/libs/Layout';

export function Info() {
  return (
    <Layout
      onBack
      title="Patient information"
      className="h-[calc(100%-3.5rem)] relative"
    >
      <div
        className={helpers.classNames(
          'px-4 md:px-12 lg:px-10 pb-24',
          'overflow-y-auto h-full'
        )}
      >
        <Patient.Info className="my-6" />
      </div>
    </Layout>
  );
}

export default Info;
