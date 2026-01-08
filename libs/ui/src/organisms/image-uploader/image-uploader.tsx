'use client';

import { useCallback, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { RotateCcwIcon, RotateCwIcon, Trash2Icon, UploadIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { cn } from '@nexsoft-admin/utils';
import { Button } from '../../atoms/button/button';
import { Slider } from '../../atoms/slider/slider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../molecules/card/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../molecules/dialog/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../molecules/tooltip/tooltip';
import { getCroppedImg, getRotatedImage, readFile } from './image-uploader.helper';
import { getOrientation } from 'get-orientation/browser';

const ORIENTATION_TO_ANGLE: Record<string, number> = {
  '3': 180,
  '6': 90,
  '8': -90,
};

export interface ImageUploaderProps {
  /**
   * The aspect ratio of the cropped image (width / height)
   * @default 1 (square)
   */
  aspectRatio?: number;

  /**
   * Maximum file size in bytes
   * @default 5242880 (5MB)
   */
  maxSize?: number;

  /**
   * Allowed file types
   * @default ['image/jpeg', 'image/png', 'image/webp']
   */
  acceptedFileTypes?: string[];

  /**
   * CSS class name for the container
   */
  className?: string;

  /**
   * Callback function that returns the cropped image as a blob or file
   */
  onImageCropped?: (blob: Blob) => void;
}

export function ImageUploader({
  aspectRatio = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  onImageCropped,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // We're not using a drop library like react-dropzone, so this is handled manually with DOM events

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`);
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    let imageDataUrl = await readFile(file);

    try {
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }
    } catch {
      console.warn('failed to detect the orientation');
    }

    setImage(imageDataUrl);
    setIsCropDialogOpen(true);
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cropImage = useCallback(async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      setPreviewImage(croppedImage);
      setIsCropDialogOpen(false);

      // Convert data URL to Blob and call callback
      if (onImageCropped && croppedImage) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        onImageCropped(blob);
      }
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels, rotation, onImageCropped]);

  const clearImage = () => {
    setPreviewImage(null);
    setImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div data-slot='image-uploader' className={cn('w-full', className)}>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Image Uploader
            <div>
              {previewImage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size='icon' variant='outline' onClick={clearImage}>
                        <Trash2Icon size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!previewImage ? (
            <div
              data-slot='image-uploader-dropzone'
              className='hover:bg-muted/20 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors'
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type='file'
                className='hidden'
                accept={acceptedFileTypes.join(',')}
                onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
              />
              <UploadIcon className='text-muted-foreground mx-auto size-12' />
              <p className='text-muted-foreground mt-2 text-sm'>Drag and drop an image here or click to browse</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {`Accepted formats: ${acceptedFileTypes.map((type) => type.replace('image/', '.')).join(', ')}`}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>{`Max size: ${maxSize / (1024 * 1024)}MB`}</p>
              {error && <p className='text-destructive mt-2 text-sm'>{error}</p>}
            </div>
          ) : (
            <div data-slot='image-uploader-preview' className='relative overflow-hidden rounded-lg'>
              <img
                src={previewImage}
                alt='Cropped preview'
                className='aspect-ratio-1/1 h-auto w-full rounded-lg object-cover'
                style={{ aspectRatio: aspectRatio }}
              />
              <Button className='absolute right-4 bottom-4' onClick={() => setIsCropDialogOpen(true)}>
                Edit
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-between'>
          <p className='text-muted-foreground text-xs'>Upload an image to preview and crop</p>
        </CardFooter>
      </Card>

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {image && (
            <>
              <div className='relative h-80 w-full'>
                <Cropper
                  crop={crop}
                  zoom={zoom}
                  image={image}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className='flex items-center gap-4'>
                <ZoomOutIcon className='size-4' />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby='Zoom'
                  onValueChange={(value) => setZoom(value[0])}
                />
                <ZoomInIcon className='size-4' />
              </div>
              <div className='flex items-center gap-4'>
                <RotateCcwIcon className='size-4' />
                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  aria-labelledby='Rotation'
                  onValueChange={(value) => setRotation(value[0])}
                />
                <RotateCwIcon className='size-4' />
              </div>
              <div className='flex justify-end gap-2'>
                <Button variant='outline' onClick={() => setIsCropDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={cropImage}>Apply</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
