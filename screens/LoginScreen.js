import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  
  // Error states for validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Reset loading state when screen comes into focus
  // Prevents infinite loading spinner when logging out rapidly on Android
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(false);
      // Clear error messages when screen refocuses
      setEmailError('');
      setPasswordError('');
    });
    return unsubscribe;
  }, [navigation]);

  // Validate email format using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password length
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = () => {
    // Clear previous errors before validation
    setEmailError('');
    setPasswordError('');

    // 1. Validate email format
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // 2. Validate password length
    if (!password || !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    // 3. Vendor requires store name
    if (role === 'vendor' && !name) {
      Alert.alert('Missing Info', 'Please enter your store name.');
      return;
    }

    // 4. All validations passed - proceed with login
    setLoading(true);
    // Pass the name to login - for customers, use email prefix as display name
    const displayName = role === 'vendor' ? name : email.split('@')[0];
    login(email, role, role === 'vendor' ? name : displayName);
    
    // Navigate to appropriate app based on role
    if (role === 'vendor') {
      navigation.navigate('VendorApp', { role });
    } else {
      navigation.navigate('MainApp', { role });
    }
  };

  // Clear email error when user starts typing
  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  // Clear password error when user starts typing
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>🍽️</Text></View>
          <Text style={styles.appName}>FoodWise</Text>
          <Text style={styles.tagline}>Save Food. Save the Planet.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleContainer}>
            <TouchableOpacity style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]} onPress={() => setRole('customer')}>
              <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>👤 Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleButton, role === 'vendor' && styles.roleButtonActive]} onPress={() => setRole('vendor')}>
              <Text style={[styles.roleText, role === 'vendor' && styles.roleTextActive]}>🏪 Vendor</Text>
            </TouchableOpacity>
          </View>

          {role === 'vendor' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Store Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kedai Kopi JB"
                placeholderTextColor={colors.grayDark}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={[styles.input, emailError && styles.inputError]} 
              placeholder="Enter your email" 
              placeholderTextColor={colors.grayDark} 
              value={email} 
              onChangeText={handleEmailChange} 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={[styles.input, passwordError && styles.inputError]} 
              placeholder="Enter your password" 
              placeholderTextColor={colors.grayDark} 
              value={password} 
              onChangeText={handlePasswordChange} 
              secureTextEntry 
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>
          
          <Button title="Login" onPress={handleLogin} loading={loading} />

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerHighlight}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { fontSize: 48 },
  appName: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  tagline: { fontSize: 16, color: colors.grayDark },
  form: { width: '100%' },
  roleContainer: { flexDirection: 'row', backgroundColor: colors.grayLight, borderRadius: 12, padding: 4, marginBottom: 24 },
  roleButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  roleButtonActive: { backgroundColor: colors.white, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleText: { fontSize: 14, color: colors.grayDark, fontWeight: '500' },
  roleTextActive: { color: colors.primary, fontWeight: '600' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.dark, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: colors.white },
  inputError: { borderColor: colors.danger, borderWidth: 1.5 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4 },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 14, color: colors.grayDark },
  registerHighlight: { color: colors.secondary, fontWeight: 'bold' },
});

export default LoginScreen;
