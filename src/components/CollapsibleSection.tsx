import React, { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

type CollapsibleSectionProps = {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  style?: StyleProp<ViewStyle>;
  title: string;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  defaultExpanded = false,
  style,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          setIsExpanded((prev) => !prev);
        }}
        style={styles.header}
      >
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isExpanded && <View style={styles.body}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    padding: 12,
  },
  chevron: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
});

export { CollapsibleSection };
