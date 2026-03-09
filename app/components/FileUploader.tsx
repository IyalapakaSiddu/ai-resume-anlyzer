import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: any[]) => {
            setError(null);

            if (fileRejections.length > 0) {
                setError("Only PDF files under 20MB are allowed.");
                return;
            }

            const selectedFile = acceptedFiles[0];
            if (!selectedFile) return;

            if (selectedFile.size > MAX_SIZE) {
                setError("File exceeds 20MB limit.");
                return;
            }

            setFile(selectedFile);
            if (onFileSelect) onFileSelect(selectedFile);
        },
        [onFileSelect]
    );

    const removeFile = () => {
        setFile(null);
        setError(null);
        if (onFileSelect) onFileSelect(null);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        multiple: false,
        maxSize: MAX_SIZE,
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
            >
                <input {...getInputProps()} />

                {!file ? (
                    <>
                        <div className="flex justify-center mb-2">
                            <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                        </div>
                        <p className="text-lg text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            PDF only (max 20 MB)
                        </p>
                    </>
                ) : (
                    <div className="space-y-2">
                        <p className="font-medium text-gray-700 truncate max-w-xs mx-auto">
                            {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatSize(file.size)}
                        </p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="mt-2 text-sm text-red-500 hover:underline"
                        >
                            Remove File
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};

export default FileUploader;