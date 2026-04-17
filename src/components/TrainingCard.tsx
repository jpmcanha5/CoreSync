import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/Colors';

interface TrainingCardProps {
  titulo: string;
  info: string;
  cor: string;
  ultimaVez?: string;
  progresso?: string;
}

export const TrainingCard = ({ titulo, info, cor, ultimaVez, progresso }: TrainingCardProps) => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: cor }]}>
    <View style={styles.info}>
      <Text style={[styles.title, { color: cor }]}>{titulo}</Text>
      <Text style={styles.subTitle}>{info}</Text>
      
      {(ultimaVez || progresso) && (
        <View style={styles.metricsContainer}>
          {ultimaVez && (
            <Text style={styles.metricText}>
              <MaterialCommunityIcons name="calendar-clock" size={12} /> Última: {ultimaVez}
            </Text>
          )}
          {progresso && (
            <Text style={styles.metricPositive}>
              <MaterialCommunityIcons name="trending-up" size={12} /> {progresso}
            </Text>
          )}
        </View>
      )}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={30} color={COLORS.textLight} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 15, padding: 20, marginBottom: 15, borderLeftWidth: 6, elevation: 4 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  metricsContainer: { flexDirection: 'row', gap: 15, marginTop: 12 },
  metricText: { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },
  metricPositive: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold' }
});