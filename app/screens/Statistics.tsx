import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { StatisticsNavigationProp } from "../types";
import PieChart from "react-native-pie-chart";
import Colors from "@/constants/Colors";
import Icon from "react-native-vector-icons/AntDesign";
import { ActivityIndicator } from "react-native-paper";

const Statistics: FC<StatisticsNavigationProp> = ({ route, navigation }) => {
  const [genderStats, setGenderStats] = useState({ males: 0, females: 0 });
  const [averageAge, setAverageAge] = useState(0);
  const [dataReady, setDataReady] = useState(false); // New state to track data readiness
  const [totalWomen, setTotalWomen] = useState(0); // New state
  const [totalMen, setTotalMen] = useState(0); // New state
  const employees = route.params.employees;

  useEffect(() => {
    const totalEmployees = employees.length;
    if (totalEmployees === 0) return;
    const men = employees.filter((emp) => emp.gender === "M").length;
    const women = employees.filter((emp) => emp.gender === "F").length;
    const avgAge =
      employees.reduce((acc, curr) => acc + curr.age, 0) / totalEmployees;

    setTotalMen(men);
    setTotalWomen(women);
    setGenderStats({
      males: (men / totalEmployees) * 100,
      females: (women / totalEmployees) * 100,
    });
    setAverageAge(parseFloat(avgAge.toFixed(1)));
    setDataReady(true);
  }, [employees]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      <View style={styles.averageAgeBox}>
        <Text style={styles.averageAgeText}>Average age of employees:</Text>
        <Text style={[styles.averageAgeText, { fontSize: 24, marginTop: 8 }]}>
          {averageAge}
        </Text>
      </View>
      <View style={styles.pieBox}>
        <Text style={[styles.genderText, { width: "15%", marginLeft: "5%" }]}>
          Men
        </Text>
        {dataReady ? (
          <Pressable
            onPress={() => {
              Alert.alert(
                "Details:",
                `Number of women in company: ${totalWomen}, number of men in company: ${totalMen}`
              );
            }}
          >
            <PieChart
              series={[genderStats.females, genderStats.males]}
              sliceColor={[Colors.red, Colors.yellow]}
              coverRadius={0.45}
              coverFill={Colors.darkBeige}
              widthAndHeight={200}
            />
          </Pressable>
        ) : (
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        )}
        <Text style={[styles.genderText, { color: Colors.red, width: "20%" }]}>
          Women
        </Text>
      </View>
      <Pressable
        style={styles.roundButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Icon name="arrowleft" style={styles.plusIcon}></Icon>
      </Pressable>
    </View>
  );
};

export default Statistics;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkBeige,
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    position: "absolute",
    top: 80,
    color: Colors.darkBlue,
  },
  averageAgeText: {
    fontSize: 18,
    color: Colors.darkBlue,
  },

  roundButton: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 30,
    backgroundColor: Colors.darkBlue,
    elevation: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: Colors.lightBlue,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    bottom: 20,
    left: 20,
  },
  plusIcon: {
    fontSize: 30,
    color: Colors.darkBeige,
  },

  genderText: {
    fontSize: 18,
    color: Colors.yellow,
    marginTop: 24,
  },

  pieBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 100,
  },

  averageAgeBox: {
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
});
