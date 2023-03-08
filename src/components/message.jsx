import { View, Text, StyleSheet, TextInput, FlatList, Image } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { useSelector } from "react-redux";

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const auth = useSelector(s => s.auth);

    const handleSubmit = () => {
        setMessages(msg => ([...msg, message]));
        setMessage('');
    }

    return (
        <View style={styles.container}>
            <FlatList style={styles.msgContainer} keyExtractor={(item) => item.id} data={messages} renderItem={({item, idx}) => (
                <View key={idx} style={styles.message}>
                    <Image source={{uri: auth.user.photoURL}} style={styles.ppImg} />
                    <View>
                        <Text style={styles.msgText}>{item}</Text>
                    </View>
                </View>
            )}
            />
            <View style={styles.footer}>
                <TextInput placeholder="Type a message" style={styles.msgInput}
                    value={message}
                    onChangeText={setMessage} />
                <Feather name="send" size={24} style={styles.sendBtn} onPress={handleSubmit} />
            </View>
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        margin: 10,
        marginBottom: 4,
    },
    footer: {
        position: "absolute",
        flexWrap: "wrap",
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 20,
        padding: 10,
    },
    message: {
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    msgInput: {
        width: "92%",
        paddingHorizontal: 4,
    },
    msgContainer: {
        height: "80%",
    },
    msgText: {
        paddingLeft: 4,
    },
    ppImg: {
        width: 35,
        height: 35,
    },
    sendBtn: {
        
    }
});

export default Message;