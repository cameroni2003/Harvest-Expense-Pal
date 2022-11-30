import React from 'react';

function InitialsComponent() {
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Initials</label>
      <input
        className="lead-5 w-12 rounded-lg bg-white py-2 pl-3 text-xl text-gray-900"
        type="text"
        name="initials"
      />
    </div>
  );
}

export default InitialsComponent;
