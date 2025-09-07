import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  // Get the first photo as thumbnail, or use coverPhoto as fallback
  const thumbnailUri = project.photos.length > 0 
    ? project.photos[0].uri 
    : project.coverPhoto;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.colorBar, { backgroundColor: project.color }]} />
      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} style={styles.image} />
      ) : (
        <View style={[styles.placeholderImage, { backgroundColor: project.color }]}>
          <Text style={styles.placeholderText}>No Photos</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
        <Text style={styles.photoCount}>
          {project.photos.length} photos
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  colorBar: {
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  photoCount: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
});