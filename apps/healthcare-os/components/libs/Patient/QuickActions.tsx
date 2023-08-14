import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import * as Icon from '@healthcare/icons';
import styled from 'styled-components';

import Investigations from './Investigations';
import Consultation from './Consultation';
import Medication from './Medication';
import Visitation from './Visitation';
import Allergies from './Allergies';
import Discharge from './Discharge';
import Procedure from './Procedure';
import Detain from './Detain';
import Vitals from './Vitals';
import Admit from './Admit';
import Move from './Move';

import { usePatient, usePermissions } from '../../../hooks';
import routes from '../../../routes';

export interface QuickActionsProps {
  children?: (props: { proceed: () => void }) => ReactElement;
}

function QuickActions({ children }: QuickActionsProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children ? (
        <>
          {children({ proceed: () => setShow(true) })}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShow(false);
              }
            }}
            className={helpers.classNames(
              'flex',
              'transition',
              'bg-black/50',
              'w-full h-full',
              'fixed left-0 z-[1010]',
              show ? 'bottom-0' : '-bottom-[100%]'
            )}
          >
            <div
              className={helpers.classNames(
                'w-full',
                'bg-white',
                'py-10 px-4 md:py-12 md:px-12 mt-auto',
                'rounded-tl-3xl rounded-tr-3xl'
              )}
            >
              <Actions />
            </div>
          </div>
        </>
      ) : (
        <Actions />
      )}
    </>
  );
}

const Actions = () => {
  /**
   * routes
   */
  const router = useRouter();
  const { id } = router.query;

  /**
   * context
   */
  const { patient } = usePatient();

  /**
   * perm
   */
  const [
    canAddVisit,
    canEditPatient,
    canAddVital,
    canAddConsultation,
    canViewInvestigationRequest,
    canViewPrescription,
    canViewAllergy,
    canEditQueue,
    canAdmit,
    canEndVisit,
    canEndAdmission,
    canAddProcedureRequest,
  ] = usePermissions(
    'visit_add',
    'patient_edit',
    'vital_add',
    'consultation_add',
    'investigationrequest',
    'prescription',
    'allergy',
    'queue_edit',
    'admission_add',
    'visit_edit',
    'admission_edit',
    'procedurerequest_add'
  );

  /**
   * variables
   */
  const inVisistation = ['visiting', 'detained', 'admitted'].includes(
    patient.status
  );
  const isDetained = patient.status === 'detained';
  const isAdmitted = patient.status === 'admitted';

  return (
    <div className="grid grid-cols-2 gap-4">
      {canAddVisit && !inVisistation && (
        <Visitation>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.HeartBookIcon />
              <p>Start visitation</p>
            </StyledCard>
          )}
        </Visitation>
      )}

      {canEditPatient && (
        <StyledCard
          role="button"
          onClick={() =>
            router.push({
              pathname: routes.dashboard.patients.details.edit,
              query: { id },
            })
          }
        >
          <Icon.UserEditIcon />
          <p>Edit profile</p>
        </StyledCard>
      )}

      {/* {!inVisistation && (
        <StyledCard
          role="button"
          onClick={() =>
            router.push({
              pathname: routes.dashboard.patients.card.activate,
              query: { id },
            })
          }
        >
          <Icon.QrCodeIcon />
          <p>Re-issue card</p>
        </StyledCard>
      )} */}

      {/* {!inVisistation && (
        <StyledCard role="button">
          <Icon.PasscodeIcon />
          <p>Re-issue PIN</p>
        </StyledCard>
      )} */}

      {canAddVital && inVisistation && (
        <Vitals>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.LungIcon />
              <p>Vitals</p>
            </StyledCard>
          )}
        </Vitals>
      )}

      {canAddConsultation && inVisistation && (
        <Consultation>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.ConsultationIcon />
              <p>Consultation</p>
            </StyledCard>
          )}
        </Consultation>
      )}

      {canViewInvestigationRequest && inVisistation && (
        <Investigations>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.StethoscopeIcon />
              <p>Investigation</p>
            </StyledCard>
          )}
        </Investigations>
      )}

      {canAddProcedureRequest && inVisistation && (
        <Procedure>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.ScissorsIcon />
              <p>Procedure</p>
            </StyledCard>
          )}
        </Procedure>
      )}

      {canViewPrescription && inVisistation && (
        <Medication>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.DrugIcon />
              <p>Medication</p>
            </StyledCard>
          )}
        </Medication>
      )}

      {canViewAllergy && inVisistation && (
        <Allergies>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.VirusIcon />
              <p>Allergies</p>
            </StyledCard>
          )}
        </Allergies>
      )}

      {canEditQueue && inVisistation && (
        <Move>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.UsersIcon />
              <p>Queueing</p>
            </StyledCard>
          )}
        </Move>
      )}

      {canAdmit && (
        <>
          {inVisistation && !isDetained && !isAdmitted && (
            <Detain>
              {({ proceed }) => (
                <StyledCard role="button" onClick={() => proceed()}>
                  <Icon.HeartPulseIcon />
                  <p>Detain patient</p>
                </StyledCard>
              )}
            </Detain>
          )}

          {inVisistation && !isAdmitted && (
            <Admit>
              {({ proceed }) => (
                <StyledCard role="button" onClick={() => proceed()}>
                  <Icon.BedIcon />
                  <p>Admit patient</p>
                </StyledCard>
              )}
            </Admit>
          )}
        </>
      )}

      {canEndVisit &&
        inVisistation &&
        ['visiting'].includes(patient.status) && (
          <>
            <Visitation>
              {({ proceed }) => (
                <StyledCard
                  role="button"
                  onClick={() => proceed()}
                  className="!border-red-200 !bg-red-50 !text-red-600"
                >
                  <Icon.HeartBookIcon className="!text-red-600" />
                  <p>End visitation</p>
                </StyledCard>
              )}
            </Visitation>
          </>
        )}

      {canEndAdmission &&
        inVisistation &&
        ['detained', 'admitted'].includes(patient.status) && (
          <Discharge>
            {({ proceed }) => (
              <StyledCard
                role="button"
                onClick={() => proceed()}
                className="!border-red-200 !bg-red-50 !text-red-600"
              >
                <Icon.HeartBookIcon className="!text-red-600" />
                <p>Discharge patient</p>
              </StyledCard>
            )}
          </Discharge>
        )}
    </div>
  );
};

/**
 * styles
 */
const StyledCard = styled.div`
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-gray-50);
  border: solid 1px var(--color-gray-200);

  svg {
    margin-bottom: 0.5rem;
    color: var(--color-gray-600);
  }
`;

export default QuickActions;
