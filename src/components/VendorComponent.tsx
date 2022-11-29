import React from 'react';

function VendorComponent() {
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Vendor</label>
      <input
        required
        className="lead-5 rounded-lg bg-white py-2 pl-3 text-xl text-gray-900"
        type="text"
        name="vendor"
      />
    </div>
  );
}

export default VendorComponent;
