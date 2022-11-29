import {Listbox, Combobox} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/react/20/solid';
import {trpc} from '../utils/trpc';
import _transform from 'lodash.transform';

function ProjectsComponent() {
  const [projects, setProjects] = useState<object>({});
  const [selectedProject, setSelectedProject] = useState<any>();
  const [query, setQuery] = useState<string>('');

  const {data, isSuccess} = trpc.harvest.getProjects.useQuery();

  const filteredProjects: object =
    query === ''
      ? projects
      : _transform(
          projects,
          (result: any, value: any, key: string) => {
            result[key] = value.filter((proj: {name: string}) =>
              proj.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
            );
          },
          {}
        );
  console.log('filtered projects', filteredProjects);

  useEffect(() => {
    if (isSuccess) setProjects(data);
  }, [isSuccess]);

  return (
    <div className="block my-4">
      <div className="relative mt-1 w-72">
        <Combobox value={selectedProject} onChange={setSelectedProject} name="project">
          <div className="relative w-auto cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              required
              placeholder="Choose a project..."
              displayValue={(project: any) => project?.name}
              onChange={event => setQuery(event.target.value)}
              className="w-60 border-none py-2 pl-3 pr-10 text-lg leading-5 focus-visible:outline-none text-gray-900"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
            <Combobox.Options className="drop-shadow-2xl absolute z-10 w-72 mt-1 max-h-60 cursor-pointer overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Object.entries(filteredProjects).map(([clientName, projects]) => (
                <div className="py-2" key={clientName}>
                  <p className="px-3 text-xl font-bold">{clientName}</p>
                  {projects.map(
                    (project: {
                      id: React.Key | null | undefined;
                      name:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined;
                    }) => (
                      <Combobox.Option
                        key={`${clientName}-${project.id}`}
                        value={project}
                        className={({ active }) =>
                          `relative text-lg cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                            >
                              {project.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                  }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    )
                  )}
                </div>
              ))}
            </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}

export default ProjectsComponent;
