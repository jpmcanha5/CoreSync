import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';
import { BounceButton } from '../../src/components/BounceButton';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS } from '../../src/styles/Colors';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const { userName, streak, frequencia, objetivo, fezCheckInHoje, fazerCheckIn } = useAppStore();
  const [showCelebration, setShowCelebration] = useState(false);

  const semana = [
    { nome: 'S', dia: '13', status: 'falta', foco: 'Off' },
    { nome: 'T', dia: '14', status: 'falta', foco: 'Off' },
    { nome: 'Q', dia: '15', status: fezCheckInHoje ? 'treinou' : 'hoje', foco: objetivo === 'Emagrecimento' ? 'Cardio' : 'Força' },
    { nome: 'Q', dia: '16', status: 'futuro', foco: 'Aguardando' },
    { nome: 'S', dia: '17', status: 'futuro', foco: 'Aguardando' },
  ];

  const handleCheckIn = () => {
    fazerCheckIn();
    // Em vez de Alert, disparamos a celebração visual
    setShowCelebration(true);
    
    // Esconde a animação após 2.5 segundos
    setTimeout(() => {
      setShowCelebration(false);
    }, 2500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.homeLogo} 
            resizeMode="contain" 
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Oi {userName || 'Usuário'}!</Text>
          <Text style={styles.subtitleText}>{fezCheckInHoje ? "Missão cumprida por hoje! Descanse." : "Pronto para sincronizar seu corpo hoje?"}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.streakContainer}>
          <MaterialCommunityIcons name="fire" size={28} color={fezCheckInHoje ? COLORS.secondary : COLORS.textLight} />
          <Text style={[styles.streakText, !fezCheckInHoje && { color: COLORS.textLight }]}>{streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}!</Text>
          <Text style={styles.streakSub}>Sua frequência atual é de {frequencia}%.</Text>
        </Animated.View>

        {!fezCheckInHoje ? (
          <Animated.View entering={BounceIn.delay(300)}>
            <BounceButton style={styles.checkinButton} onPress={handleCheckIn}>
              <MaterialCommunityIcons name="check-decagram" size={24} color={COLORS.background} />
              <Text style={styles.checkinButtonText}>FAZER CHECK-IN DE TREINO</Text>
            </BounceButton>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={styles.checkedInBox}>
            <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.success} />
            <Text style={styles.checkedInText}>Check-in realizado hoje. Muito bem!</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400)} style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.aiBadge}>
              <MaterialCommunityIcons name="robot-outline" size={14} color={COLORS.background} />
              <Text style={styles.aiBadgeText}>RECOMENDADO HOJE</Text>
            </View>
          </View>
          <Text style={styles.workoutTitle}>Treino Inteligente</Text>
          <Text style={styles.workoutInsight}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color={COLORS.primary} />
            {" "}Ajustamos a carga hoje para priorizar seu foco em {objetivo.toUpperCase()}.
          </Text>
        </Animated.View>

        <View style={styles.fullBox}>
          <Text style={styles.boxTitle}>Rota da Semana</Text>
          <View style={styles.weekContainer}>
            {semana.map((item, index) => (
              <Animated.View key={index} entering={FadeInRight.delay(index * 150).springify()} style={styles.dayColumn}>
                <Text style={styles.dayName}>{item.nome}</Text>
                <View style={[styles.dateCircle, item.status === 'treinou' && styles.dateTreinou, item.status === 'hoje' && styles.dateHoje]}>
                  <Text style={[styles.dateText, (item.status === 'treinou' || item.status === 'hoje') && styles.dateTextLight]}>{item.dia}</Text>
                </View>
                <Text style={styles.focoText}>{item.foco}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* --- SOBREPOSIÇÃO DE CELEBRAÇÃO (SUBSTITUI O ALERT) --- */}
      {showCelebration && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={styles.overlay}
        >
          <Animated.View entering={ZoomIn.duration(500)} exiting={ZoomOut} style={styles.celebrationBox}>
            <View style={styles.fireCircle}>
              <MaterialCommunityIcons name="fire" size={80} color={COLORS.secondary} />
            </View>
            <Text style={styles.celebrationTitle}>TREINO SINCRONIZADO!</Text>
            <Text style={styles.celebrationText}>Seu streak aumentou para {streak}.</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>+{streak}pts</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 20, justifyContent: 'center' },
  homeLogo: { width: 300, height: 100 },
  greetingContainer: { marginBottom: 20 },
  greetingText: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subtitleText: { fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: '500' },
  streakContainer: { backgroundColor: '#1A1A1A', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  streakText: { fontSize: 20, fontWeight: 'bold', color: COLORS.secondary, marginTop: 5 },
  streakSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  checkinButton: { backgroundColor: COLORS.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 15, gap: 10, marginBottom: 20, elevation: 4 },
  checkinButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  checkedInBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'rgba(0, 200, 83, 0.1)', paddingVertical: 18, borderRadius: 15, borderWidth: 1, borderColor: COLORS.success, marginBottom: 20 },
  checkedInText: { color: COLORS.success, fontWeight: 'bold', fontSize: 14 },
  workoutCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.primary },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 4 },
  aiBadgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.background, letterSpacing: 1 },
  workoutTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  workoutInsight: { fontSize: 13, color: COLORS.textLight, marginBottom: 20, lineHeight: 18 },
  fullBox: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  boxTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  weekContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dayColumn: { alignItems: 'center' },
  dayName: { fontSize: 12, color: COLORS.textLight, marginBottom: 8, fontWeight: '600' },
  dateCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333333', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  dateTreinou: { backgroundColor: COLORS.secondary },
  dateHoje: { backgroundColor: COLORS.primary },
  dateText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textLight },
  dateTextLight: { color: '#fff' },
  focoText: { fontSize: 10, color: COLORS.textLight },

  // Estilos da Celebração Visual
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  celebrationBox: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 30,
    width: '85%',
  },
  fireCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed'
  },
  celebrationTitle: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2
  },
  celebrationText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  },
  streakBadge: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  streakBadgeText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 18
  }
});