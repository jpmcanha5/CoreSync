import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { BounceButton } from '../../src/components/BounceButton';
import { COLORS } from '../../src/styles/Colors';

// Componente das bolinhas de "Digitando..."
const TypingDot = ({ delay }: { delay: number }) => {
  const sv = useSharedValue(0);
  useEffect(() => {
    setTimeout(() => {
      sv.value = withRepeat(withSequence(withTiming(-10, {duration: 300}), withTiming(0, {duration: 300})), -1, true);
    }, delay);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: sv.value }] }));
  return <Animated.View style={[styles.typingDot, style]} />;
};

export default function Dieta() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [macros, setMacros] = useState<{ prot: string, carb: string, kcal: string } | null>(null);

  const metas = [
    { id: 'massa', label: 'Ganhar Massa', icon: 'arm-flex' },
    { id: 'secar', label: 'Secar Gordura', icon: 'fire' },
    { id: 'definicao', label: 'Definição Muscular', icon: 'human' },
    { id: 'forca', label: 'Força Funcional', icon: 'weight-lifter' },
  ];

  const processarIA = async (texto: string) => {
    if (!texto.trim()) return;
    setPergunta(texto);
    setCarregando(true);
    setResposta('');
    setMacros(null);

    setTimeout(() => {
      setResposta("Dieta ajustada. Adicionamos um foco maior na distribuição proteica para otimizar a hipertrofia e saciedade.");
      setMacros({ prot: '190g', carb: '220g', kcal: '2400' });
      setCarregando(false);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="robot-outline" size={32} color={COLORS.primary} />
        <Text style={styles.title}>Nutrição Automática</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Metas de Otimização:</Text>
        
        {/* Carrossel Magnético */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipsContainer}
          snapToInterval={150} // Faz o "ímã" funcionar no scroll
          decelerationRate="fast"
        >
          {metas.map((meta) => (
            <BounceButton key={meta.id} style={styles.chip} onPress={() => processarIA(meta.label)}>
              <MaterialCommunityIcons name={meta.icon as any} size={16} color={COLORS.primary} />
              <Text style={styles.chipText}>{meta.label}</Text>
            </BounceButton>
          ))}
        </ScrollView>

        {carregando && (
          <Animated.View entering={FadeIn} style={styles.typingContainer}>
            <MaterialCommunityIcons name="brain" size={18} color={COLORS.textLight} />
            <Text style={styles.typingLabel}>A IA está calculando</Text>
            <TypingDot delay={0} />
            <TypingDot delay={150} />
            <TypingDot delay={300} />
          </Animated.View>
        )}

        {!carregando && resposta ? (
          <Animated.View entering={FadeInDown.springify()} style={styles.resultContainer}>
            <View style={styles.chatBubble}>
              <MaterialCommunityIcons name="brain" size={18} color={COLORS.secondary} />
              <Text style={styles.chatText}>{resposta}</Text>
            </View>

            <View style={styles.macroCard}>
              <Text style={styles.macroTitleText}>Seus Novos Macros</Text>
              <View style={styles.macroGrid}>
                <View style={styles.macroBox}><Text style={[styles.macroValue, { color: COLORS.primary }]}>{macros?.prot}</Text><Text style={styles.macroLabel}>Proteína</Text></View>
                <View style={styles.macroBox}><Text style={[styles.macroValue, { color: COLORS.secondary }]}>{macros?.carb}</Text><Text style={styles.macroLabel}>Carbo</Text></View>
                <View style={styles.macroBox}><Text style={[styles.macroValue, { color: COLORS.magenta }]}>{macros?.kcal}</Text><Text style={styles.macroLabel}>Calorias</Text></View>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Descreva sua meta..." placeholderTextColor={COLORS.textLight} value={pergunta} onChangeText={setPergunta} />
        <BounceButton style={styles.btn} onPress={() => processarIA(pergunta)}>
          <MaterialCommunityIcons name="send" size={24} color="#fff" />
        </BounceButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionLabel: { color: COLORS.textLight, fontSize: 13, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', marginBottom: 30, paddingBottom: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: COLORS.border, gap: 6, width: 140 }, // Width fixa para o snap funcionar perfeitamente
  chipText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  
  // Estilos das bolinhas de loading
  typingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', padding: 15, borderRadius: 15, alignSelf: 'flex-start', gap: 6 },
  typingLabel: { color: COLORS.textLight, fontSize: 13, marginRight: 5 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },

  resultContainer: { marginTop: 10 },
  chatBubble: { flexDirection: 'row', backgroundColor: '#1A1A2E', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed', gap: 10, marginBottom: 20 },
  chatText: { color: COLORS.text, flex: 1, fontSize: 14, lineHeight: 22 },
  macroCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  macroTitleText: { color: COLORS.text, fontWeight: 'bold', fontSize: 16, marginBottom: 15, textAlign: 'center' },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  macroBox: { backgroundColor: COLORS.background, flex: 1, marginHorizontal: 4, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  macroValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  macroLabel: { color: COLORS.textLight, fontSize: 10, textTransform: 'uppercase' },
  inputArea: { flexDirection: 'row', padding: 20, backgroundColor: COLORS.background, borderTopWidth: 1, borderColor: COLORS.border, gap: 10 },
  input: { flex: 1, backgroundColor: COLORS.card, color: COLORS.text, padding: 15, borderRadius: 15, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  btn: { backgroundColor: COLORS.primary, width: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }
});