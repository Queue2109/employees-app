import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Employee } from './types';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group'
import { db } from './firebaseInit';
import { push, ref, set } from 'firebase/database';


const EditCreate = () => {
    const create: boolean = false;
    // const employeeId: number | undefined = route.params.employeeId;
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [newEmployee, setNewEmployee] = useState<Employee>({
      name: '',
      last_name: '',
      age: 0,
      gender: 'M',
    });
    const [selectedId, setSelectedId] = useState<'M' | 'F'>(newEmployee.gender);

    
  const handleInputChange = (field: string, value: string) => {
    if (field === 'age') {
      const parsedValue = parseInt(value, 10);
      setNewEmployee(prevState => ({
        ...prevState,
        [field]: isNaN(parsedValue) ? 0 : parsedValue, // Convert age to number or set to 0 if NaN
      }));
    } else {
      setNewEmployee(prevState => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const onSave = () => {
    try {
      push(ref(db, 'employees/'), newEmployee);
        Alert.alert('Success', `Employee added successfully: ${newEmployee}`);
        // Navigate back to the home screen or clear the form
    } catch (error) {
        console.error('Error adding employee: ', error);
    }
};
   
  
    const radioButtons: RadioButtonProps[] = useMemo(() => ([
      {
        id: 'M',
        label: 'Male',
        value: 'M',
      },
      {
        id: 'F',
        label: 'Female',
        value: 'F',
      }
    ]), [newEmployee.gender]);
    
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            {create ? <Text style={styles.headerText}>Edit your employee</Text> : <Text style={styles.headerText}>Create new employee</Text>}
          </View>
          <View style={styles.body}>
            <View>
              <Text style={styles.bodyTextLeft}>First Name:</Text>
              <Text style={styles.bodyTextLeft}>Last Name:</Text>
              <Text style={styles.bodyTextLeft}>Age:</Text>
              <Text style={styles.bodyTextLeft}>Gender:</Text>
            </View>
            {create ? 
            <View>
              <Text style={styles.bodyTextRight}>{employee?.name}</Text>
              <Text style={styles.bodyTextRight}>{employee?.last_name}</Text>
              <Text style={styles.bodyTextRight}>{employee?.age}</Text>
              <Text style={styles.bodyTextRight}>{employee?.gender}</Text>
            </View>
            :
            <View>
              <TextInput
                style={styles.bodyTextLeft}
                placeholder="First Name"
                value={newEmployee.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
              <TextInput
                style={styles.bodyTextLeft}
                placeholder="Last Name"
                value={newEmployee.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
              />
                <TextInput
                style={styles.bodyTextLeft}
                placeholder="Age"
                value={newEmployee.age.toString()} // Convert age to string
                onChangeText={(text) => handleInputChange('age', text)}
                keyboardType="numeric"
              />
               <RadioGroup
                  radioButtons={radioButtons} 
                  onPress={(selectedId: string) => setSelectedId(selectedId.toString() as 'M' | 'F'   )}
                  selectedId={selectedId}
                />
            </View>
            }
          </View>
          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => {}} >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSave]} onPress={onSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      );
    };

export default EditCreate

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      justifyContent: 'space-between',
    },
    header: {
      height: '10%',
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    body: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 50,
      backgroundColor: 'lightblue',
      padding: 20,
      borderRadius: 10,
    },
    bodyTextLeft: {
      fontSize: 20,
    },
    bodyTextRight: {
      fontSize: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      paddingHorizontal: 50,
      paddingVertical: 15,
      backgroundColor: 'lightblue',
      borderRadius: 10,
    },
    buttonCancel: {
      backgroundColor: 'red',
      color: 'white',
    },
    buttonSave: {
      backgroundColor: 'lightblue',
      color: 'white',
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 20,
    }
  });
  