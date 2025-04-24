import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';

type GenresScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Genres'>;

interface GenreItem {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  color: string[];
  movieCount: string;
  icon: string;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32;

const GENRES: GenreItem[] = [
  {
    id: 'action',
    title: 'Action',
    description: 'Exciting films with thrilling sequences, explosions, and heroic characters',
    backgroundImage: 'https://image.tmdb.org/t/p/w500/2X5nnvkWvYRFmgpkK08uV9Ogl3y.jpg',
    color: ['#FF416C', '#FF4B2B'],
    movieCount: '3,245',
    icon: 'flame'
  },
  {
    id: 'comedy',
    title: 'Comedy',
    description: 'Films designed to make the audience laugh through humor and entertainment',
    backgroundImage: 'https://image.tmdb.org/t/p/w500/gD6wO8r5QH1EcQwUBkt6YQJwUtH.jpg',
    color: ['#4E65FF', '#92EFFD'],
    movieCount: '4,129',
    icon: 'happy'
  },
  {
    id: 'horror',
    title: 'Horror',
    description: 'Scary movies that aim to frighten and panic viewers with tension and suspense',
    backgroundImage: 'https://image.tmdb.org/t/p/w500/3GW0A72MxsSgXmu5qYUNIaKjmIp.jpg',
    color: ['#000000', '#434343'],
    movieCount: '2,871',
    icon: 'skull'
  },
  {
    id: 'drama',
    title: 'Drama',
    description: 'Character-driven plots focusing on realistic emotional themes',
    backgroundImage: 'https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg',
    color: ['#654ea3', '#eaafc8'],
    movieCount: '5,342',
    icon: 'heart'
  },
  {
    id: 'scifi',
    title: 'Sci-Fi',
    description: 'Imaginative and futuristic concepts such as advanced science and technology',
    backgroundImage: 'https://image.tmdb.org/t/p/w500/i8dshLvq4LE3s0v8PrkDdUyb1ae.jpg',
    color: ['#43cea2', '#185a9d'],
    movieCount: '1,987',
    icon: 'planet'
  }
];

const GenresScreen = () => {
  const navigation = useNavigation<GenresScreenNavigationProp>();

  const handleGenrePress = (genreId: string) => {
    navigation.navigate('Genre', { genreId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Genres</Text>
        <View style={styles.rightButton} />
      </View>

      <Text style={styles.subtitle}>Explore films by category</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={styles.genreCard}
            onPress={() => handleGenrePress(genre.id)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: genre.backgroundImage }}
              style={styles.backgroundImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <LinearGradient
                colors={[...genre.color, 'rgba(31, 29, 54, 0.95)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={genre.icon as any} size={28} color="#fff" />
                </View>

                <View style={styles.genreContent}>
                  <Text style={styles.genreTitle}>{genre.title}</Text>
                  <Text style={styles.genreDescription} numberOfLines={2}>
                    {genre.description}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name="film-outline" size={16} color="#E9A6A6" />
                      <Text style={styles.statText}>{genre.movieCount} movies</Text>
                    </View>

                    <View style={styles.exploreBadge}>
                      <Text style={styles.exploreText}>Explore</Text>
                      <Ionicons name="chevron-forward" size={12} color="#fff" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1D36',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  rightButton: {
    width: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#9795B5',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  genreCard: {
    width: ITEM_WIDTH,
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  genreContent: {
    flex: 1,
  },
  genreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  genreDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#E9A6A6',
    marginLeft: 6,
  },
  exploreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  exploreText: {
    fontSize: 12,
    color: '#fff',
    marginRight: 4,
  },
});

export default GenresScreen; 