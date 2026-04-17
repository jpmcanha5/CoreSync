import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useAppStore } from '../src/store/useAppStore';
import { COLORS } from '../src/styles/Colors';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const loginAction = useAppStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "789356489098-179ficnl1l7763cb5p5t6o41i571bs8c.apps.googleusercontent.com",
    iosClientId: "789356489098-378p1raofoe2e27ehgd9btrgui9hg057.apps.googleusercontent.com",
    androidClientId: "789356489098-nitro6nnq33vqt7evcdnra3vdkmbvp2k.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google login successful:', response);
      handleLoginSucessoGoogle();
    } else if (response?.type === 'error') {
      console.error('Google OAuth Error:', {
        error: response.error,
        errorCode: response.errorCode,
        params: response.params,
      });
      setErrorMessage(`Erro ao conectar com Google. Verifique as credenciais e tente novamente.`);
      setShowError(true);
    }
  }, [response]);

  const handleLoginSucessoGoogle = () => {
    loginAction("João Pedro");
    router.replace('/(tabs)');
  };

  const handleLoginNativo = () => {
    setShowError(false);
    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Preencha os campos obrigatórios.');
      setShowError(true);
      return;
    }
    loginAction(email.split('@')[0]);
    router.replace('/(tabs)');
  };

  // Animação da Logo
  const logoScale = useSharedValue(1);
  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1, true
    );
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[styles.header, useAnimatedStyle(() => ({ transform: [{ scale: logoScale.value }] }))]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Inteligência Artificial para o seu Treino</Text>
      </Animated.View>

      <View style={styles.formContainer}>
        <TouchableOpacity 
          style={styles.googleBtn} 
          disabled={!request} 
          onPress={() => promptAsync()}
        >
          <MaterialCommunityIcons name="google" size={24} color={COLORS.background} />
          <Text style={styles.googleBtnText}>Continuar com o Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} /><Text style={styles.dividerText}>ou</Text><View style={styles.dividerLine} />
        </View>

        {showError && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            placeholderTextColor={COLORS.textLight}
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor={COLORS.textLight}
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLoginNativo}>
          <Text style={styles.loginBtnText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 300, height: 100 },
  subtitle: { color: COLORS.textLight, fontSize: 14 },
  formContainer: { width: '100%' },
  googleBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 20 },
  googleBtnText: { fontWeight: 'bold', marginLeft: 10, color: COLORS.background },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textLight, paddingHorizontal: 10 },
  errorText: { color: COLORS.danger, textAlign: 'center', marginBottom: 10 },
  inputGroup: { backgroundColor: COLORS.card, borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.border },
  input: { color: '#fff', paddingVertical: 15 },
  loginBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  loginBtnText: { fontWeight: 'bold', color: COLORS.background }
});