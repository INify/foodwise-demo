import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';

const Button = ({ title, onPress, variant = 'secondary', loading = false, disabled = false, style = {}, textStyle = {} }) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.grayDark;
    if (variant === 'secondary') return colors.secondary;
    if (variant === 'outline') return 'transparent';
    // Primary variant - keep as green for secondary buttons
    return colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return colors.white;
    if (variant === 'outline') return colors.primary;
    return colors.white;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor(), borderColor: getBorderColor(), borderWidth: variant === 'outline' ? 2 : 0 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: 50, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  text: { 
    fontSize: 16, 
    fontWeight: '600', 
    letterSpacing: 0.5 
  },
});

export default Button;
