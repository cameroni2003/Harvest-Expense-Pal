import React from "react";

function NotesComponent() {
  return (
    <div className="my-4">
      <label className="block text-2xl font-bold text-slate-200 mb-1">Notes</label>
      <input type="textarea" name="notes" />
    </div>
  );
}

export default NotesComponent;
