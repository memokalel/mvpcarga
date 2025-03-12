export function AccessibleView({ children, label, hint }: AccessibleViewProps) {
  return (
    <View
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
    >
      {children}
    </View>
  );
}