// src/components/ImageCropper.tsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import styled from 'styled-components';

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
`;

const CropButton = styled.button`
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.textLight};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 1rem;
`;

interface ImageCropperProps {
  imageFile: File;
  onCrop: (croppedImage: Blob) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onCrop }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          URL.createObjectURL(imageFile),
          croppedAreaPixels
        );
        onCrop(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageFile, croppedAreaPixels, onCrop]);

  return (
    <>
      <CropperContainer>
        <Cropper
          image={URL.createObjectURL(imageFile)}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </CropperContainer>
      <CropButton onClick={showCroppedImage}>Crop Image</CropButton>
    </>
  );
};

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
    }, 'image/jpeg');
  });
};