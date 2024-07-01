import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Employee, HomeNavigationProp } from "../types";
import { db } from "../firebaseInit";
import { get, ref, remove } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
import Iconn from "react-native-vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home: React.FC<HomeNavigationProp> = ({ navigation }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tempEmployee, setTempEmployee] = useState<Employee | null>(null);
  const [tempEmployeeId, setTempEmployeeId] = useState<string | null>(null);

  const [visible, setVisible] = React.useState(false);
  const [showHint, setShowHint] = useState(true);

  const onDismissSnackBar = () => setVisible(false);

  const fetchEmployees = useCallback(() => {
    get(ref(db, "employees/"))
      .then((employeesList) => {
        if (employeesList.exists()) {
          const data = employeesList.val();
          const employees: Employee[] = Object.keys(data).map((key) => ({
            ...data[key],
            id: key,
          }));
          setEmployees(employees);
        } else {
          console.log("No employees yet");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        Alert.alert("Error fetching data", "Please try again later");
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [fetchEmployees])
  );

  const handleDeleteEmployee = (employee: Employee) => {
    setVisible(true);
    setTempEmployee(employee);
    setTempEmployeeId(employee.id!);

    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.id !== employee.id)
    );

    setTimeout(() => {
      if (visible) {
        remove(ref(db, `employees/${tempEmployeeId}`))
          .then(() => {
            console.log("Employee deleted successfully");
            setVisible(false);
          })
          .catch((error) => {
            console.error("Error deleting employee: ", error);
          });
      }
    }, 2000);
  };

  useEffect(() => {
    const checkFirstVisit = async () => {
      const isFirstVisit = await AsyncStorage.getItem("firstTime");
      if (!isFirstVisit) {
        Alert.alert(
          "Welcome to the Home Screen!",
          'This screen displays all company employees. Use the "+" button to add new employees. Tap an employee to edit their details, or press and hold their name to delete. For statistics, tap the graph icon.',
          [{ text: "Got it!" }]
        );

        await AsyncStorage.setItem("firstTime", "true");
      }
    };
    setTimeout(() => {
      checkFirstVisit();
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Employees in your company</Text>
      </View>
      <FlatList
        style={styles.listBackground}
        data={employees}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Pressable
              onPress={() =>
                navigation.navigate("EditCreate", {
                  create: false,
                  employeeId: item.id,
                })
              }
              onLongPress={() => handleDeleteEmployee(item)}
              
            >
              <Text style={styles.text}>
                {item.name} {item.last_name} ({item.gender}), {item.age}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No employees yet.</Text>
        )}
      />

      <View style={styles.footer}>
        <Snackbar
          style={styles.snackbar}
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            textColor: Colors.darkBeige,
            label: "Undo",
            onPress: () => {
              setVisible(false);
              setEmployees((prevEmployees) => [
                ...prevEmployees,
                tempEmployee!,
              ]);
            },
          }}
        >
          Accidentally deleted employee?
        </Snackbar>
        <Pressable
          style={styles.roundButton}
          onPress={() =>
            navigation.navigate("Statistics", { employees: employees })
          }
        >
          <Iconn name="barschart" style={styles.plusIcon}></Iconn>
        </Pressable>
        <Pressable
          style={styles.roundButton}
          onPress={() => navigation.navigate("EditCreate", { create: true })}
        >
          <Icon name="plus" style={styles.plusIcon}></Icon>
        </Pressable>
      </View>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
    backgroundColor: Colors.darkBeige,
  },
  listBackground: {
    backgroundColor: Colors.darkBeige,
  },
  listItem: {
    padding: 18,
    backgroundColor: Colors.lightBlue,
    marginVertical: 6,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.darkBlue,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.darkBlue,
  },
  headerBox: {
    alignItems: "center",
    height: "15%",
    marginTop: 40,
  },
  footer: {
    height: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  snackbar: {
    opacity: 1,
    zIndex: 1,
    backgroundColor: Colors.red,
  },
  roundButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 30,
    backgroundColor: Colors.darkBlue,
    elevation: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  plusIcon: {
    fontSize: 30,
    color: Colors.darkBeige,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    backgroundColor: Colors.darkBeige,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 1,
    width: "100%",
    margin: 0,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.darkBlue,
    textAlign: "center",
  }
});
