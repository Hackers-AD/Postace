import { ScrollView,View, Text, StyleSheet, Image, Pressable, Modal} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { likePost } from "../features/post/postSlicer";
import { setNotify } from "../features/notify/notifySlicer";
import { useState } from "react";

const ViewPost = ({ closeModal, post }) => {
    const dispatch = useDispatch();
    const auth = useSelector(s => s.auth);
    const profiles = useSelector(s => s.profile.profiles);
    const profile = profiles.filter(p => p.user.uid === post.uid)[0];
    const [imageModal, setImageModal] = useState(false)
    const [curImage, setcurImage] = useState('')
    const { colors } = useTheme();

    const handleLikePost = (item) => {
        dispatch(likePost(item.id));
        dispatch(setNotify({rid: item.uid, likedpost: item}))
    }
    const handleShowCurImage = (uri) => {
        setcurImage(uri);
        setImageModal(true)
    }

    return (
        <View style={{...styles.container, backgroundColor: colors.card}}>
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
            <View style={styles.postHeaderContainer}>
                <View style={styles.postHeaderLeft}>
                    <Image source={{uri: profile.pp}} style={styles.ppImg} />
                    <View style={styles.postInfo}>
                        <Text style={{...styles.userName, color: colors.text}}>
                            {profile.user.displayName ? profile.user.displayName 
                                : profile.user.email.substring(0, 10)}
                        </Text>
                        <Text style={{fontWeight: "bold", color: colors.text}}>
                            {post.date + '  ' + post.time}
                        </Text>
                    </View>
                </View>
                <View style={styles.closeBtn}>
                    <Ionicons name="close-sharp" size={40} color={colors.text} onPress={closeModal} />
                </View>
            </View>
            <ScrollView>
                <View style={{...styles.postCapContainer}}>
                    <Text style={{color: colors.text}}>{post.caption}</Text>
                </View>
                <View style={styles.postImgContainer}>
                    {post.images.map((image, idx) => (
                        <Pressable key={idx} onPress={() => handleShowCurImage(image)}>
                            <Image source={{uri: image}} style={styles.postImage} />
                        </Pressable>
                    ))}
                </View>
                <View style={styles.postFooter}>
                    {post.likes.length ? 
                        <Text style={{color: colors.text}}>{post.likes.length + 
                            ( post.likes.length === 1 ? " like": " likes")}
                        </Text> 
                    : ''}
                    <View style={styles.likeBtnContainer}>
                        <AntDesign name="heart" size={40} style={styles.likeBtn}
                            color={post.likes.filter(like => like === auth.user.uid).length > 0 
                                ? "red" : colors.text}
                                onPress={() => handleLikePost(post)} />    
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    closeBtn: {
        
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
    postCapContainer:{
       paddingVertical: 5,
       paddingHorizontal: 10,
    },
    postFooter:{
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    postHeaderContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    postHeaderLeft:{
        flexDirection: "row",
        alignItems: "center",
    },
    postInfo:{
        marginLeft: 5,
    },
    postImage:{
        width: Dimensions.get("window").width,
        height: 300,
        marginVertical: 5,
    },
    ppImg: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold"
    },
})
 
export default ViewPost;