import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MessageCircle, Phone, Mail, CircleHelp as HelpCircle } from 'lucide-react-native';
import { colors, shadows } from '../constants/colors';

export default function SupportScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Soporte</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto Directo</Text>
        
        <TouchableOpacity style={styles.contactItem}>
          <Phone size={24} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Teléfono</Text>
            <Text style={styles.contactDetail}>+52 951 123 4567</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem}>
          <Mail size={24} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Correo</Text>
            <Text style={styles.contactDetail}>soporte@ecocarga.mx</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem}>
          <MessageCircle size={24} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Chat en Vivo</Text>
            <Text style={styles.contactDetail}>Disponible 9:00 - 18:00</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        
        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={colors.text.light} />
          <Text style={styles.faqText}>¿Cómo reservo un punto de carga?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={colors.text.light} />
          <Text style={styles.faqText}>¿Qué métodos de pago aceptan?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={colors.text.light} />
          <Text style={styles.faqText}>¿Cómo cancelo una reserva?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text.primary,
    padding: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.primary,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...shadows.small,
  },
  contactInfo: {
    marginLeft: 16,
  },
  contactTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
  },
  contactDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
});