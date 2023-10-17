import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const DispositionContainer = ({ dispositions, selectedDispositions, toggleDisposition }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDispositions = dispositions.filter(disposition =>
    disposition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 10 }}
        placeholder="Search Dispositions..."
        onChangeText={setSearchTerm}
        value={searchTerm}
      />

      <ScrollView>
        {filteredDispositions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dispositionButton,
              selectedDispositions.includes(item) && styles.selectedDispositionButton
            ]}
            onPress={() => toggleDisposition(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DispositionContainer;

const styles = {
  dispositionButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  selectedDispositionButton: {
    backgroundColor: 'lightblue',
  },
};
