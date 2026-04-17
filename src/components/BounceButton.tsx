import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// O Reanimated precisa "envolver" o componente Pressable para conseguir animá-lo
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BounceButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BounceButton = ({ children, style, onPress, ...rest }: BounceButtonProps) => {
  // A escala começa em 1 (tamanho normal)
  const scale = useSharedValue(1);

  // O estilo animado que vai reagir às mudanças da escala
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Quando o dedo toca a tela: encolhe para 92% do tamanho
  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
  };

  // Quando o dedo solta a tela: volta para 100% com o efeito mola
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};