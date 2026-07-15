import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const impact = useImpact();
  const data = impact.weekly;

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const getLevel = () => {
    const meals = data?.mealsSaved || 0;
    if (meals < 10) return '🌱 Beginner';
    if (meals < 25) return '🌿 Green Warrior';
    if (meals < 50) return '⭐ Community Star';
    if (meals < 100) return '♻️ Eco Champion';
    return '🏆 Zero Waste Hero';
  };

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'location-outline', label: 'Location', sub: 'Bangsar, Kuala Lumpur', onPress: () => {} },
    { icon: 'qr-code-outline', label: 'My QR Code', onPress: () => navigation.navigate('QRCode') },
    { icon: 'trophy-outline', label: 'All Badges', sub: `${data?.mealsSaved || 0} meals rescued`, onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{getLevel()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.mealsSaved || 0}</Text>
            <Text style={styles.statLabel}>Meals Rescued</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.co2Saved || 0}kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>RM {(data?.mealsSaved || 0 * 1.67).toFixed(2)}</Text>
            <Text style={styles.statLabel}>RM Saved</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={item.label} 
            style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
              <View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                {item.sub && <Text style={styles.menuItemSub}>{item.sub}</Text>}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.grayDark} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Government Banner */}
      <View style={styles.govBanner}>
        <Text style={styles.govLabel}>Government Initiative</Text>
        <Text style={styles.govTitle}>MySaveFood Programme</Text>
        <Text style={styles.govDesc}>
          Supporting Malaysia's national food waste reduction targets.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
    paddingHorizontal: 16,
  },

  header: {
    backgroundColor: colors.primary,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },

  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: -12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(45,106,79,0.08)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.grayDark,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.grayLight,
  },

  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(45,106,79,0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  menuItemSub: {
    fontSize: 11,
    color: colors.grayDark,
    marginTop: 1,
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.15)',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },

  govBanner: {
    backgroundColor: '#EBF5EE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  govLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  govTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 2,
  },
  govDesc: {
    fontSize: 11,
    color: colors.grayDark,
    marginTop: 2,
  },
});

export default ProfileScreen;
