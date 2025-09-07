import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Dimensions,
  Alert 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../src/components/Header';
import FloatingActionButton from '../../src/components/FloatingActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../../src/types';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const storedProjectsString = await AsyncStorage.getItem('projects');
        const storedProjects: Project[] = storedProjectsString ? JSON.parse(storedProjectsString) : [];
        const foundProject = storedProjects.find(p => p.id === id);
        setProject(foundProject);
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };
    loadProject();
  }, [id]);

  if (!project) {
    return (
      <View style={styles.container}>
        <Header title="Project Not Found" showBack onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Project not found</Text>
        </View>
      </View>
    );
  }

  const handleBack = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedPhotos([]);
    } else {
      router.back();
    }
  };

  const handleAddPhotos = () => {
    if (project) {
      router.push(`/camera?projectId=${project.id}`);
    } else {
      Alert.alert('Error', 'Cannot add photos: Project not loaded.');
    }
  };

  const handleLongPressPhoto = (photoId: string) => {
    setSelectionMode(true);
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleToggleSelectPhoto = (photoId: string, photoUri: string) => {
    if (selectionMode) {
      setSelectedPhotos(prev => 
        prev.includes(photoId) 
          ? prev.filter(id => id !== photoId)
          : [...prev, photoId]
      );
    } else {
      // Navigate to full screen photo view
      router.push(`/photo-viewer?uri=${encodeURIComponent(photoUri)}`);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPhotos.length === 0) return;
    
    Alert.alert(
      'Delete Photos',
      `Are you sure you want to delete ${selectedPhotos.length} photo(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          if (!project) return; // Should not happen if rendering, but for type safety

          console.log('Attempting to delete photos with IDs:', selectedPhotos);

          try {
            const existingProjectsString = await AsyncStorage.getItem('projects');
            let existingProjects: Project[] = existingProjectsString ? JSON.parse(existingProjectsString) : [];

            const updatedProjects = existingProjects.map(p => {
              if (p.id === project.id) {
                // Filter out the selected photos
                const remainingPhotos = p.photos.filter(
                  photo => !selectedPhotos.includes(photo.id)
                );
                return { ...p, photos: remainingPhotos };
              }
              return p;
            });

            await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));

            // Update the local state to trigger re-render
            setProject(prevProject => {
              if (prevProject) {
                const remainingPhotos = prevProject.photos.filter(
                  photo => !selectedPhotos.includes(photo.id)
                );
                return { ...prevProject, photos: remainingPhotos };
              }
              return prevProject;
            });

            setSelectedPhotos([]);
            setSelectionMode(false);
            Alert.alert('Success', 'Photos deleted successfully');
          } catch (error) {
            console.error('Failed to delete photos:', error);
            Alert.alert('Error', 'Failed to delete photos. Please try again.');
          }
        }}
      ]
    );
  };

  const placeholderPhotos = [
    { id: 'placeholder1', uri: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263785557_3ee77607.webp' },
    { id: 'placeholder2', uri: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263787539_f4ef2dc3.webp' },
    { id: 'placeholder3', uri: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263789452_44749b23.webp' },
    { id: 'placeholder4', uri: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263791713_d91485f5.webp' },
  ];

  const displayPhotos = project.photos.length > 0 ? project.photos : placeholderPhotos;

  return (
    <View style={styles.container}>
      <Header 
        title={selectionMode ? `${selectedPhotos.length} Selected` : project.name}
        showBack
        onBackPress={handleBack}
        rightAction={selectionMode && selectedPhotos.length > 0 ? {
          icon: 'trash',
          onPress: handleDeleteSelected
        } : undefined}
      />

      <ScrollView style={styles.content}>
        <View style={styles.projectInfo}>
          <View style={[styles.colorBar, { backgroundColor: project.color }]} />
          <Text style={styles.description}>{project.description}</Text>
          <Text style={styles.photoCount}>{displayPhotos.length} photos</Text>
        </View>

        <View style={styles.photosGrid}>
          {displayPhotos.map((photo, index) => (
            <TouchableOpacity
              key={photo.id} // Use photo.id as key
              style={[
                styles.photoItem,
                selectedPhotos.includes(photo.id) && styles.selectedPhoto
              ]}
              onPress={() => handleToggleSelectPhoto(photo.id, photo.uri)} // Pass photo.id and photo.uri
              onLongPress={() => handleLongPressPhoto(photo.id)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              {selectedPhotos.includes(photo.id) && (
                <View style={styles.selectedOverlay}>
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <FloatingActionButton 
        onPress={handleAddPhotos}
        icon="camera"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  projectInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  colorBar: {
    height: 4,
    marginBottom: 12,
    borderRadius: 2,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  photoCount: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  photoItem: {
    position: 'relative',
  },
  photo: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
  },
  selectedPhoto: {
    opacity: 0.8,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  bottomPadding: {
    height: 100,
  },
});