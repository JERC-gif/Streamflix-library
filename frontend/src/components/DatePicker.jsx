import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

export default function DatePicker({ value, onChange, placeholder = "Seleccionar fecha" }) {
  return (
    <Flatpickr
      className="form-input"
      value={value || ''}
      onChange={([date]) => onChange(date ? date.toISOString().split('T')[0] : '')}
      options={{
        dateFormat: 'Y-m-d',
        locale: Spanish,
        disableMobile: false,
        theme: 'dark'
      }}
      placeholder={placeholder}
    />
  );
}
