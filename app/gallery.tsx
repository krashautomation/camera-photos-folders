import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../src/components/Header';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

export default function GalleryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleBack = () => {
    router.back();
  };

  // Mock gallery photos
  const galleryPhotos = [
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263785557_3ee77607.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263787539_f4ef2dc3.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263789452_44749b23.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263791713_d91485f5.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263793831_910da22f.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263795571_11a1ea75.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263799315_c463532f.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263801423_344b8022.webp',
    'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263803118_4d1f04bd.webp',
  ];

  const filters = [
    { key: 'all', label: 'All Photos' },
    { key: 'recent', label: 'Recent' },
    { key: 'favorites', label: 'Favorites' },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Photo Gallery"
        showBack
        onBackPress={handleBack}
        rightAction={{
          icon: 'search',
          onPress: () => {}
        }}
      />

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search photos..."
            placeholderTextColor="#999"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilter
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.photosGrid}>
          {galleryPhotos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoItem}
              onPress={() => {}}
            >
              <Image source={{ uri: photo }} style={styles.photo} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  photoItem: {
    marginBottom: 8,
  },
  photo: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 20,
  },
});