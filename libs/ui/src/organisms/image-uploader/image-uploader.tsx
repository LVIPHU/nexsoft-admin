'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
  RotateCcwIcon,
  RotateCwIcon,
  Trash2Icon,
  UploadIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
} from 'lucide-react';
import { cn } from '@nexsoft-admin/utils';
import { Button } from '../../atoms/button/button';
import { Slider } from '../../atoms/slider/slider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../molecules/card/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../molecules/dialog/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../molecules/tooltip/tooltip';
import { getCroppedImg, getRotatedImage, readFile, blobUrlToBlob, type Flip } from './image-uploader.helper';
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

  /**
   * Initial value for the image uploader
   * Can be a URL string (from API), File object (from form state), or null
   */
  value?: string | File | null;

  /**
   * Output image format
   * @default 'jpeg'
   */
  imageFormat?: 'jpeg' | 'png' | 'webp';

  /**
   * Image quality (0-1) for JPEG and WebP formats
   * @default 0.92
   */
  imageQuality?: number;
}

export function ImageUploader({
  aspectRatio = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  onImageCropped,
  value,
  imageFormat = 'jpeg',
  imageQuality = 0.92,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [savedCropArea, setSavedCropArea] = useState<Area | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [flip, setFlip] = useState<Flip>({ horizontal: false, vertical: false });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const previousPreviewImageRef = useRef<string | null>(null);
  const previousImageRef = useRef<string | null>(null);

  /**
   * Memory cleanup: Revoke blob URLs to prevent memory leaks
   * Revokes previous blob URLs when image or previewImage changes
   */
  useEffect(() => {
    // Revoke previous previewImage blob URL if it was a blob URL
    if (previousPreviewImageRef.current && previousPreviewImageRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreviewImageRef.current);
    }
    previousPreviewImageRef.current = previewImage;

    // Revoke previous image blob URL if it was a blob URL
    if (previousImageRef.current && previousImageRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previousImageRef.current);
    }
    previousImageRef.current = image;
  }, [previewImage, image]);

  /**
   * Cleanup on unmount: Revoke all blob URLs
   */
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, []);

  /**
   * Load and display image from value prop
   * Handles both URL strings (from API) and File objects (from form state)
   *
   * Edge cases handled:
   * - value changes from URL → File (user uploads new image)
   * - value changes from File → URL (form resets to original data)
   * - value is null (clear image)
   * - Invalid URLs are validated before display
   */
  useEffect(() => {
    if (!value) {
      // Clear preview if value is null/undefined
      setPreviewImage(null);
      return;
    }

    if (typeof value === 'string') {
      // URL string - validate and display directly
      try {
        // Basic URL validation
        new URL(value);
        setPreviewImage(value);
      } catch {
        // Invalid URL, clear preview
        setPreviewImage(null);
      }
    } else if (value instanceof File) {
      // File object - convert to data URL and display
      readFile(value)
        .then((dataUrl) => {
          setPreviewImage(dataUrl);
          setError(null);
        })
        .catch((error) => {
          console.error('Failed to read file:', error);
          setError('Failed to load image file');
          setPreviewImage(null);
        });
    }
  }, [value]);

  /**
   * Handle file selection from input or drag & drop
   * Validates file type and size, then opens crop dialog
   */
  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setError(null);

      try {
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
        } catch (orientationError) {
          console.warn('Failed to detect image orientation:', orientationError);
          // Continue without auto-rotation if orientation detection fails
        }

        setImage(imageDataUrl);
        setIsCropDialogOpen(true);
      } catch (error) {
        console.error('Error processing file:', error);
        setError(error instanceof Error ? error.message : 'Failed to process image file');
      }
    },
    [acceptedFileTypes, maxSize],
  );

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const roundedCropArea = useMemo(() => {
    if (!croppedAreaPixels) return null;
    return {
      x: Math.round(croppedAreaPixels.x),
      y: Math.round(croppedAreaPixels.y),
      width: Math.round(croppedAreaPixels.width),
      height: Math.round(croppedAreaPixels.height),
    };
  }, [croppedAreaPixels]);

  const cropImage = useCallback(async () => {
    if (!image || !roundedCropArea) return;

    try {
      const croppedImageUrl = await getCroppedImg(image, roundedCropArea, rotation, flip, imageFormat, imageQuality);
      if (!croppedImageUrl) {
        setError('Failed to crop image');
        return;
      }

      setPreviewImage(croppedImageUrl);
      setSavedCropArea(roundedCropArea);
      setIsCropDialogOpen(false);

      if (onImageCropped) {
        const blob = await blobUrlToBlob(croppedImageUrl);
        onImageCropped(blob);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      setError(error instanceof Error ? error.message : 'Failed to crop image');
    }
  }, [image, roundedCropArea, rotation, flip, imageFormat, imageQuality, onImageCropped]);

  /**
   * Clear all image states (preview, crop state, etc.)
   */
  const clearImage = useCallback(() => {
    setPreviewImage(null);
    setImage(null);
    setCroppedAreaPixels(null);
    setSavedCropArea(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect],
  );

  /**
   * Handle Edit button click
   * Loads image from URL if needed, then opens crop dialog
   */
  const handleEditClick = useCallback(async () => {
    try {
      setError(null);
      // If previewImage is a URL string and image state is not set, load it for cropping
      if (previewImage && !image && typeof previewImage === 'string' && previewImage.startsWith('http')) {
        try {
          const response = await fetch(previewImage);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const blob = await response.blob();
          const dataUrl = await readFile(new File([blob], 'image.png', { type: blob.type }));
          setImage(dataUrl);
        } catch (error) {
          console.error('Failed to load image for editing:', error);
          setError(error instanceof Error ? error.message : 'Failed to load image for editing');
          return;
        }
      }
      setIsCropDialogOpen(true);
    } catch (error) {
      console.error('Error in handleEditClick:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  }, [previewImage, image]);

  /**
   * Handle dialog open/close state changes
   * Resets image state when dialog closes without applying (only for URL previews)
   */
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsCropDialogOpen(open);
      // Reset image state when dialog closes without applying
      // This ensures that if user clicks Edit again, it will reload from previewImage
      if (!open && previewImage && typeof previewImage === 'string' && previewImage.startsWith('http')) {
        setImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setFlip({ horizontal: false, vertical: false });
        setCroppedAreaPixels(null);
      }
    },
    [previewImage],
  );

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
                      <Button type='button' size='icon' variant='outline' onClick={clearImage}>
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
              <Button type='button' className='absolute right-4 bottom-4' onClick={handleEditClick}>
                Edit
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-between'>
          <p className='text-muted-foreground text-xs'>Upload an image to preview and crop</p>
        </CardFooter>
      </Card>

      <Dialog open={isCropDialogOpen} onOpenChange={handleDialogOpenChange}>
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
                  onCropAreaChange={onCropAreaChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  initialCroppedAreaPixels={savedCropArea || undefined}
                  transform={[
                    `translate(${crop.x}px, ${crop.y}px)`,
                    `rotateZ(${rotation}deg)`,
                    `rotateY(${flip.horizontal ? 180 : 0}deg)`,
                    `rotateX(${flip.vertical ? 180 : 0}deg)`,
                    `scale(${zoom})`,
                  ].join(' ')}
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
              <div className='flex items-center gap-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type='button'
                        variant={flip.horizontal ? 'default' : 'outline'}
                        size='icon'
                        onClick={() => setFlip((prev) => ({ ...prev, horizontal: !prev.horizontal }))}
                      >
                        <FlipHorizontalIcon className='size-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Flip Horizontal</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type='button'
                        variant={flip.vertical ? 'default' : 'outline'}
                        size='icon'
                        onClick={() => setFlip((prev) => ({ ...prev, vertical: !prev.vertical }))}
                      >
                        <FlipVerticalIcon className='size-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Flip Vertical</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setIsCropDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type='button' onClick={cropImage}>
                  Apply
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
