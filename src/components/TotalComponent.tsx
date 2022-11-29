import React, {useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

function TotalComponent() {
  const [total, setTotal] = useState<string>('0.00');
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Total</label>

      <CurrencyInput
        className="sm:w-3/5 lead-5 w-full rounded-lg bg-white py-2 pl-3 text-xl text-gray-900"
        onValueChange={value => setTotal(value ?? '0.00')}
        disableAbbreviations={true}
        defaultValue={0}
        allowNegativeValue={false}
        prefix="$"
        required
      />
      <input name="total" type="hidden" value={total} />
    </div>
  );
}

export default TotalComponent;
