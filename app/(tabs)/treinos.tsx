import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { BounceButton } from '../../src/components/BounceButton';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS } from '../../src/styles/Colors';

interface Exercicio { nome: string; rep: string; kg: string; }

export default function Treinos() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Analisando perfil biológico...");
  const [timer, setTimer] = useState(0);
  const { finalizarTreino, objetivo, nivel, idade, comprometimento } = useAppStore();

  const gerarTreinoBaseadoNoPerfil = () => {
    let titulo = "Circuito Inteligente";
    let foco = "Otimizado para sua meta";
    let exercicios: Exercicio[] = [
      { nome: "Agachamento Dinâmico", rep: "12", kg: "20" },
      { nome: "Desenvolvimento Arnold", rep: "10", kg: "15" },
      { nome: "Remada com Halter", rep: "12", kg: "18" },
    ];
    return { titulo, foco, exercicios };
  };

  const treinoDoDia = gerarTreinoBaseadoNoPerfil();

  // Scanner da IA Animação
  const scannerOpacity = useSharedValue(0.2);
  useEffect(() => {
    if (isGenerating) {
      scannerOpacity.value = withRepeat(withSequence(withTiming(1, {duration: 400}), withTiming(0.2, {duration: 400})), -1, true);
    }
  }, [isGenerating]);
  const scannerStyle = useAnimatedStyle(() => ({ opacity: scannerOpacity.value }));

  const iniciarIA = () => {
    setIsGenerating(true);
    setTimeout(() => setLoadingText("Calculando sobrecarga progressiva..."), 600);
    setTimeout(() => setLoadingText("Treino gerado com sucesso!"), 1200);
    setTimeout(() => {
      setIsGenerating(false);
      setIsWorkoutActive(true);
    }, 1600);
  };

  const concluirEFechar = () => {
    finalizarTreino();
    setIsWorkoutActive(false);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorkoutActive) interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    else setTimer(0);
    return () => { if (interval) clearInterval(interval); };
  }, [isWorkoutActive]);

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={scannerStyle}>
          <MaterialCommunityIcons name="brain" size={80} color={COLORS.primary} />
        </Animated.View>
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  if (isWorkoutActive) {
    return (
      <View style={styles.workoutModeContainer}>
        <View style={styles.wmHeader}>
          <Text style={styles.wmTitle}>{treinoDoDia.titulo}</Text>
          <Text style={styles.wmTimer}>{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</Text>
        </View>

        <ScrollView style={styles.wmContent} showsVerticalScrollIndicator={false}>
          {treinoDoDia.exercicios.map((ex, index) => (
            <Animated.View key={index} entering={FadeInDown.delay(index * 200).springify()} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{ex.nome}</Text>
              <View style={styles.setRow}>
                <Text style={styles.setLabel}>Alvo</Text>
                <TextInput style={styles.inputRep} value={ex.rep} editable={false} />
                <TextInput style={styles.inputKg} value={ex.kg} editable={false} />
                <BounceButton style={styles.checkBtn}>
                  <MaterialCommunityIcons name="check" size={20} color="#fff" />
                </BounceButton>
              </View>
            </Animated.View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        <BounceButton style={styles.finishBtn} onPress={concluirEFechar}>
          <Text style={styles.finishBtnText}>FINALIZAR TREINO</Text>
        </BounceButton>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.Text entering={FadeInDown} style={styles.headerTitle}>Inteligência de Treino</Animated.Text>
      
      <BounceButton style={styles.aiButton} onPress={iniciarIA}>
        <MaterialCommunityIcons name="auto-fix" size={24} color={COLORS.background} />
        <Text style={styles.aiButtonText}>INICIAR TREINO DA IA</Text>
      </BounceButton>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Text style={styles.sectionTitle}>Seu Treino Personalizado</Text>
        <View style={styles.dynamicCard}>
          <View style={styles.cardHeader}>
             <MaterialCommunityIcons name="brain" size={20} color={COLORS.primary} />
             <Text style={styles.dynamicTitle}>{treinoDoDia.titulo}</Text>
          </View>
          <Text style={styles.dynamicFoco}>{treinoDoDia.foco}</Text>
          <View style={styles.divider} />
          {treinoDoDia.exercicios.map((ex, index) => (
            <Text key={index} style={styles.exListItem}>• {ex.nome}</Text>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  aiButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 15, gap: 10, marginBottom: 30 },
  aiButtonText: { fontSize: 16, fontWeight: 'bold', color: COLORS.background, letterSpacing: 1 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textLight, marginBottom: 15, textTransform: 'uppercase' },
  dynamicCard: { backgroundColor: COLORS.card, borderRadius: 15, padding: 20, borderWidth: 1, borderColor: COLORS.primary, borderLeftWidth: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 5 },
  dynamicTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  dynamicFoco: { color: COLORS.textLight, fontSize: 13, marginBottom: 15 },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 15 },
  exListItem: { color: COLORS.textLight, fontSize: 14, marginBottom: 5 },

  // Estilos de Loading
  loadingContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginTop: 20, letterSpacing: 1 },

  workoutModeContainer: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 50 },
  wmHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: COLORS.border },
  wmTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  wmTimer: { fontSize: 24, fontWeight: 'bold', color: COLORS.secondary },
  wmContent: { padding: 20 },
  exerciseCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, marginBottom: 15 },
  exerciseName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  setLabel: { color: COLORS.textLight, flex: 1, fontWeight: 'bold' },
  inputRep: { backgroundColor: COLORS.grayLight, color: COLORS.text, padding: 10, borderRadius: 8, width: 80, textAlign: 'center' },
  inputKg: { backgroundColor: COLORS.grayLight, color: COLORS.text, padding: 10, borderRadius: 8, width: 80, textAlign: 'center' },
  checkBtn: { backgroundColor: COLORS.success, padding: 12, borderRadius: 8 },
  finishBtn: { backgroundColor: COLORS.danger, margin: 20, padding: 15, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  finishBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});