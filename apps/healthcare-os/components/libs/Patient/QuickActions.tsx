import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import * as Icon from '@healthcare/icons';
import styled from 'styled-components';

import Investigation from './Investigation';
import Consultation from './Consultation';
import Medication from './Medication';
import Visitation from './Visitation';
import Allergies from './Allergies';
import Detain from './Detain';
import Vitals from './Vitals';
import Admit from './Admit';

import routes from '../../../routes';
import Move from './Move';

export interface QuickActionsProps {
  inVisistation?: boolean;
  children?: (props: { proceed: () => void }) => ReactElement;
}

function QuickActions({ children, inVisistation = true }: QuickActionsProps) {
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
              'fixed left-0 z-[110]',
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
              <Actions {...{ inVisistation }} />
            </div>
          </div>
        </>
      ) : (
        <Actions {...{ inVisistation }} />
      )}
    </>
  );
}

const Actions = ({ inVisistation }: Omit<QuickActionsProps, 'children'>) => {
  /**
   * routes
   */
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {!inVisistation && (
        <Visitation>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.HeartBookIcon />
              <p>Start visitation</p>
            </StyledCard>
          )}
        </Visitation>
      )}

      {!inVisistation && (
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

      {!inVisistation && (
        <StyledCard
          role="button"
          onClick={() =>
            router.push({
              pathname: routes.dashboard.patients.card.activate,
              query: { slug: id },
            })
          }
        >
          <Icon.QrCodeIcon />
          <p>Re-issue card</p>
        </StyledCard>
      )}

      {!inVisistation && (
        <StyledCard role="button">
          <Icon.PasscodeIcon />
          <p>Re-issue PIN</p>
        </StyledCard>
      )}

      {inVisistation && (
        <Vitals>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.LungIcon />
              <p>Vitals</p>
            </StyledCard>
          )}
        </Vitals>
      )}

      {inVisistation && (
        <Consultation>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.ConsultationIcon />
              <p>Consultation</p>
            </StyledCard>
          )}
        </Consultation>
      )}

      {inVisistation && (
        <Investigation>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.StethoscopeIcon />
              <p>Investigation</p>
            </StyledCard>
          )}
        </Investigation>
      )}

      {inVisistation && (
        <Medication>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.DrugIcon />
              <p>Medication</p>
            </StyledCard>
          )}
        </Medication>
      )}

      {inVisistation && (
        <Allergies>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.VirusIcon />
              <p>Allergies</p>
            </StyledCard>
          )}
        </Allergies>
      )}

      {inVisistation && (
        <Move>
          {({ proceed }) => (
            <StyledCard role="button" onClick={() => proceed()}>
              <Icon.UsersIcon />
              <p>Move to another location</p>
            </StyledCard>
          )}
        </Move>
      )}

      <Detain>
        {({ proceed }) => (
          <StyledCard role="button" onClick={() => proceed()}>
            <Icon.HeartPulseIcon />
            <p>Detain patient</p>
          </StyledCard>
        )}
      </Detain>

      <Admit>
        {({ proceed }) => (
          <StyledCard role="button" onClick={() => proceed()}>
            <Icon.BedIcon />
            <p>Admit patient</p>
          </StyledCard>
        )}
      </Admit>

      {inVisistation && (
        <Visitation end>
          {({ proceed }) => (
            <StyledCard
              role="button"
              className="!border-red-200 !bg-red-50"
              onClick={() => proceed()}
            >
              <Icon.HeartBookIcon className="!text-red-600" />
              <p>End visitation</p>
            </StyledCard>
          )}
        </Visitation>
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
