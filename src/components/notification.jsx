import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Modal, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getNoteProfiles } from "../features/profile/profileSlicer";
import { delNote, getAllNotify, readNote } from "../features/notify/notifySlicer";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFocusEffect, useTheme, useNavigation } from "@react-navigation/native";
import ViewPost from './viewPost';
import Profile from "./profile";

const Notification = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const notify = useSelector(s => s.notify);
    const auth = useSelector(s => s.auth);
    const posts = useSelector(s => s.post.posts);
    const notifications = useSelector(s => s.notify.notes);
    const noteprofiles = useSelector(s => s.profile.noteprofiles);
    const [modalVisible, setModalVisible] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [viewPost, setViewPost] = useState(null);
    const [curUser, setCurUser] = useState(null);
    const { colors } = useTheme();

    useEffect(() => {
        dispatch(getNoteProfiles(notifications));
    }, [dispatch, notifications]);

    useFocusEffect(() => {
        dispatch(readNote(notifications));
    })
    
    const handleRefresh = () => {
        dispatch(getAllNotify());
    }

    const handleDelNote = (note) => {
        dispatch(delNote(note))
    }

    const handleViewPost = (pid) => {
        setViewPost(pid);
        setModalVisible(true);
    }

    const handleShowProfile = (uid) =>{
        if(uid === auth.user.uid){
            navigation.navigate('profile')
        }else{
            setCurUser({uid})
            setProfileModal(true);
        }
    }
    
    return (
        <>
        <Modal visible={profileModal} onRequestClose={() => setProfileModal(false)} >
            <View style={{padding: 10, flexDirection: "row", alignItems: "center", backgroundColor: colors.card}}>
                <Ionicons name="arrow-back" size={40} color={colors.text} onPress={() => setProfileModal(false)} />
                <Text style={{fontWeight: "bold", fontSize: 18, color: colors.text}}>
                    {curUser ? curUser.displayName ? curUser.displayName : 
                    curUser.email ? curUser.email.substring(0, 10): curUser.uid.substring(0, 10): null}
                </Text>
            </View>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <Profile user={curUser} />
            </View>
        </Modal>
        <Modal animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)} >
            <ViewPost 
                post={viewPost ? posts.filter(p => p.id === viewPost)[0] : null}
                closeModal={() => setModalVisible(!modalVisible)}  />
        </Modal>
        <FlatList data={notifications} keyExtractor={item => item.id} 
            onRefresh={handleRefresh}
            refreshing={false}
            ListEmptyComponent={() => (
                <View style={styles.emptyNoteContainer}>
                    <Feather name="alert-circle" size={20} color={'purple'} />
                    {notify.status === "success" ?
                        <Text style={styles.noNoteText}>No any notifications! </Text>
                    : <Text style={styles.noNoteText}>LOADING... </Text>}
                </View>
            )}
            renderItem={({item}) => (
                <Pressable 
                    style={{...styles.listItem, borderLeftWidth: 15, backgroundColor: colors.card,
                    borderLeftColor: (item.read) ? 'grey' : 'purple'}}
                    onPress={() => handleViewPost(item.pid)}>
                    {noteprofiles.map((profile, idx) => {
                        if(profile.user.uid === item.sid){
                            return(
                            <View style={styles.listItemLeft} key={idx}>
                                <Pressable onPress={() => handleShowProfile(item.sid)}>
                                    <Image source={{uri: profile.pp}} style={styles.ppImg} />  
                                </Pressable>
                                <View style={styles.noteMessage}>
                                    <View style={styles.userNameContainer}>
                                        <Pressable onPress={() => handleShowProfile(item.sid)}>
                                            <Text style={{...styles.userName, color: colors.text}}>
                                                {profile.user.displayName ? profile.user.displayName 
                                                    : profile.user.email.substring(0, 10)}
                                            </Text>
                                        </Pressable>
                                        <Text style={{color: colors.text}}>{item.message}</Text>
                                    </View>
                                    <Text style={{color: colors.text}}>{item.date + '  ' + item.time}</Text>
                                </View>
                            </View>
                            )
                        }
                    })}
                    <View>
                        <Ionicons name="close-sharp" color={'red'} size={30} style={styles.noteDelBtn}
                            onPress={() => handleDelNote(item)} />
                    </View>
                </Pressable>
            )} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyNoteContainer:{
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    listItem: {
        marginVertical: 1,
        paddingHorizontal: 10,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    listItemLeft:{
        flexDirection: "row",
        alignItems: "center"
    },
    noNoteText:{
        paddingHorizontal: 4,
        fontSize: 16,
        color: "purple"
    },
    noteMessage:{
        paddingLeft: 4,
    },
    noteDelBtn:{
        paddingRight: 10,
    },
    ppImg:{
        width: 60,
        height: 60,
        borderRadius: 60,
    },
    userName:{
        fontWeight: "bold",
        paddingRight: 5,
        fontSize: 16,
    },
    userNameContainer:{
        flexDirection: "row",
        alignItems: "center"
    }
})
 
export default Notification;