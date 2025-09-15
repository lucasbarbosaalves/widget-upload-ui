import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import CircularProgressBar from '../ui/circular-progress-bar';

export function UploadWidgetDropzone() {
  const isAnyPendingUpload = true;
  const uploadGlobalPercentage = 66;

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop(acceptedFiles) {},
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="px-3 flex flex-col gap-3"
    >
      <div
        data-active={isDragActive}
        className="cursor-pointer text-zinc-400 bg-black/20 p-5 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col justify-center items-center gap-1 hover:border-zinc-400 transition-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-300"
        {...getRootProps()}
      >
        <input type="file" {...getInputProps()} />
        {isAnyPendingUpload ? (
          <div className="flex flex-col gap-2.5 items-center">
            <CircularProgressBar progress={uploadGlobalPercentage} size={56} strokeWidth={4} />
            <span className="text-xs">Uploading 2 files...</span>
          </div>
        ) : (
          <>
            <span className="text-xs">Drop your files hre or</span>
            <span className="text-xs underline">click to open picker</span>
          </>
        )}
      </div>

      <span className="text-xxs  text-zinc-400">Only PNG and JPG files are supported.</span>
    </motion.div>
  );
}
