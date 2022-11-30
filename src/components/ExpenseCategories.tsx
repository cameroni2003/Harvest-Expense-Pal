import {Listbox, Combobox} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/react/20/solid';
import {trpc} from '../utils/trpc';
import _transform from 'lodash.transform';

function ExpenseCategories() {
  //const [projects, setProjects] = useState<object>({});
  //const [selectedProject, setSelectedProject] = useState<any>();
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const [expenseCats, setExpenseCats] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any>();

  const {data, isSuccess} = trpc.harvest.getExpenseCategories.useQuery();

  useEffect(() => {
    if (isSuccess) setExpenseCats(data);
  }, [isSuccess]);

  const filteredCategories: any[] =
    query === ''
      ? expenseCats
      : expenseCats.filter((proj: {name: string}) =>
          proj.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="my-4 block">
      <div className="relative mt-1 w-full sm:w-3/5">
        <Combobox value={selectedCat} onChange={setSelectedCat} name="category">
          <div className="relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              required
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              placeholder="Choose a category..."
              displayValue={(project: any) => project?.name}
              onChange={event => setQuery(event.target.value)}
              className="border-none py-2 pl-3 pr-10 text-lg leading-5 text-gray-900 focus-visible:outline-none"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 cursor-pointer overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 drop-shadow-2xl focus:outline-none sm:text-sm">
            {filteredCategories.map((category: any) => (
              <Combobox.Option
                key={category.id}
                value={category}
                className={({active}) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 text-lg ${
                    active ? 'bg-teal-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({selected, active}) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                      {category.name}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-teal-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}

export default ExpenseCategories;

// import {Listbox} from '@headlessui/react';
// import {ChevronUpDownIcon, CheckIcon} from '@heroicons/react/20/solid';
// import React, {useEffect, useState} from 'react';
// import {trpc} from '../utils/trpc';

// export default function ExpenseCategories() {
//   const [expenseCats, setExpenseCats] = useState<any[]>([]);
//   const [selectedCat, setSelectedCat] = useState<any>();

//   const {data, isSuccess} = trpc.harvest.getExpenseCategories.useQuery();

//   useEffect(() => {
//     if (isSuccess) setExpenseCats(data);
//   }, [isSuccess]);

//   return (
//     <div className="my-4">
//       <Listbox value={selectedCat} onChange={setSelectedCat} name="category">
//         <Listbox.Button className="relative w-72 cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
//           <span className="block truncate text-lg">
//             {selectedCat ? selectedCat.name : 'Choose a category...'}
//           </span>
//           <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//             <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//           </span>
//         </Listbox.Button>
//         <Listbox.Options className="mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//           {expenseCats.map(category => (
//             <Listbox.Option
//               key={category.id}
//               value={category}
//               className={({active}) =>
//                 `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
//                   active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
//                 }`
//               }
//             >
//               {({selected}) => (
//                 <>
//                   <span
//                     className={`block truncate text-lg ${selected ? 'font-medium' : 'font-normal'}`}
//                   >
//                     {category.name}
//                   </span>
//                   {selected ? (
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
//                       <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                     </span>
//                   ) : null}
//                 </>
//               )}
//             </Listbox.Option>
//           ))}
//         </Listbox.Options>
//       </Listbox>
//     </div>
//   );
// }
