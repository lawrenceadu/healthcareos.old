import { default as Investigations } from './Patient/Investigations';
import { default as Consultation } from './Patient/Consultation';
import { default as Allergies } from './Patient/Allergies';
import { default as Insurance } from './Patient/Insurance';
import { default as Dispense } from './Patient/Dispense';
import { default as SideTabs } from './Patient/SideTabs';
import { default as Overview } from './Patient/Overview';
import { default as Actions } from './Patient/Actions';
import { default as Invoice } from './Patient/Invoice';
import { default as History } from './Patient/History';
import { default as Detain } from './Patient/Detain';
import { default as Vitals } from './Patient/Vitals';
import { default as Admit } from './Patient/Admit';
import { default as Edit } from './Patient/Edit';
import { default as Info } from './Patient/Info';

export default Object.assign(
  {},
  {
    Investigations,
    Consultation,
    Allergies,
    Insurance,
    Dispense,
    SideTabs,
    Overview,
    Actions,
    Invoice,
    History,
    Detain,
    Vitals,
    Admit,
    Edit,
    Info,
  }
);
