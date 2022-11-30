import Harvest from 'harvest';
import React, {useEffect, useRef, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import ProjectsComponent from '../components/ProjectsComponent';
import ExpenseCategories from '../components/ExpenseCategories';
import Example from '../components/ComboExample';
import FileUploadComponent from '../components/FileUploadComponent';
import TotalComponent from '../components/TotalComponent';
import VendorComponent from '../components/VendorComponent';
import NotesComponent from '../components/NotesComponent';
import DateComponent from '../components/DateComponent';
import PurposeComponent from '../components/PurposeComponent';
import InitialsComponent from '../components/InitialsComponent';
import {signOut} from 'next-auth/react';

function ExpensePal() {
  const formRef = useRef<null | HTMLFormElement>(null);
  const submitBtnRef = useRef<null | HTMLButtonElement>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    const data = new FormData(formRef.current as HTMLFormElement);
    setSubmitting(true);

    fetch('/api/harvest/create-expense', {
      body: data,
      method: 'POST',
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          window.location.reload();
        } else {
          setSubmitting(false);
        }
        console.log(json);
      });
    event.preventDefault();
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#59869d] bg-gradient-to-b px-5 py-5">
      <div className="mt- container mx-auto">
        <button
          onClick={e => {
            e.preventDefault();
            signOut();
          }}
          type="submit"
          className="float-right mb-6 inline-block rounded bg-blue-600 px-6 py-2.5 text-lg font-bold leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
        >
          Sign out
        </button>
        <form
          action="/api/harvest/createExpense"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <h3 className="pb-2 text-2xl font-bold text-white">Projects/Categories</h3>
          <ProjectsComponent />
          <ExpenseCategories />
          <DateComponent label="Harvest Date" name="harvestDate" />
          <DateComponent label="Expense Date" name="expenseDate" />
          <FileUploadComponent />
          <VendorComponent />
          <TotalComponent />
          <PurposeComponent />
          <NotesComponent />
          <InitialsComponent />
          <button
            disabled={submitting}
            type="submit"
            className="my-6 block rounded bg-blue-600 px-6 py-2.5 text-lg font-bold leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg disabled:opacity-100"
          >
            Submit Expense
          </button>
        </form>
      </div>
    </main>
  );
}

export default ExpensePal;
