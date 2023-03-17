import { AddIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import VitalsForm from '../Vitals';
import Chart from '../../Chart';
import Float from '../../Float';

function Vitals() {
  return (
    <>
      <div className="grid gap-4">
        <Chart
          title="Temperature (°C)"
          color="#F59E0B"
          data={[
            { label: 'Feb 10, 10am', value: 35 },
            { label: 'Feb 10, 2pm', value: 67 },
            { label: 'Feb 11, 5pm', value: 100 },
            { label: 'Feb 12, 4am', value: 54 },
            { label: 'Feb 12, 4pm', value: 29 },
            { label: 'Feb 12, 5.30pm', value: 20 },
          ]}
        />

        <Chart
          title="Heart rate (bpm)"
          color="#B55A72"
          data={[
            { label: 'Feb 10, 10am', value: 0 },
            { label: 'Feb 10, 2pm', value: 29 },
            { label: 'Feb 11, 5pm', value: 18 },
            { label: 'Feb 12, 4am', value: 32 },
            { label: 'Feb 12, 4pm', value: 32 },
            { label: 'Feb 12, 5.30pm', value: 27 },
            { label: 'Feb 12, 5.30pm', value: 32 },
          ]}
        />

        <Chart
          title="Blood pressure (mmHg)"
          color="#008A97"
          data={[
            { label: 'Feb 10, 10am', value: 35 },
            { label: 'Feb 10, 2pm', value: 67 },
            { label: 'Feb 11, 5pm', value: 100 },
            { label: 'Feb 12, 4am', value: 54 },
            { label: 'Feb 12, 4pm', value: 29 },
            { label: 'Feb 12, 5.30pm', value: 20 },
          ]}
        />

        <Chart
          title="Respiratory rate (bpm)"
          color="#7434A7"
          data={[
            { label: 'Feb 10, 10am', value: 35 },
            { label: 'Feb 10, 2pm', value: 67 },
            { label: 'Feb 11, 5pm', value: 100 },
            { label: 'Feb 12, 4am', value: 54 },
            { label: 'Feb 12, 4pm', value: 29 },
            { label: 'Feb 12, 5.30pm', value: 20 },
          ]}
        />

        <Chart
          title="Oxygen saturation (%)"
          color="#2D78C6"
          data={[
            { label: 'Feb 10, 10am', value: 35 },
            { label: 'Feb 10, 2pm', value: 67 },
            { label: 'Feb 11, 5pm', value: 100 },
            { label: 'Feb 12, 4am', value: 54 },
            { label: 'Feb 12, 4pm', value: 29 },
            { label: 'Feb 12, 5.30pm', value: 20 },
          ]}
        />
      </div>

      <Float>
        <VitalsForm>
          {({ proceed }) => (
            <Button className="btn-primary" onClick={() => proceed()}>
              <AddIcon />
              <span>Add vitals</span>
            </Button>
          )}
        </VitalsForm>
      </Float>
    </>
  );
}

export default Vitals;
