import Harvest from 'harvest'
import React, { useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ClientsComponent from '../components/ClientsComponent'
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
        <ClientsComponent />
      </form>
    </div>
  )
}

export default ExpensePal