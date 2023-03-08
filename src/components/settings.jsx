import { View, Text, StyleSheet, Alert, ToastAndroid } from "react-native";
import { useState } from "react";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSelector,useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlicer";
import { useTheme } from "@react-navigation/native";

const Settings = () => {
    const dispatch = useDispatch();
    const theme = useSelector(s => s.theme.name);
    const [darkTheme, setDarkTheme] = useState(theme === "dark" ? true : false);
    const { colors } = useTheme();

    const handleToggleTheme = () => {
        setDarkTheme(theme => !theme)
        dispatch(toggleTheme())
    }

    const handleDeleteAccount = () => {
        Alert.alert("Delete Account", "Are you sure to delete this account?", [{
            text: "Delete",
            onPress: () => {
                ToastAndroid.show("Account deleted sucessfully!", ToastAndroid.SHORT)
            },
        }, {
            text: "Cancel",
            onPress: () => false,
        }], {cancelable: true, onDismiss: () => false},);
    }

    return (
        <View style={styles.container}>
            <View style={{...styles.settingContainer, backgroundColor: colors.card }}>
                <View style={styles.textContainer}>
                    <MaterialCommunityIcons name="theme-light-dark" size={24} color={colors.text} />
                    <Text style={{...styles.settingsText, color: colors.text}}>
                        Dark Theme
                    </Text>
                </View>
                <FontAwesome name={darkTheme ? "toggle-on" : "toggle-off"} 
                    size={40} style={styles.toggler}
                    color={colors.text}
                    onPress={handleToggleTheme} />
            </View>
            <View style={{...styles.settingContainer, backgroundColor: colors.card }}>
                <View style={styles.textContainer}>
                    <Feather name="alert-triangle" size={24} color={colors.text} />
                    <Text style={{...styles.settingsText, color: colors.text}}>Delete Account</Text>
                </View>
                <MaterialIcons name="delete" color={colors.text}
                    size={40} style={styles.deleteBtn}
                    onPress={handleDeleteAccount}
                     />
            </View>
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
    },
    settingsText: {
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 4,
    },
    textContainer:{
        flexDirection: "row",
        alignItems: "baseline"
    },
})
export default Settings;