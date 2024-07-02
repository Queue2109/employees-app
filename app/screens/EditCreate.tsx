import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EditCreateNavigationProp, Employee } from "../types";
import { db } from "../firebaseInit";
import { get, push, ref, set } from "firebase/database";
import { RadioButton } from "react-native-paper";
import Colors from "@/constants/Colors";

const EditCreate: React.FC<EditCreateNavigationProp> = ({
  route,
  navigation,
}) => {
  const { create, employeeId } = route.params;
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    last_name: "",
    age: 0,
    gender: "M",
  });
  // const [checked, setChecked] = useState<"M" | "F">(newEmployee.gender);
  const [selectedId, setSelectedId] = useState<"M" | "F">(newEmployee.gender);

  useEffect(() => {
    if (!create && employeeId) {
      get(ref(db, `employees/${employeeId}`))
        .then((employeeSnap) => {
          if (employeeSnap.exists()) {
            const employeeData = employeeSnap.val();
            setNewEmployee(employeeData);
            setSelectedId(employeeData.gender);
          } else {
            console.log("No employee found");
          }
        })
        .catch((error) => {
          console.error("Error fetching employee data: ", error);
        });
    }
  }, [create, employeeId]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "age") {
      const parsedValue = parseInt(value, 10);
      setNewEmployee((prevState) => ({
        ...prevState,
        [field]: isNaN(parsedValue) ? 0 : parsedValue, // Convert age to number or set to 0 if NaN
      }));
    } else {
      setNewEmployee((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const onSave = () => {
    if (newEmployee.name.length == 0 || newEmployee.last_name.length == 0) {
      Alert.alert("Try again", "All fields are required!");
      return;
    }

    if (newEmployee.age < 15 || newEmployee.age > 70) {
      Alert.alert(
        "Age Restriction",
        "Employee's age must be between 15 and 64!"
      );
      return;
    }

    try {
      if (create) {
        push(ref(db, "employees/"), newEmployee);
      } else if (employeeId) {
        newEmployee.gender = selectedId;
        set(ref(db, `employees/${employeeId}`), newEmployee);
      }
      navigation.goBack(); // Navigate back to the home screen
    } catch (error) {
      console.error("Error saving employee: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {create ? (
          <Text style={styles.headerText}>Create new employee</Text>
        ) : (
          <Text style={styles.headerText}>Edit {newEmployee.name}'s data</Text>
        )}
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.bodyTextLeft}>First Name:</Text>
          <TextInput
            style={styles.bodyTextInput}
            value={newEmployee.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <Text style={styles.bodyTextLeft}>Last Name:</Text>
          <TextInput
            style={styles.bodyTextInput}
            value={newEmployee.last_name}
            onChangeText={(text) => handleInputChange("last_name", text)}
          />
          <Text style={styles.bodyTextLeft}>Age:</Text>
          <TextInput
            style={styles.bodyTextInput}
            value={newEmployee.age == 0 ? "" : newEmployee.age.toString()}
            onChangeText={(text) => handleInputChange("age", text)}
            keyboardType="numeric"
          />
          <Text style={styles.bodyTextLeft}>Gender:</Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioGroup}>
              <RadioButton
                value="M"
                status={selectedId === "M" ? "checked" : "unchecked"}
                onPress={() => setSelectedId("M")}
                color={Colors.darkBlue}
                uncheckedColor={Colors.darkBlue}
              />
              <Text style={styles.radioLabel}>Male</Text>
            </View>
            <View style={styles.radioGroup}>
              <RadioButton
                value="F"
                status={selectedId === "F" ? "checked" : "unchecked"}
                onPress={() => setSelectedId("F")}
                color={Colors.darkBlue}
                uncheckedColor={Colors.darkBlue}
              />

              <Text style={styles.radioLabel}>Female</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.buttonCancel]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonSave]} onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EditCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 50,
    justifyContent: "space-between",
    backgroundColor: Colors.darkBeige,
  },
  header: {
    padding: 20,
    margin: 20,
    marginBottom: 0,
    borderRadius: 10,
    backgroundColor: Colors.lightBlue
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.darkBlue,
  },
  body: {
    marginHorizontal: 20,
    backgroundColor: Colors.lightBlue,
    padding: 20,
    borderRadius: 10,
    // marginTop: 0,
  },
  bodyTextLeft: {
    fontSize: 16,
    color: Colors.darkBlue,
  },
  bodyTextInput: {
    fontSize: 16,
    backgroundColor: Colors.darkBeige,
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    color: Colors.darkBlue,
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonCancel: {
    backgroundColor: Colors.red,
  },
  buttonSave: {
    backgroundColor: Colors.darkBlue,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: Colors.darkBeige,
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.darkBeige,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
});
