import Form from './Form';

function Add({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  return <Form onHide={onHide} onSuccess={() => setTab('index')} />;
}

export default Add;
