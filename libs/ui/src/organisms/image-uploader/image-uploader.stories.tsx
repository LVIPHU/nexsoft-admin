import type { Meta, StoryObj } from '@storybook/react';
import { ImageUploader } from './image-uploader';
import { toast } from 'sonner';

const meta: Meta<typeof ImageUploader> = {
  title: 'Organisms/ImageUploader',
  component: ImageUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    aspectRatio: {
      control: 'number',
      description: 'The aspect ratio of the cropped image (width / height)',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    acceptedFileTypes: {
      control: 'object',
      description: 'Allowed file types',
    },
    className: {
      control: 'text',
      description: 'CSS class name for the container',
    },
    onImageCropped: {
      action: 'image-cropped',
      description: 'Callback function that returns the cropped image as a blob',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aspectRatio: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const Square: Story = {
  args: {
    aspectRatio: 1,
    maxSize: 5 * 1024 * 1024,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const Wide: Story = {
  args: {
    aspectRatio: 16 / 9,
    maxSize: 5 * 1024 * 1024,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const Portrait: Story = {
  args: {
    aspectRatio: 3 / 4,
    maxSize: 5 * 1024 * 1024,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const LargeFileSize: Story = {
  args: {
    aspectRatio: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const WithCallback: Story = {
  args: {
    aspectRatio: 1,
    maxSize: 5 * 1024 * 1024,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    onImageCropped: (blob) => {
      console.log('Image cropped:', blob);
      toast.success(`Image cropped! Size: ${(blob.size / 1024).toFixed(2)} KB`);
    },
  },
};
