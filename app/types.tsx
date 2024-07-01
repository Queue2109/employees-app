import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

export type Employee = {
    id?: string;
    name: string;
    last_name: string;
    age: number;
    gender: 'M' | 'F';
  }

export type RootStackParamList = {
  Home: undefined;
  EditCreate: { employeeId?: string; create: boolean };
  Statistics: {employees: Employee[]};
};
  
export type HomeNavigationProp = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type EditCreateNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditCreate'>;
export type StatisticsNavigationProp = NativeStackScreenProps<RootStackParamList, 'Statistics'>;

