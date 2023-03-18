import { memo, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import { getDispenseTotalService } from '../../../../../../services/pharmacy';
import { useStore } from '../../../../../../hooks';

function CalculatePrice({
  isValid,
  values,
}: {
  isValid: boolean;
  values: any;
}) {
  /**
   * state
   */
  const [result, setResult] = useState<{
    subtotal: number;
    discount: number;
    total: number;
  }>();

  /**
   * store
   */
  const { store } = useStore();

  /**
   * function
   */
  const handleAPI = useMemo(
    () =>
      debounce(() => {
        getDispenseTotalService(values).then(
          ({ total }: { total: typeof result }) => {
            setResult(total);
          }
        );
      }, 500),
    [values]
  );

  /**
   * effect
   */
  useEffect(() => {
    if (isValid) {
      handleAPI();
    }
  }, [isValid, handleAPI]);

  return (
    <p className="text-lg">
      <b>Total:</b> {store?.facility?.currency_symbol} {result?.total || '0'}
    </p>
  );
}

export default memo(CalculatePrice);
