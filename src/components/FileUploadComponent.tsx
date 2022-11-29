import React, {useRef, useState} from 'react';

function FileUploadComponent() {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>();

  const hasMask = {
    position: 'absolute',
    clip: 'rect(10px, 150px, 130px, 10px)',
  };

  function onFileChange(event: React.SyntheticEvent<HTMLInputElement>) {
    (event.target as HTMLInputElement).files;
  }

  return (
    <div className="my-4 w-full sm:w-3/5">
      <label className="mb-1 block text-2xl font-bold text-slate-200">Receipt</label>
      <div className="relative flex items-center">
        <div className="w-full rounded-md bg-white p-5 ">
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold tracking-wide text-gray-500">Attach Document</label>
            <div className="flex w-full cursor-pointer items-center justify-center">
              <label className="group w-full flex-col rounded-lg border-4 border-dashed p-10 text-center">
                {files && files.length > 0 && (
                  <div className="block text-left">
                    {Array.from(files || []).map(file => (
                      <p>{file.name}</p>
                    ))}
                  </div>
                )}
                {(!files || !files.length) && (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center  ">
                    <div className="mx-auto mt-0 flex max-h-48 w-2/5 flex-auto">
                      <img
                        className="h-32 object-center"
                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                        alt="freepik image"
                      />
                    </div>
                    <p className="text-gray-500 ">
                      <span className="text-sm">Drag and drop</span> files here <br /> or{' '}
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }}
                        id=""
                        className="text-blue-600 hover:underline"
                      >
                        select a file
                      </a>{' '}
                      from your device
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  capture
                  required
                  type="file"
                  name="receipt"
                  onChange={e => setFiles(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <p className="pt-1 text-sm text-gray-500">
            <span>File type: jpg</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileUploadComponent;
