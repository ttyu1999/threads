import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function ImageUploadPreview({ onUpload, onUploadImage }) {
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      setFile(
        Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        })
      );

      const reader = new FileReader();
      reader.onload = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      onUploadImage();
    },
  });

  useEffect(() => {
    // 確保釋放數據 URI 以避免內存洩漏，這會在組件卸載時運行
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <section className="container">
      <div
        {...getRootProps({
          className: `cursor-pointer rounded-md ${
            !file ? "border-2 border-dashed p-20" : null
          }`,
        })}
      >
        <input {...getInputProps()} />
        <p className="text-center">拖曳檔案至此，或點擊選擇檔案</p>
        {file && (
          <aside className="flex justify-center">
            <div className="w-auto rounded-md border-2 border-[var(--surface-d)] my-2 p-2 w-3/4 bg-[var(--primary-color-text)] flex justify-center">
              <img
                src={file.preview}
                className="object-contain"
                style={{
                  height: `${(window.innerHeight * 0.4).toFixed(0)}px`
                }}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
                alt="預覽"
              />
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

export default ImageUploadPreview;
