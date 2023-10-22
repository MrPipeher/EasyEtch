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
        className = "bg-white h-[30%] w-full self-center m-2"
        placeholder="Search Dispositions..."
        placeholderTextColor={'gray'}
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
            <Text className = "text-black">{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DispositionContainer;

const styles = {
  dispositionButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
  },
  selectedDispositionButton: {
    backgroundColor: 'lightblue',
  },
};
