import Patient from '../../../components/libs/Patient';
import Layout from '../../../components/libs/Layout';

function Edit() {
  return (
    <Layout title="Edit patient profile" onBack>
      <Patient.Edit />
    </Layout>
  );
}

export default Edit;
