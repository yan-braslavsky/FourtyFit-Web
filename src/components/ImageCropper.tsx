import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import styled from 'styled-components';

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
`;

interface ImageCropperProps {
  imageFile: File | string;
  onCrop: (croppedImage: Blob) => void;
  aspectRatio?: number;
}

export interface ImageCropperRef {
  cropImage: () => Promise<Blob>;
}

const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(({ imageFile, onCrop, aspectRatio = 1 }, ref) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof imageFile === 'string') {
      setImageUrl(imageFile);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cropImage = useCallback(async () => {
    if (croppedAreaPixels && imageUrl) {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCrop(croppedImage);
      return croppedImage;
    }
    throw new Error('No area to crop');
  }, [imageUrl, croppedAreaPixels, onCrop]);

  useImperativeHandle(ref, () => ({
    cropImage
  }));

  if (!imageUrl) {
    return null;
  }

  return (
    <CropperContainer>
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </CropperContainer>
  );
});

export default ImageCropper;

// Helper function to crop the image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
};