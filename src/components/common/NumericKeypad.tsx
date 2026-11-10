import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Delete } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface NumericKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onExtraPress?: (char: string) => void;
  showExtraSymbols?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigitPress,
  onBackspace,
  onExtraPress,
  showExtraSymbols = true,
}) => {
  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '+*#', letters: '', special: 'extra' },
    { num: '0', letters: '' },
    { num: 'backspace', letters: '', special: 'backspace' },
  ];

  const handlePress = (key: typeof keys[0]) => {
    sounds.playKeyClick();
    if (key.special === 'backspace') {
      onBackspace();
    } else if (key.special === 'extra') {
      if (onExtraPress) onExtraPress('+');
      else onDigitPress('+');
    } else {
      onDigitPress(key.num);
    }
  };

  return (
    <View style={styles.container}>
      {keys.map((k, index) => {
        if (!showExtraSymbols && k.special === 'extra') {
          return <View key={index} style={styles.emptyKey} />;
        }

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.65}
            style={styles.keyButton}
            onPress={() => handlePress(k)}
          >
            {k.special === 'backspace' ? (
              <Delete size={26} color="#ffffff" strokeWidth={1.75} />
            ) : (
              <View style={styles.keyContent}>
                <Text style={styles.keyNumber}>{k.num}</Text>
                {k.letters ? <Text style={styles.keyLetters}>{k.letters}</Text> : null}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 16,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  keyButton: {
    width: '31%',
    height: 58,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  emptyKey: {
    width: '31%',
    height: 58,
    marginVertical: 4,
  },
  keyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  keyLetters: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: -2,
  },
});

