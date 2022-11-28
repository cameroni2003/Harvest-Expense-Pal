import React from 'react';

function NotesComponent() {
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Notes</label>
      <input type="textarea" name="notes" />
    </div>
  );
}

export default NotesComponent;
