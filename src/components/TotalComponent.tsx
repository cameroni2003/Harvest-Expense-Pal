import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

function TotalComponent() {
    const [total, setTotal] = useState<string>("0.00")
  return (
    <div>
      <CurrencyInput
        onValueChange={(value) => setTotal(value ?? "0.00")}
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
