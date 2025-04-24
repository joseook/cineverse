import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Mock user data - in a real app, this would come from authentication service
  const userData = {
    name: 'Cinema Lover',
    email: 'cinema.lover@example.com',
    profileImage: 'https://ui-avatars.com/api/?name=Cinema+Lover&background=E9A6A6&color=1F1D36&size=256',
    joinDate: 'June 2024',
    moviesWatched: 0,
    watchlistCount: 0
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the theme throughout the app
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would update notification settings
  };

  const clearWatchlistData = async () => {
    Alert.alert(
      "Clear Watchlist Data",
      "Are you sure you want to clear all your watchlist data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('watchlist');
              Alert.alert("Success", "Your watchlist has been cleared.");
            } catch (error) {
              console.error('Error clearing watchlist:', error);
              Alert.alert("Error", "Failed to clear watchlist data.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderStatItem = (label: string, value: number) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderSettingsItem = (
    icon: string,
    title: string,
    subtitle: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsIcon}>
        <Ionicons name={icon} size={22} color="#E9A6A6" />
      </View>
      <View style={styles.settingsText}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User info section */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: userData.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userJoinDate}>Member since {userData.joinDate}</Text>

        <View style={styles.statsContainer}>
          {renderStatItem('Movies Watched', userData.moviesWatched)}
          {renderStatItem('In Watchlist', userData.watchlistCount)}
        </View>
      </View>

      {/* Settings section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        {renderSettingsItem(
          'person-outline',
          'Edit Profile',
          'Update your profile information',
          <Ionicons name="chevron-forward" size={20} color="#A5A5A5" />,
          () => Alert.alert("Coming Soon", "This feature will be available in a future update.")
        )}

        {renderSettingsItem(
          'moon-outline',
          'Dark Mode',
          'Enable dark theme',
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#3F3B6C' }}
            thumbColor={darkMode ? '#E9A6A6' : '#f4f3f4'}
          />
        )}

        {renderSettingsItem(
          'notifications-outline',
          'Notifications',
          'Enable push notifications',
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#3F3B6C' }}
            thumbColor={notifications ? '#E9A6A6' : '#f4f3f4'}
          />
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>

        {renderSettingsItem(
          'trash-outline',
          'Clear Watchlist',
          'Remove all movies from your watchlist',
          <Ionicons name="chevron-forward" size={20} color="#A5A5A5" />,
          clearWatchlistData
        )}

        {renderSettingsItem(
          'shield-outline',
          'Privacy Policy',
          'Read our privacy policy',
          <Ionicons name="chevron-forward" size={20} color="#A5A5A5" />,
          () => Alert.alert("Coming Soon", "This feature will be available in a future update.")
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>About</Text>

        {renderSettingsItem(
          'information-circle-outline',
          'App Version',
          'CineVerse v1.0.0',
          null
        )}

        {renderSettingsItem(
          'heart-outline',
          'Rate the App',
          'Let us know what you think',
          <Ionicons name="chevron-forward" size={20} color="#A5A5A5" />,
          () => Alert.alert("Coming Soon", "This feature will be available in a future update.")
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => Alert.alert("Coming Soon", "Sign out functionality will be available in a future update.")}
      >
        <Ionicons name="log-out-outline" size={20} color="#1F1D36" />
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CineVerse © 2024</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1D36',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E9A6A6',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#E9A6A6',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A5A5A5',
    marginBottom: 8,
  },
  userJoinDate: {
    fontSize: 12,
    color: '#7E7E7E',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E9A6A6',
  },
  statLabel: {
    fontSize: 12,
    color: '#A5A5A5',
    marginTop: 4,
  },
  settingsSection: {
    paddingTop: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E9A6A6',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(63, 59, 108, 0.5)',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 166, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#A5A5A5',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9A6A6',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F1D36',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#7E7E7E',
  },
});

export default ProfileScreen; 