import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../utils/types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GenresExplorerScreen from '../screens/GenresExplorerScreen';
import TVShowsScreen from '../screens/TVShowsScreen';
import ActorDetailsScreen from '../screens/ActorDetailsScreen';
import GenresScreen from '../screens/GenresScreen';
import GenreScreen from '../screens/GenreScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  MovieDetails: { movieId: string; movie?: Movie };
  Search: undefined;
  Watchlist: undefined;
  Profile: undefined;
  GenresExplorer: undefined;
  TVShows: undefined;
  ActorDetails: { actorId: string };
  Genres: undefined;
  Genre: { genreId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'TVShows') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E9A6A6',
        tabBarInactiveTintColor: '#A5A5A5',
        tabBarStyle: {
          backgroundColor: '#1F1D36',
          borderTopColor: '#3F3B6C',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="TVShows" component={TVShowsScreen} options={{ title: 'TV Shows' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F1D36',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#1F1D36',
          }
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="GenresExplorer"
          component={GenresExplorerScreen}
          options={{ title: 'Explore Genres' }}
        />
        <Stack.Screen
          name="ActorDetails"
          component={ActorDetailsScreen}
          options={{
            title: 'Actor Details',
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="Genres"
          component={GenresScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="Genre"
          component={GenreScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 