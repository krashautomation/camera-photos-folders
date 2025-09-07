import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Mountain Adventures',
    description: 'Epic landscape photography from my hiking trips',
    coverPhoto: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263785557_3ee77607.webp',
    photos: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Portrait Sessions',
    description: 'Professional headshots and portrait work',
    coverPhoto: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263799315_c463532f.webp',
    photos: [],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Urban Exploration',
    description: 'Street photography and cityscapes',
    coverPhoto: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263787539_f4ef2dc3.webp',
    photos: [],
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Nature Close-ups',
    description: 'Macro photography of flora and fauna',
    coverPhoto: 'https://d64gsuwffb70l.cloudfront.net/68bdb77b8d186b69d02ae8b2_1757263789452_44749b23.webp',
    photos: [],
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
    color: '#96CEB4'
  }
];