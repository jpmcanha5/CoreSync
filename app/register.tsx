import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { BounceButton } from '../src/components/BounceButton';
import { useAppStore } from '../src/store/useAppStore';
import { COLORS } from '../src/styles/Colors';

export default function Register() {
  const router = useRouter();
  const registrarUsuario = useAppStore((state) => state.registrarUsuario);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState(''); 
  const [objetivo, setObjetivo] = useState('Hipertrofia');
  const [nivel, setNivel] = useState('Iniciante');
  const [dias, setDias] = useState('3-4 dias');

  // NOVO: Estado para controlar a transição de sucesso
  const [isSuccess, setIsSuccess] = useState(false);

  const generos = ["Masculino", "Feminino", "Outro"];
  const objetivos = ["Hipertrofia", "Emagrecimento", "Definição Muscular", "Força Funcional"];
  const niveis = ["Iniciante", "Intermediário", "Avançado"];
  const rotinas = ["1-2 dias", "3-4 dias", "5-6 dias", "Todos os dias"];

  const handleCriarConta = () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !idade.trim() || !genero) {
      return; // Aqui poderíamos adicionar uma mensagem de erro na tela depois
    }
    
    // 1. Salva os dados
    registrarUsuario(nome, idade, genero, objetivo, nivel, dias);

    // 2. Dispara a animação de sucesso em vez do Alert
    setIsSuccess(true);

    // 3. Redireciona após 2 segundos de celebração visual
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2200);
  };

  // TELA DE SUCESSO (O que substitui o Alert)
  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <Animated.View entering={ZoomIn.duration(600)} style={styles.successCircle}>
          <MaterialCommunityIcons name="check-bold" size={60} color={COLORS.background} />
        </Animated.View>
        
        <Animated.Text entering={FadeInDown.delay(400)} style={styles.successTitle}>
          Perfil Sincronizado!
        </Animated.Text>
        
        <Animated.Text entering={FadeInDown.delay(600)} style={styles.successSubtitle}>
          Bem-vindo, {nome}. A IA está preparando seu primeiro treino personalizado...
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(1000)} style={styles.loadingLineContainer}>
           <View style={styles.loadingLineActive} />
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Crie seu Perfil</Text>
        <Text style={styles.subtitle}>A IA precisa de dados biológicos exatos para montar o plano ideal.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Informações Básicas</Text>
          <TextInput style={styles.input} placeholder="Seu Nome" placeholderTextColor={COLORS.textLight} value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={COLORS.textLight} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={COLORS.textLight} value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Biometria</Text>
          <TextInput style={styles.input} placeholder="Sua Idade" placeholderTextColor={COLORS.textLight} value={idade} onChangeText={setIdade} keyboardType="numeric" maxLength={3} />
          <View style={styles.chipGroup}>
            {generos.map(item => (
              <TouchableOpacity key={item} style={[styles.chip, genero === item && styles.chipActive]} onPress={() => setGenero(item)}>
                <Text style={[styles.chipText, genero === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Objetivo Principal</Text>
          <View style={styles.chipGroup}>
            {objetivos.map(item => (
              <TouchableOpacity key={item} style={[styles.chip, objetivo === item && styles.chipActive]} onPress={() => setObjetivo(item)}>
                <Text style={[styles.chipText, objetivo === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Nível de Experiência</Text>
          <View style={styles.chipGroup}>
            {niveis.map(item => (
              <TouchableOpacity key={item} style={[styles.chip, nivel === item && styles.chipActive]} onPress={() => setNivel(item)}>
                <Text style={[styles.chipText, nivel === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Disponibilidade</Text>
          <View style={styles.chipGroup}>
            {rotinas.map(item => (
              <TouchableOpacity key={item} style={[styles.chip, dias === item && styles.chipActive]} onPress={() => setDias(item)}>
                <Text style={[styles.chipText, dias === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <BounceButton style={styles.submitBtn} onPress={handleCriarConta}>
          <Text style={styles.submitBtnText}>FINALIZAR E ENTRAR</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.background} />
        </BounceButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 40 },
  backBtn: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.textLight, fontSize: 14, marginBottom: 30, marginTop: 5, lineHeight: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: COLORS.card, color: COLORS.text, padding: 15, borderRadius: 15, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: COLORS.card, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textLight, fontWeight: '500' },
  chipTextActive: { color: COLORS.background, fontWeight: 'bold' },
  submitBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', paddingVertical: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  submitBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

  // Estilos da Tela de Sucesso
  successContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 30 },
  successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 10, shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 15 },
  successTitle: { color: COLORS.text, fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  successSubtitle: { color: COLORS.textLight, fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  loadingLineContainer: { width: '60%', height: 4, backgroundColor: COLORS.card, borderRadius: 2, marginTop: 40, overflow: 'hidden' },
  loadingLineActive: { width: '100%', height: '100%', backgroundColor: COLORS.primary } // Aqui poderíamos animar a largura
});