
import { Text, FlatList, View, ScrollView, Image, StyleSheet, Modal, Pressable} from "react-native";
import { Dimensions, ToastAndroid } from "react-native";
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import { delPost, likePost, getAllPosts } from "../features/post/postSlicer";
import { useState } from "react";
import { setNotify } from "../features/notify/notifySlicer";
import ViewPost from "./viewPost";
import { useNavigation, useTheme } from "@react-navigation/native";
import Profile from "./profile";
import { useEffect } from "react";

const Posts = ({posts, HeadComponent}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { colors } = useTheme();
    const auth = useSelector(s => s.auth);
    const poststatus = useSelector(s => s.post.status);
    const profiles = useSelector(s => s.profile.profiles);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [curImage, setcurImage] = useState('');
    const [viewPost, setViewPost] = useState(null);
    const [curUser, setCurUser] = useState(null);

    const handleDelPost = (post) => {
        dispatch(delPost(post));
        ToastAndroid.show('Post deleted successfully!', ToastAndroid.SHORT);
    }
    const handleLikePost = (item) => {
        dispatch(likePost(item.id));
        dispatch(setNotify({rid: item.uid, likedpost: item}))
    }

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getAllPosts());
        setRefreshing(false)
    }

    const handleShowCurImage = (uri) => {
        setcurImage(uri);
        setImageModal(true)
    }
    const handleShowProfile = (user) =>{
        if(user.uid === auth.user.uid){
            navigation.navigate('profile')
        }else{
            setCurUser(user)
            setProfileModal(true);
        }
    }
    return (
        <View style={styles.mainContainer}>
            <Modal visible={profileModal} onRequestClose={() => setProfileModal(false)} >
                <View style={{padding: 10, flexDirection: "row", alignItems: "center", backgroundColor: colors.card}}>
                    <Ionicons name="arrow-back" size={40} color={colors.text} onPress={() => setProfileModal(false)} />
                    <Text style={{fontWeight: "bold", fontSize: 18, color: colors.text}}>
                        {curUser ? curUser.displayName ? curUser.displayName : curUser.email.substring(0, 10): null}
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
                    post={viewPost ? posts.filter(post => post.id == viewPost.id)[0] : viewPost} 
                    closeModal={() => setModalVisible(!modalVisible)}  />
            </Modal>

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

            <FlatList data={posts}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={HeadComponent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyPostContainer}>
                        <Feather name="alert-circle" size={20} color={colors.text} />
                        {poststatus === "success" ?
                        <Text style={{...styles.noAnyPostText, color: colors.text}}>No any posts! </Text>
                    : <Text style={{...styles.noAnyPostText, color: colors.text}}>LOADING... </Text>}  
                    </View>
                )}
                renderItem={({item}) => (
                <Pressable style={{...styles.postContainer, backgroundColor: colors.card, borderColor: colors.border}} 
                    onPress={() => {
                        setModalVisible(!modalVisible)
                        setViewPost(item)     
                    }} >
                    <View style={styles.postHeader}>
                        {profiles.map(profile => {
                            if(profile.user.uid === item.uid){
                                return (
                                <View style={styles.postHeaderLeft} key={profile.id}>
                                    <Pressable onPress={() => handleShowProfile(profile.user)}>
                                        <Image source={{uri: profile.pp}} style={styles.ppImg} />
                                    </Pressable>
                                    <View>
                                        <Pressable onPress={() => handleShowProfile(profile.user)}>
                                            <Text style={{...styles.postUser, color: colors.text}}>
                                                {profile.user.displayName ? profile.user.displayName : 
                                                profile.user.email.substring(0, 10)}
                                            </Text>
                                        </Pressable>
                                        <Text style={{...styles.dateText, color: colors.text}}>
                                            {item.time+ '  ' +item.date}
                                        </Text> 
                                    </View>
                                </View>
                                )
                            }
                        })} 
                        <View style={styles.postHeaderLeft}>
                            {item.uid === auth.user.uid ?
                                <Ionicons name="close-sharp" color={'red'} size={30} style={styles.postDelIcon}
                                    onPress={() => handleDelPost(item)} />
                            : null}
                        </View>                   
                    </View>
                    <View style={styles.postCaptionContainer}>
                        <Text style={{...styles.postCaption, color: colors.text}}>{item.caption ? item.caption : null}</Text>
                    </View>
                    <View style={styles.postImageContainer}
                        >
                        {item.images.map((image, idx) => {
                            if(idx > 3) return null
                            return(
                            <Pressable key={idx} 
                                onPress={() => {
                                    if(idx === 3 && item.images.length > 4){
                                        setModalVisible(!modalVisible)
                                        setViewPost(item)  
                                    }else{
                                        handleShowCurImage(image)
                                    }
                                }} 
                                style={{position: "relative", alignItems: "center", justifyContent: "center"}}>
                                <Image source={{uri: image}} 
                                    style={{
                                    width: item.images.length === 1 ? 
                                        Dimensions.get("window").width : 
                                        Dimensions.get("window").width/2.1,
                                    height: item.images.length < 3 ? 300: 220,
                                    resizeMode: "cover",
                                    opacity: (idx === 3 && item.images.length > 4) ? 0.4 : 1,
                                    }} />
                                {(idx === 3 && item.images.length > 4) ? 
                                    <View style={{position: "absolute", flexDirection: "column",  alignItems: "center"}}>
                                        <Text style={{marginLeft: 0, fontWeight: "bold", color: colors.text}}>
                                            Show More
                                        </Text>
                                        <Text style={{fontSize: 17, fontWeight: "bold", color: colors.text}}>
                                            ({item.images.length - 4})
                                        </Text>
                                    </View> 
                                : null}
                            </Pressable>
                            )
                        })}
                    </View>
                    <View style={styles.postFooter}>
                        {item.likes.length ? 
                            <Text style={{color: colors.text}}>
                                {item.likes.length + ( item.likes.length === 1 ? " like": " likes")}
                            </Text> 
                        : ''}
                        <View style={styles.likeBtnContainer}>
                            <AntDesign name="heart" size={40} style={styles.likeBtn}
                                color={item.likes.filter(like => like === auth.user.uid).length > 0 ? "red" : colors.text}
                                onPress={() => handleLikePost(item)} />    
                        </View>
                    </View>
                </Pressable>
            )} />
        </View>
    );
}
 
const styles = StyleSheet.create({
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
    dateText: {
        fontSize: 13,
        fontWeight: "bold"
    },
    emptyPostContainer:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    likeBtnContainer:{
        flexDirection: "row",
    },
    mainContainer:{
        flex: 1,
        margin: 5,
    },
    noAnyPostText:{
        fontSize: 16,
        paddingHorizontal: 4,
    },
    postContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 5,
    },
    postCaptionContainer:{
        marginVertical: 4
    },
    postCaption:{
        marginLeft: 5,
    },
    postDelIcon:{
        paddingHorizontal: 5,
    },
    postFooter:{
        margin: 10,
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: 5,
    },
    postHeaderLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    postImage:{ 

    },
    postImageContainer:{
        flexDirection: "row",
        flexWrap: "wrap"
    },
    ppImg: {
        flexWrap: "wrap",
        width: 45,
        height: 45,
        borderRadius: 45,
        marginRight: 4,
    },
    postUser:{
        fontWeight: "bold",
        fontSize: 18,
        paddingVertical: 2,
    }
})

export default Posts;