import React, { useState, HtmlHTMLAttributes } from 'react';
import { SpinnerIcon } from '@healthcare/icons';
import { QrReader } from 'react-qr-reader';
import { helpers } from '@healthcare/utils';
import { Button } from '@healthcareos/react';

export interface ScanCardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onSuccess: (result: string, setDone: () => void) => void;
}

export function ScanCard({ onSuccess, className, ...props }: ScanCardProps) {
  /**
   * state
   */
  const [results, setResults] = useState<{ text: string }>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={helpers.classNames(className, 'h-[258px] md:h-[352px] w-full')}
    >
      <div
        className={helpers.classNames(
          'h-full w-full',
          'bg-neutral-50',
          'relative rounded-lg overflow-hidden'
        )}
      >
        {results ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="text-center">
              {isLoading ? (
                <SpinnerIcon className="w-12 h-12 mb-6 mx-auto" />
              ) : (
                <Button
                  className="btn btn-secondary"
                  onClick={() => setResults(undefined)}
                >
                  Scan again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <QrReader
            className="h-full"
            constraints={{ facingMode: 'environment' }}
            onResult={(result: any) => {
              if (result) {
                setIsLoading(true);
                setResults(result);
                onSuccess(result.text, () => setIsLoading(false));
              }
            }}
            videoContainerStyle={{ paddingTop: '0', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(ScanCard);
