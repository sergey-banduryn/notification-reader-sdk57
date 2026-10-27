import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, Number((value - step).toFixed(2)));
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, Number((value + step).toFixed(2)));
    onChange(newValue);
  };

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: <Text style={styles.valueText}>{displayValue}</Text>
      </Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  valueText: {
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
