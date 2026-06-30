import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
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

  // Reset loading state when screen comes into focus
  // Prevents infinite loading spinner when logging out rapidly on Android
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleRegister = () => {
    if (name && email && phone && password) {
      setLoading(true);
      register(name, email, phone, role);
      navigation.navigate('Home', { role });
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
            <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={colors.grayDark} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+60123456789" placeholderTextColor={colors.grayDark} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Create a password" placeholderTextColor={colors.grayDark} value={password} onChangeText={setPassword} secureTextEntry />
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
  roleContainer: { flexDirection: 'row', backgroundColor: colors.gray, borderRadius: 12, padding: 4, marginBottom: 24 },
  roleButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  roleButtonActive: { backgroundColor: colors.white, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleText: { fontSize: 14, color: colors.grayDark, fontWeight: '500' },
  roleTextActive: { color: colors.primary, fontWeight: '600' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.dark, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: colors.gray },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.grayDark },
  loginHighlight: { color: colors.primary, fontWeight: 'bold' },
});

export default RegisterScreen;
