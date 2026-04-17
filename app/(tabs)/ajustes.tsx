import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS } from '../../src/styles/Colors';

export default function Ajustes() {
  const router = useRouter();
  const { userName, objetivo, nivel, comprometimento, setParametros, logout } = useAppStore();

  const listas = {
    objetivo: ["Hipertrofia", "Emagrecimento", "Definição Muscular", "Força Funcional"],
    nivel: ["Iniciante", "Intermediário", "Avançado", "Atleta"],
    comprometimento: ["1-2 dias", "3-4 dias", "Todos os dias"]
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState<'objetivo' | 'nivel' | 'comprometimento'>('objetivo');

  // Flash Animation
  const flashColor = useSharedValue(COLORS.primary);
  const flashStyle = useAnimatedStyle(() => ({ borderColor: flashColor.value }));

  const dispararFlash = () => {
    flashColor.value = withSequence(
      withTiming('#FFFFFF', {duration: 150}), 
      withTiming(COLORS.primary, {duration: 500})
    );
  };

  const abrirSeletor = (tipo: 'objetivo' | 'nivel' | 'comprometimento') => {
    setTipoAtivo(tipo);
    setModalVisible(true);
  };

  const selecionarOpcao = (valor: string) => {
    if (tipoAtivo === 'objetivo') setParametros(valor, nivel, comprometimento);
    if (tipoAtivo === 'nivel') setParametros(objetivo, valor, comprometimento);
    if (tipoAtivo === 'comprometimento') setParametros(objetivo, nivel, valor);
    
    setModalVisible(false);
    dispararFlash(); // Mostra visualmente que a IA acatou a ordem
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      while (router.canGoBack()) router.back();
      router.replace('/'); 
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
        <Text style={styles.title}>Parâmetros Cerebrais</Text>
        <Text style={styles.subtitle}>Ajuste as diretrizes para a inteligência artificial.</Text>

        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={() => abrirSeletor('objetivo')}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="target" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>Objetivo Principal</Text>
            </View>
            <View style={styles.valueBox}>
              <Text style={styles.settingValue}>{objetivo}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => abrirSeletor('nivel')}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="weight-lifter" size={24} color={COLORS.secondary} />
              <Text style={styles.settingText}>Nível de Treino</Text>
            </View>
            <View style={styles.valueBox}>
              <Text style={styles.settingValue}>{nivel}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => abrirSeletor('comprometimento')}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="calendar-sync" size={24} color={COLORS.magenta} />
              <Text style={styles.settingText}>Comprometimento</Text>
            </View>
            <View style={styles.valueBox}>
              <Text style={styles.settingValue}>{comprometimento}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quadro animado que "pisca" ao ser atualizado */}
        <Animated.View style={[styles.previewCard, flashStyle]}>
          <MaterialCommunityIcons name="brain" size={24} color={COLORS.textLight} />
          <Text style={styles.previewText}>
            Com base no seu perfil <Text style={{color: COLORS.primary}}>{nivel.toLowerCase()}</Text>, 
            a IA irá focar em <Text style={{color: COLORS.primary}}>{objetivo.toLowerCase()}</Text>, 
            distribuindo o volume ideal para <Text style={{color: COLORS.primary}}>{comprometimento}</Text>.
          </Text>
        </Animated.View>

        <View style={styles.profileFooter}>
          <View style={styles.profileInfo}>
            <MaterialCommunityIcons name="account-circle" size={40} color={COLORS.textLight} />
            <View>
              <Text style={styles.profileName}>{userName || 'Visitante'}</Text>
              <Text style={styles.profilePlan}>CoreSync Pro</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Background do Modal levemente translúcido */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma opção</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {listas[tipoAtivo].map((item, index) => {
              const selecionado = (tipoAtivo === 'objetivo' && item === objetivo) ||
                                  (tipoAtivo === 'nivel' && item === nivel) ||
                                  (tipoAtivo === 'comprometimento' && item === comprometimento);

              return (
                <TouchableOpacity key={index} style={[styles.modalOption, selecionado && styles.modalOptionSelected]} onPress={() => selecionarOpcao(item)}>
                  <Text style={[styles.modalOptionText, selecionado && styles.modalOptionTextSelected]}>{item}</Text>
                  {selecionado && <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.background} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.textLight, marginBottom: 30, fontSize: 14, marginTop: 5 },
  section: { marginBottom: 30 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 20, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  valueBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
  previewCard: { backgroundColor: '#1A1A2E', padding: 20, borderRadius: 15, borderWidth: 2, borderStyle: 'dashed', flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 40 },
  previewText: { color: COLORS.textLight, flex: 1, fontSize: 13, lineHeight: 22 },
  profileFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 20 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  profileName: { color: COLORS.text, fontWeight: 'bold', fontSize: 16 },
  profilePlan: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ff4444', backgroundColor: '#331111' },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end', padding: 20 },
  modalContent: { backgroundColor: COLORS.card, width: '100%', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: COLORS.border, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  modalOption: { paddingVertical: 18, paddingHorizontal: 15, borderRadius: 15, marginBottom: 8, backgroundColor: COLORS.background, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOptionSelected: { backgroundColor: COLORS.primary },
  modalOptionText: { color: COLORS.text, fontSize: 16, fontWeight: '500' },
  modalOptionTextSelected: { color: COLORS.background, fontWeight: 'bold' }
});