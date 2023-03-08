import { View, Text, StyleSheet, TextInput, Button, ToastAndroid } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { editProfile } from "../features/profile/profileSlicer";
import { useTheme } from "@react-navigation/native";

const EditProfile = ({closeModal}) => {
    const dispatch = useDispatch();
    const profile = useSelector(s => s.profile.data);
    const [displayName, setDisplayName] = useState(profile.user.displayName ? profile.user.displayName : '');
    const [caption, setCaption] = useState(profile.caption ? profile.caption : '');
    const { colors } = useTheme();

    const handleSubmit = () => {
        dispatch(editProfile({caption, displayName}))
        closeModal();
        ToastAndroid.show("Profile updated successfully!", ToastAndroid.SHORT)
    }
   
    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <FontAwesome name="edit" size={24} color={colors.text} />
                    <Text style={{...styles.headerText, color: colors.text}}>Edit Profile</Text>
                </View>
                <Ionicons name="close-sharp" color={colors.text} size={30} onPress={closeModal} 
                    style={styles.closeBtn} />
            </View>
            <View style={styles.editContainer}>
                <TextInput style={{...styles.textInput, color: colors.text}} 
                    placeholder="Set your display name."
                    value={displayName} 
                    onChangeText={setDisplayName} />
                <TextInput style={{...styles.textInput, color: colors.text}} 
                    placeholder="Set your caption."
                    value={caption} 
                    onChangeText={setCaption} />
                <Button title="Save Changes" onPress={handleSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer:{
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    container: {
        flex: 1,
    },
    editContainer:{
        marginTop: 45, // 30 + 10,
        padding: 10,
    },
    headerText:{
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 4,
    },
    headerTextContainer:{
        flexDirection: "row",
        alignItems: "center"
    },
    textInput:{
        borderBottomWidth: 1,
        borderColor: "lightgrey",
        paddingVertical: 5,
        marginVertical: 5,
    },
})
 
export default EditProfile;