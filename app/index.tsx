import { Link } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function App() {
    return (
        <View style={styles.container}>
            <Link replace href="/home">Home</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

