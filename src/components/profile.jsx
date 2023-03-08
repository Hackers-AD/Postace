import { View, Text, Image, StyleSheet, TextInput, ToastAndroid, ScrollView, Button, Modal,
    Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from "react-native";
import Posts from "./posts";
import { Entypo, AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useCallback } from "react";
import { changeCp,changePp, editInfo, getProfile } from "../features/profile/profileSlicer";
import EditProfile from "./editProfile";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import React from "react";

const Profile = ({navigation, route, user}) => {
    const dispatch = useDispatch();
    const auth = useSelector(s => s.auth);
    const profile = useSelector(s => s.profile.data);
    const posts = useSelector(s => s.post.posts);
    const profileposts = posts.filter(p => p.uid === profile.user.uid)
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [caption, setCaption] = useState(profile.caption ? profile.caption : "");
    const [displayInfo, setDisplayInfo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [curImage, setCurImage] = useState('');
    const { colors } = useTheme();
    
    const pickCpImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.75,
        });
        if(!result.cancelled){
            setCoverImg(result);
        }
    }
    const pickPpImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.75,
        });
        if(!result.cancelled){
            setProfileImg(result);
        }
    }
    const handleSetCp = () => {
        setCoverImg(null);
        dispatch(changeCp({pid: profile.id, img: coverImg}));
        ToastAndroid.show('Cover photo changed successfully!', ToastAndroid.SHORT);
    }
    const handleSetPp = () => {
        setProfileImg(null);
        dispatch(changePp({pid: profile.id, img: profileImg}));
        ToastAndroid.show('Profile photo changed successfully!', ToastAndroid.SHORT);
    }
    const handleInfoEdit = () => {
        setDisplayInfo(s => {
            if(s){
                dispatch(editInfo({caption, pid: profile.id}));
            }
            return !s
        });
    } 
    const showCurrentImage = (uri) => {
        setCurImage(uri);
        setImageModal(true);
    }

    useFocusEffect(
        useCallback(() => {
            if(user){
                dispatch(getProfile(user))
            }else{
                dispatch(getProfile(auth.user))
            }
        }, [user])
    )
    
    const ProfileHead = () => {
        return (
        <View>
           <Modal visible={imageModal} 
                animationType="fade"
                onRequestClose={() => setImageModal(false)}>
                <View style={{...styles.curImageContainer, backgroundColor: colors.card}}>
                    <Image source={{uri: curImage}} style={styles.curImage} />
                    <View style={{position: "absolute", top: 0, right: 0, padding: 10}}>
                        <Ionicons name="close-sharp" size={45} color={colors.text}
                            onPress={() => setImageModal(false)} />
                    </View>
                </View>
            </Modal>

            <View style={styles.profileContainer}>
                <Pressable onPress={() => showCurrentImage(profile.cp)}>
                    <Image source={{uri: coverImg ? coverImg.uri : profile.cp}} 
                        style={styles.coverImage} />
                </Pressable>
                <View style={styles.profileImgContainer}>
                    <View style={styles.ppImgContainer}>
                        <Pressable onPress={() => showCurrentImage(profile.pp)}>
                            <Image source={{uri: profileImg ? profileImg.uri : profile.pp}} 
                                style={styles.profileImg}/>
                        </Pressable>
                        <View style={styles.ppIconContainer}>
                            {!user || auth.user.uid === user.uid  ? 
                            <Entypo name="camera" size={30} color={colors.text} style={styles.ppIcon}
                                onPress={pickPpImage} />
                            : null}
                            {profileImg ? 
                                <AntDesign name="checkcircle" size={30} color={colors.text} 
                                    style={styles.ppIcon} 
                                    onPress={handleSetPp} />
                            : null}
                        </View>
                    </View>
                    <Text style={{...styles.profileName, color: colors.text}}>
                        {profile.user ? profile.user.displayName ? profile.user.displayName : 
                            profile.user.email.substring(0, 10):null}
                    </Text>
                    <View style={styles.infoContainer}>
                        {profile.caption ? 
                            <Text style={{color: colors.text}}>{profile.caption}</Text> 
                        : null}
                    </View>
                </View>
                <View style={styles.cpChangeBtnContainer}>
                    {!user || auth.user.uid === user.uid ? 
                    <Entypo name="camera" size={30} color="white" 
                        onPress={pickCpImage} style={styles.cpIcon} />
                    : null}
                    {coverImg ? 
                        <AntDesign name="checkcircle" size={30} color="white" 
                            onPress={handleSetCp} style={styles.cpIcon} />
                    : null }
                </View>
            </View>
            <View style={styles.editBtncontainer}>
                <Modal transparent={false} visible={showModal} animationType="slide"
                    onRequestClose={() => setShowModal(false)} >
                    <EditProfile closeModal={() => setShowModal(false)} />
                </Modal>
                {!user || auth.user.uid === user.uid  ?
                    <Button title="Edit Profile" onPress={() => setShowModal(true)} />
                : null}
            </View>  
        </View>
        )
    }
    return (
        <React.Fragment>
            <Posts posts={profileposts} HeadComponent={ProfileHead} />
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    captionContainer:{
        paddingVertical: 5,
    },
    coverImage:{
        width: Dimensions.get('window').width,
        height: 200,
    },
    cpChangeBtnContainer:{
        position: "absolute",
        margin: 10,
        flexDirection: "row",
    },
    cpIcon:{
        marginRight: 10,
    },
    curImageContainer:{
        flex: 1,
        position: "relative",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    curImage:{
        width: Dimensions.get("window").width,
        height: 400,
    },
    editBtncontainer:{
        paddingHorizontal: 10,
    },
    infoContainer:{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    infoIcon:{
        marginTop: 5,
    },
    infoIconContainer:{
        flexDirection: "row",
    },
    infoBtnContainer:{
        flexDirection: "row",
        alignSelf: "center"
    },
    InfoBtnPadding:{
        padding: 5,
    },
    inputContainer:{
        flex: 1,
        padding: 10,
    },
    ppImgContainer:{
        
    },
    ppIconContainer:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    ppIcon: {
        marginVertical: 4,
        marginHorizontal: 10,
    },
    profileContainer:{

    },
    profileImg: {
        width: 100,
        height: 100,
        alignSelf: "center",
        borderRadius: 100,
    },
    profileImgContainer:{
        transform: [{translateY: -50}]
    },
    profileName: {
        paddingVertical: 4,
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 20,
    },
    postContainer:{
        marginVertical: 10,
    },
    postsContainer:{
        padding: 10,
    },
    postImage:{
        width: Dimensions.get("window").width - 20,
        height: 300,
    },
    textInput: {
        position: "relative",
        paddingVertical: 4,
        borderBottomWidth: 2,
        borderColor: "grey",
        textAlign: "center",
        width: Dimensions.get("window").width - 30,
        alignSelf: "center",
        zIndex: 999,
    }
})
 
export default Profile;