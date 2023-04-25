import { DiagnosisModel } from '../../../../models';

export interface TableRowProps {
  diagnosis: DiagnosisModel;
}

function TableRow({ diagnosis }) {
  return (
    <tr>
      <td>{diagnosis.name}</td>
      <td>{diagnosis.code}</td>
    </tr>
  );
}

export default TableRow;
