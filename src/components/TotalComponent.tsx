import React, {useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

function TotalComponent() {
  const [total, setTotal] = useState<string>('0.00');
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Total</label>

      <CurrencyInput
        onValueChange={value => setTotal(value ?? '0.00')}
        disableAbbreviations={true}
        defaultValue={0.0}
        allowNegativeValue={false}
        prefix="$"
        fixedDecimalLength={2}
      />
      <input name="total" type="hidden" value={total} />
    </div>
  );
}

export default TotalComponent;
