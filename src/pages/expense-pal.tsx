import Harvest from 'harvest'
import React, { useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ProjectsComponent from '../components/ProjectsComponent'
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

    <div className="container mx-auto">
      <form action="#" method="POST">
        <ProjectsComponent />
      </form>
    </div>
  )
}

export default ExpensePal