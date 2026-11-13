import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Search, X } from 'lucide-react-native';
import { COUNTRIES, Country } from '../../data/countries';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: Country) => void;
  selectedCountry: Country;
}

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  visible,
  onClose,
  onSelectCountry,
  selectedCountry,
}) => {
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.dragPill} />

          <View style={styles.searchRow}>
            <View style={[styles.searchInputContainer, isSearchFocused && styles.searchInputFocused]}>
              <Search size={18} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or region"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoFocus={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel="Clear search">
                  <X size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.listContainer} keyboardShouldPersistTaps="handled">
            {filteredCountries.map((country) => {
              const isSelected = country.code === selectedCountry.code;
              return (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.countryItem, isSelected && styles.countryItemSelected]}
                  onPress={() => {
                    sounds.playKeyClick();
                    onSelectCountry(country);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.countryInfo}>
                    <Text style={styles.flagText}>{country.flag}</Text>
                    <Text style={styles.dialCode}>{country.dialCode}</Text>
                    <Text style={styles.countryName}>{country.name}</Text>
                  </View>
                  {isSelected && <Check size={18} color={colors.accent} strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.md,
    paddingHorizontal: space.lg,
    paddingBottom: space.xxxl,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: space.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.lg,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInputFocused: {
    borderColor: colors.borderStrong,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    marginLeft: space.sm,
    outlineStyle: 'none' as any,
  },
  cancelBtn: {
    paddingHorizontal: space.xs,
  },
  cancelText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: space.xs,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  countryItemSelected: {
    backgroundColor: colors.surface,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 24,
    marginRight: space.md,
  },
  dialCode: {
    ...type.body,
    color: colors.textSecondary,
    fontWeight: '600',
    width: 50,
  },
  countryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
