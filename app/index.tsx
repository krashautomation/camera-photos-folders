import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  StatusBar,
  RefreshControl,
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';
import ProjectCard from '../src/components/ProjectCard';
import Header from '../src/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../src/types';
import { mockProjects } from '../src/data/mockData';

const { width } = Dimensions.get('window');

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const storedProjectsString = await AsyncStorage.getItem('projects');
      let loadedProjects: Project[];

      if (storedProjectsString) {
        loadedProjects = JSON.parse(storedProjectsString);
      } else {
        // If no projects in AsyncStorage, initialize with mock data
        await AsyncStorage.setItem('projects', JSON.stringify(mockProjects));
        loadedProjects = mockProjects;
      }
      
      setProjects(loadedProjects);
      console.log('Loaded projects from AsyncStorage:', loadedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  }, [loadProjects]);

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    router.push('/create-project');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Header 
        title="My Projects"
        rightAction={{
          icon: 'add',
          onPress: handleCreateProject
        }}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Organize your photos into beautiful projects
          </Text>
        </View>

        <View style={styles.projectsGrid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => handleProjectPress(project.id)}
            />
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
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 100,
  },
});