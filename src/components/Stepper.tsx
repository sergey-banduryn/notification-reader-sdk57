import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type StepperProps = {
  formatValue?: (value: number) => string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
};

const Stepper: React.FC<StepperProps> = ({
  formatValue,
  label,
  max,
  min,
  onChange,
  step,
  value,
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
        <TouchableOpacity onPress={handleDecrement} style={styles.button}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleIncrement} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 6,
    height: 36,
    justifyContent: 'center',
    marginLeft: 8,
    width: 36,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  controls: {
    flexDirection: 'row',
  },
  label: {
    color: '#333333',
    fontSize: 16,
  },
  valueText: {
    fontWeight: 'bold',
  },
});

export { Stepper };
