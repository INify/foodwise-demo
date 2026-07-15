import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { useImpact } from '../context/ImpactContext';
import { useAuth } from '../context/AuthContext';

const ImpactScreen = () => {
  const insets = useSafeAreaInsets();
  const impact = useImpact();
  const { user } = useAuth();

  // Use weekly data for main display
  const data = impact.weekly;
  const mealsSaved = data?.mealsSaved || 0;
  const co2Saved = data?.co2Saved || 0;

  // Calculate badge progress
  const getBadgeInfo = () => {
  if (mealsSaved < 10) {
    return { level: '🌱 Beginner', next: 10, progress: (mealsSaved / 10) * 100, badge: 'First Rescue' };
  } else if (mealsSaved < 25) {
    return { level: '🌿 Green Warrior', next: 25, progress: (mealsSaved / 25) * 100, badge: 'Green Warrior' };
  } else if (mealsSaved < 50) {
    return { level: '⭐ Community Star', next: 50, progress: (mealsSaved / 50) * 100, badge: 'Community Star' };
  } else if (mealsSaved < 100) {
    return { level: '♻️ Eco Champion', next: 100, progress: (mealsSaved / 100) * 100, badge: 'Eco Champion' };
  } else {
    return { level: '🏆 Zero Waste Hero', next: null, progress: 100, badge: 'Zero Waste Hero' };
  }
};

  const badgeInfo = getBadgeInfo();

  // Badge collection
  const badges = [
    { id: 1, name: 'First Rescue', icon: '🌱', earned: mealsSaved >= 1 },
    { id: 2, name: 'Green Warrior', icon: '🌿', earned: mealsSaved >= 10 },
    { id: 3, name: 'Community Star', icon: '⭐', earned: mealsSaved >= 25 },
    { id: 4, name: 'Eco Champion', icon: '♻️', earned: mealsSaved >= 50 },
    { id: 5, name: 'Zero Waste Hero', icon: '🏆', earned: mealsSaved >= 100 },
  ];

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Impact</Text>
        <Text style={styles.subtitle}>You're making a real difference 🏆</Text>
      </View>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelCardContent}>
          <Text style={styles.levelLabel}>YOUR LEVEL</Text>
          <Text style={styles.levelName}>{badgeInfo.level}</Text>
          <View style={styles.levelStats}>
            <View style={styles.levelStat}>
              <Text style={styles.levelStatNumber}>{mealsSaved}</Text>
              <Text style={styles.levelStatLabel}>MEALS RESCUED</Text>
            </View>
            <View style={styles.levelDivider} />
            <View style={styles.levelStat}>
              <Text style={styles.levelStatNumber}>{co2Saved}kg</Text>
              <Text style={styles.levelStatLabel}>CO₂ SAVED</Text>
            </View>
            <View style={styles.levelDivider} />
            <View style={styles.levelStat}>
              <Text style={styles.levelStatNumber}>RM {(mealsSaved * 1.67).toFixed(2)}</Text>
              <Text style={styles.levelStatLabel}>RM SAVED</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {badgeInfo.next === null ? '🏆 Maximum Level!' : `Progress to ${badgeInfo.badge}`}
              </Text>
              <Text style={styles.progressValue}>
                {badgeInfo.next === null ? 'MAX' : `${mealsSaved}/${badgeInfo.next}`}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(badgeInfo.progress, 100)}%` }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Meals Rescued This Week - Graph placeholder */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Meals Rescued This Week</Text>
        <View style={styles.graphPlaceholder}>
          <View style={styles.graphBars}>
            {[5, 8, 3, 12, 9, 7, 3].map((height, index) => (
              <View key={index} style={styles.graphBarContainer}>
                <View style={[styles.graphBar, { height: height * 6 + 10 }]} />
                <Text style={styles.graphBarLabel}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Badge Collection */}
      <View style={styles.badgeSection}>
        <Text style={styles.badgeTitle}>Badge Collection</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
              <Text style={styles.badgeIcon}>{badge.earned ? badge.icon : '🔒'}</Text>
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              {badge.earned && (
                <View style={styles.badgeEarnedTag}>
                  <Text style={styles.badgeEarnedText}>✅</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* MySaveFood Government Initiative */}
      <View style={styles.govBanner}>
        <Text style={styles.govLabel}>Government Initiative</Text>
        <Text style={styles.govTitle}>MySaveFood Programme</Text>
        <Text style={styles.govDesc}>
          This app supports Malaysia's national food waste reduction targets
          and the NKRA sustainability agenda.
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grayDark,
    marginTop: 2,
  },

  // Level Card
  levelCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  levelCardContent: {
    padding: 20,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 2,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 16,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  levelStat: {
    alignItems: 'center',
  },
  levelStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  levelStatLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  levelDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },

  // Graph Card
  graphCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(45,106,79,0.08)',
  },
  graphTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  graphPlaceholder: {
    height: 120,
    justifyContent: 'flex-end',
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  graphBarContainer: {
    alignItems: 'center',
  },
  graphBar: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 4,
    minHeight: 10,
  },
  graphBarLabel: {
    fontSize: 10,
    color: colors.grayDark,
    marginTop: 6,
  },

  // Badge Collection
  badgeSection: {
    marginBottom: 16,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: 'rgba(45,106,79,0.08)',
  },
  badgeItemLocked: {
    opacity: 0.5,
    backgroundColor: colors.grayLight,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.grayDark,
  },
  badgeEarnedTag: {
    marginTop: 2,
  },
  badgeEarnedText: {
    fontSize: 10,
  },

  // Government Banner
  govBanner: {
    backgroundColor: '#EBF5EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,106,79,0.12)',
  },
  govLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  govTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  govDesc: {
    fontSize: 12,
    color: colors.grayDark,
    marginTop: 4,
    lineHeight: 18,
  },
});

export default ImpactScreen;
