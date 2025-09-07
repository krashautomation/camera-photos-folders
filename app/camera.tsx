import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions 
} from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../src/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Project, Photo } from '../src/types';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { projectId } = useLocalSearchParams();

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const takePicture = async () => {
    if (cameraRef.current && typeof projectId === 'string') {
      try {
        const photoResult = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        console.log('Camera captured temporary photo URI:', photoResult?.uri);

        if (photoResult && photoResult.uri) {
          // Create a directory for photos if it doesn't exist
          const photosDirectory = `${FileSystem.documentDirectory}photos/`;
          await FileSystem.makeDirectoryAsync(photosDirectory, { intermediates: true });

          // Generate a unique file name
          const fileName = `${Date.now()}.jpg`;
          const newPhotoUri = `${photosDirectory}${fileName}`;

          // Move the photo from cache to permanent storage
          await FileSystem.moveAsync({
            from: photoResult.uri,
            to: newPhotoUri,
          });
          console.log('Photo moved to persistent URI:', newPhotoUri);

          const newPhoto: Photo = {
            id: Date.now().toString(),
            uri: newPhotoUri,
            name: `Photo ${Date.now()}`,
            timestamp: Date.now(),
            size: 0,
          };

          const existingProjectsString = await AsyncStorage.getItem('projects');
          const existingProjects: Project[] = existingProjectsString ? JSON.parse(existingProjectsString) : [];
          
          const updatedProjects = existingProjects.map(project => {
            if (project.id === projectId) {
              return { ...project, photos: [...project.photos, newPhoto] };
            }
            return project;
          });

          await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));

          Alert.alert(
            'Photo Captured!',
            'Your photo has been added to the project.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          Alert.alert('Error', 'Failed to capture photo URI.');
        }
      } catch (error) {
        console.error('Failed to take picture and save:', error);
        Alert.alert('Error', 'Failed to take picture and save.');
      }
    } else if (typeof projectId !== 'string') {
      Alert.alert('Error', 'Project ID is missing.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on': return 'flash';
      case 'auto': return 'flash-outline';
      default: return 'flash-off';
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Camera"
        showBack
        onBackPress={handleBack}
      />

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
              <Ionicons name={getFlashIcon()} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity onPress={() => router.push('/gallery')} style={styles.galleryButton}>
              <Ionicons name="images" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
              <Ionicons name="camera-reverse" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});