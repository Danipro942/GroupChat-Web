import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import style from "./style.module.css";

type Props = {
  file: FileWithPreview[];
  setFile: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
};

type FileWithPreview = File & { preview: string };

const DragZone = ({ file, setFile }: Props) => {
  console.log(file);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files

    if (acceptedFiles.length) {
      setFile(() => [
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter(
        (newFile) =>
          !file.some(
            (existingFile: FileWithPreview) =>
              existingFile.name === newFile.name
          )
      );
      onDrop(newFiles);
    },
    accept: {
      "image/*": [],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
  });

  const removeFile = (name: string) => {
    setFile((files) => files.filter((file) => file.name !== name));
  };

  return (
    <>
      <div
        {...getRootProps({
          className: style.dropzone,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <></>}
      </div>
      <ul className={style.fileList}>
        {file.map((file, index) => (
          <li
            key={index}
            className={style.fileItem}
            onClick={() => removeFile(file.name)}
          >
            <img
              src={file.preview}
              alt=""
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default DragZone;
