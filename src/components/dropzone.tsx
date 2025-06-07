
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropzoneProps {
  value: File[];
  onChange: (files: File[]) => void;
  onImageChange?: (url: string | null) => void;
  imageUrl?: string | null;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
}

export function Dropzone({
  value,
  onChange,
  onImageChange,
  imageUrl,
  multiple = false,
  accept = 'image/*',
  maxSize = 5242880, // 5MB
}: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = multiple ? [...value, ...acceptedFiles] : acceptedFiles;
    onChange(newFiles);
    
    if (acceptedFiles.length > 0 && onImageChange) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [value, onChange, onImageChange, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    
    if (newFiles.length === 0 && onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isDragActive
            ? 'اسحب الملفات هنا...'
            : 'اسحب الملفات هنا أو انقر للاختيار'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          الحد الأقصى: {Math.floor(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => {
              onChange([]);
              onImageChange?.(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {value.length > 0 && !imageUrl && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
