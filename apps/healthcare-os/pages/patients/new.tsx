import { useSession } from '@healthcare/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Progress } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { addPatientService } from '../../services/patient';
import { PatientModel } from '../../models';
import { useStore } from '../../hooks';
import Onboarding from '../../components/libs/Onboarding';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

export default function New() {
  /**
   * state
   */
  const [index, setIndex] = useState(0);

  /**
   * session
   */
  const [session, setSession] = useSession<any>('onboarding_form');

  /**
   * routes
   */
  const router = useRouter();

  /**
   * store
   */
  const { store } = useStore();

  /**
   * functions
   */
  const handleSubmit = (params, { setSubmitting }) => {
    addPatientService(params)
      .then(({ patient }: { patient: PatientModel }) => {
        setSession(undefined);
        router.push(
          routes.dashboard.patients.details.index
            .replace('[id]', patient.id)
            .replace('[tab]', 'history')
        );
      })
      .catch((error) => {
        toast.error(
          error?.fields
            ? Object.keys(error?.fields)
                .map((i) => error?.fields[i])
                .join(', ')
            : error?.message || 'Unable to add patient.'
        );

        setSession(params);
      })
      .finally(() => setSubmitting());
  };

  /**
   * variables
   */
  const sections = [
    {
      name: 'Patient details',
      next: 'Contact details',
      component: () => (
        <Onboarding.Details
          button="Continue"
          params={session || {}}
          onSubmit={(params, { setSubmitting }) => {
            setSession({ ...(session || {}), ...params });
            setIndex(index + 1);
          }}
        />
      ),
    },
    {
      name: 'Contact details',
      next: 'Address',
      component: () => (
        <Onboarding.Contact
          button="Continue"
          params={session || {}}
          onSubmit={(params, { setSubmitting }) => {
            setSession({ ...(session || {}), ...params });
            setIndex(index + 1);
          }}
        />
      ),
    },
    {
      name: 'Address',
      next: 'Additional information',
      component: () => (
        <Onboarding.Address
          button="Continue"
          params={session || {}}
          onSubmit={(params, { setSubmitting }) => {
            setSession({ ...(session || {}), ...params });
            setIndex(index + 1);
          }}
        />
      ),
    },
    {
      name: 'Additional information',
      next: 'Insurance details',
      component: () => (
        <Onboarding.AdditionalInfo
          button="Continue"
          params={session || {}}
          onSubmit={(params, { setSubmitting }) => {
            setSession({ ...(session || {}), ...params });
            setIndex(index + 1);
          }}
        />
      ),
    },
    {
      name: 'Insurance details',
      next: 'Next of kin / guardian',
      component: () => (
        <Onboarding.Insurance
          button="Continue"
          params={session || {}}
          onSubmit={(params, { setSubmitting }) => {
            setSession({ ...(session || {}), ...params });
            setIndex(index + 1);
          }}
        />
      ),
    },
    {
      name: 'Next of kin / guardian',
      component: () => (
        <Onboarding.Kin
          button="Submit"
          params={session || {}}
          onSubmit={(params, actions) => {
            handleSubmit({ ...session, ...params }, actions);
          }}
        />
      ),
    },
  ];

  const section = sections[index];

  return (
    <Layout
      title="Add new patient"
      onBack={() => {
        if (index) {
          setIndex(index - 1);
        } else {
          router.back();
        }
      }}
    >
      {section && (
        <>
          <Progress
            step={index + 1}
            title={section.name}
            next={section.next}
            count={sections.length}
            className="max-w-[528px] w-full mx-auto mb-6"
          />

          <section.component />
        </>
      )}
    </Layout>
  );
}
