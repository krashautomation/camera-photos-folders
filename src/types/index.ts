export interface Photo {
  id: string;
  uri: string;
  name: string;
  timestamp: number;
  size: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  photos: Photo[];
  createdAt: number;
  updatedAt: number;
  color: string;
}

export interface CameraSettings {
  flashMode: 'on' | 'off' | 'auto';
  cameraType: 'front' | 'back';
  quality: number;
}