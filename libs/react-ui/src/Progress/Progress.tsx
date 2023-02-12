import { HtmlHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface ProgressProps extends HtmlHTMLAttributes<HTMLDivElement> {
  step: number;
  count: number;
  title: string;
  next?: string;
}

export function Progress({
  next,
  step,
  count,
  title,
  ...props
}: ProgressProps) {
  return (
    <StyledWrapper {...props}>
      <StyledStepCount className="flex rounded-full">
        <small className="font-semibold m-auto">
          {step} of {count}
        </small>
      </StyledStepCount>
      <StyledContent>
        <p className="text-lg mb-0 font-semibold">{title}</p>
        {next && (
          <small className="block mt-1">
            {step !== count && 'Next:'} {next}
          </small>
        )}
      </StyledContent>
    </StyledWrapper>
  );
}

/**
 * styles
 */
const StyledContent = styled.div`
  text-align: right;

  small {
    display: block;
    font-size: 0.75rem;
    color: var(--color-gray-500);
  }
`;

const StyledStepCount = styled.div`
  width: 3rem;
  height: 3rem;
  flex: 0 0 3rem;
  border-radius: 50%;
  background-color: var(--color-white);
  border: solid 1px var(--color-gray-200);

  small {
    font-size: 0.75rem;
  }
`;

const StyledWrapper = styled.div`
  gap: 2rem;
  display: flex;
  padding: 1rem;
  align-items: center;
  border-radius: 0.5rem;
  justify-content: space-between;
  background-color: var(--color-gray-100);
  border: solid 1px var(--color-gray-200);
`;

export default Progress;
