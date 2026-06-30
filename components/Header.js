import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const Header = ({ title, showBack = false, onBackPress, showCart = false, cartCount = 0, onCartPress, showImpact = false, onImpactPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {showImpact && (
          <TouchableOpacity onPress={onImpactPress} style={styles.iconButton}>
            <Ionicons name="stats-chart" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
            <Ionicons name="cart" size={24} color={colors.white} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 60 },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, position: 'relative' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.white, marginLeft: 8 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.secondary, borderRadius: 12, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
});

export default Header;
