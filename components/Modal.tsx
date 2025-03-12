import { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors, shadows } from '../app/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
};

export function Modal({ visible, onClose, children, height = SCREEN_HEIGHT * 0.85 }: ModalProps) {
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);
  // Flag para evitar que se dispare el cierre más de una vez
  const isClosing = useRef(false);

  // Manejo de animaciones de entrada y salida según el prop "visible"
  useEffect(() => {
    if (visible) {
      // Reiniciamos el flag y ejecutamos la animación de entrada
      isClosing.current = false;
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      // Si ya se está cerrando no disparamos otra animación
      if (!isClosing.current) {
        isClosing.current = true;
        opacity.value = withTiming(0, { duration: 250 });
        translateY.value = withSpring(height, {
          damping: 20,
          stiffness: 90,
        }, () => {
          runOnJS(onClose)();
        });
      }
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const ModalBackground = Platform.select({
    ios: BlurView,
    android: View,
    default: View,
  });

  const handleOverlayPress = () => {
    if (!isClosing.current) {
      isClosing.current = true;
      opacity.value = withTiming(0, { duration: 250 });
      translateY.value = withSpring(height, {
        damping: 20,
        stiffness: 90,
      }, () => {
        runOnJS(onClose)();
      });
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
        <ModalBackground
          style={StyleSheet.absoluteFill}
          intensity={20}
          tint="dark"
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={handleOverlayPress}
            activeOpacity={1}
          />
        </ModalBackground>
      </Animated.View>

      <Animated.View style={[styles.modal, modalStyle, { height }]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: colors.background.modal,
      default: colors.background.modal,
    }),
  },
  modal: {
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.large,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
});
