import React from 'react';

function NotesComponent() {
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Notes</label>
      <textarea
        className="lead-5 h-60 w-full rounded-lg bg-white py-2 pl-3 text-xl text-gray-900 sm:w-3/5"
        name="notes"
      />
    </div>
  );
}

export default NotesComponent;
