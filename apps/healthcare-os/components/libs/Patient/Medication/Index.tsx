import { usePatient } from '../../../../hooks';
import Prescription from '../../../pages/pharmacy/index/Prescriptions';

export function Medication({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  /**
   * hook
   */
  const { patient } = usePatient();

  return (
    <div className="px-6 pb-6">
      <Prescription patient={patient} />
    </div>
  );
}

export default Medication;
