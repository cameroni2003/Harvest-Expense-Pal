import Harvest from "harvest";
import React, { useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import ProjectsComponent from "../components/ProjectsComponent";
import ExpenseCategories from "../components/ExpenseCategories";
import Example from "../components/ComboExample";
import FileUploadComponent from "../components/FileUploadComponent";

function ExpensePal() {
  const formRef = useRef();

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    const data = new FormData(formRef.current);
    fetch("/api/harvest/createExpense", {
      body: data,
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
    event.preventDefault()
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#59869d] bg-gradient-to-b">
      <div className="container mx-auto mt-32">
        <form
          action="/api/harvest/createExpense"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <h3 className="pb-2 text-2xl font-bold text-white">
            Projects/Categories
          </h3>
          <ProjectsComponent />
          <ExpenseCategories />
          <FileUploadComponent />
          <button
            type="submit"
            className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            Button
          </button>
        </form>
      </div>
    </main>
  );
}

export default ExpensePal;
