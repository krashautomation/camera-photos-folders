import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PhotoViewerScreen() {
  const params = useLocalSearchParams();
  let uri = Array.isArray(params.uri) ? params.uri[0] : params.uri; // Handle potential array of URIs

  // On Android, ensure local file URIs have the 'file://' prefix
  if (Platform.OS === 'android' && uri && !uri.startsWith('file://') && !uri.startsWith('http')) {
    uri = `file://${uri}`;
  }

  console.log('PhotoViewerScreen received (processed) URI:', uri);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      {uri && typeof uri === 'string' && uri.length > 0 ? (
        <Image 
          source={{ uri }} 
          style={styles.fullScreenImage} 
          resizeMode="contain" 
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          onLoad={() => console.log('Image loaded successfully for URI:', uri)}
          onLoadStart={() => console.log('Image loading started for URI:', uri)}
          onLoadEnd={() => console.log('Image loading ended for URI:', uri)}
        />
      ) : (
        <Text style={styles.errorText}>Image not found or invalid URI</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
    // backgroundColor: 'gray', // Removed temporary gray background
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
});
