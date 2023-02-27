import { default as Investigation } from './Patient/Investigation';
import { default as Consultation } from './Patient/Consultation';
import { default as QuickActions } from './Patient/QuickActions';
import { default as Medication } from './Patient/Medication';
import { default as Visitation } from './Patient/Visitation';
import { default as Allergies } from './Patient/Allergies';
import { default as Insurance } from './Patient/Insurance';
import { default as Dispense } from './Patient/Dispense';
import { default as Dropdown } from './Patient/Dropdown';
import { default as Overview } from './Patient/Overview';
import { default as Actions } from './Patient/Actions';
import { default as Invoice } from './Patient/Invoice';
import { default as History } from './Patient/History';
import { default as Detain } from './Patient/Detain';
import { default as Vitals } from './Patient/Vitals';
import { default as Admit } from './Patient/Admit';
import { default as Notes } from './Patient/Notes';
import { default as Edit } from './Patient/Edit';
import { default as Info } from './Patient/Info';
import { default as Move } from './Patient/Move';

export default Object.assign(
  {},
  {
    Investigation,
    Consultation,
    QuickActions,
    Medication,
    Visitation,
    Allergies,
    Insurance,
    Dispense,
    Dropdown,
    Overview,
    Actions,
    Invoice,
    History,
    Detain,
    Vitals,
    Admit,
    Notes,
    Edit,
    Info,
    Move,
  }
);
