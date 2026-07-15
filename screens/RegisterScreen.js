import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  const handleRegister = () => {
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

    // 3. Validate required fields
    if (!name) {
      Alert.alert('Missing Info', 'Please enter your full name.');
      return;
    }
    if (!phone) {
      Alert.alert('Missing Info', 'Please enter your phone number.');
      return;
    }

    // 4. All validations passed - proceed with registration
    setLoading(true);
    register(name, email, phone, role);
    
    // Navigate to appropriate app based on role
    if (role === 'vendor') {
      navigation.navigate('VendorApp', { role });
    } else {
      navigation.navigate('MainApp', { role });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the FoodWise community</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={colors.grayDark} value={name} onChangeText={setName} />
          </View>
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
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+60123456789" placeholderTextColor={colors.grayDark} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={[styles.input, passwordError && styles.inputError]} 
              placeholder="Create a password (min 8 chars)" 
              placeholderTextColor={colors.grayDark} 
              value={password} 
              onChangeText={handlePasswordChange} 
              secureTextEntry 
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          <Button title="Create Account" onPress={handleRegister} loading={loading} />

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginHighlight} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.grayDark },
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
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.grayDark },
  loginHighlight: { color: colors.secondary, fontWeight: 'bold' },
});

export default RegisterScreen;
