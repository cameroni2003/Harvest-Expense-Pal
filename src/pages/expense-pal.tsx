import Harvest from 'harvest'
import React, { useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ProjectsComponent from '../components/ProjectsComponent'
import ExpenseCategories from '../components/ExpenseCategories'
function ExpensePal() {

  return (
    //     <div>
    //     {clients.length ? 
    //     clients.map((c) => {
    //       return <div>{c.name}</div>
    //     })
    //     :
    //   <div></div>
    // }

    // </div>
    <main className="flex min-h-screen flex-col bg-gradient-to-b bg-[#59869d]">
      <div className="container mx-auto mt-32">
        <form action="#" method="POST">
          <h3 className="text-2xl text-white font-bold pb-2">Projects/Categories</h3>
          <ProjectsComponent />
          <ExpenseCategories />
        </form>
      </div>
    </main>
  )
}

export default ExpensePal