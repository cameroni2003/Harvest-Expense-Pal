import { Listbox, Menu } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'

function ClientsComponent() {
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState()

    useEffect(() => {
        let done = false

        fetch('/api/test')
            .then((res) => {
                if (!done) {
                    res.json().then((json) => setClients(json.clients))
                }
            })

        return () => {
            done = true
        }
    }, [])

    return (
        <>
            <h3>Clients</h3>
            <Listbox value={selectedClient} onChange={setSelectedClient}>
                <Listbox.Button className="relative w-auto cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">
                        {selectedClient ? selectedClient.name : "Select Client"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Listbox.Options className="mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {clients.map((client) => (
                        <Listbox.Option
                            key={client.id}
                            value={client}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                            }
                        >
                            {({ selected }) => (
                                <>
                                    <span
                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                            }`}
                                    >
                                        {client.name}
                                    </span>
                                    {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </>
    )
}

export default ClientsComponent