import { View, Text, ScrollView, StyleSheet, TextInput,
    Button, Image, ToastAndroid, Modal, Dimensions, TouchableOpacity} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useRef } from "react";
import { createPost } from "../features/post/postSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Entypo, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { useTheme } from "@react-navigation/native";

const CreatePost = ({navigation}) => {
    const dispatch = useDispatch();
    const profile = useSelector(s => s.profile.data);
    const [disableBtn, setDisableBtn] = useState(true);
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState('');
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [curImage, setCurImage] = useState('');
    const [cameraType, setCameraType] = useState(CameraType.back);
    const cameraRef = useRef();
    const { colors } = useTheme();

    const handleSubmit = () => {
        dispatch(createPost({caption, images}))
        setImages([]);
        setCaption('');
        ToastAndroid.show('Post created successfully!', ToastAndroid.SHORT);
        navigation.navigate('feed', {message: 'Post created sucessfully.'})
    }

    const pickImage = async() => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [1, 1],
            quality: 0.8,
            allowsMultipleSelection: true,
            selectionLimit: 5,
        });

        if(!result.cancelled){
            if(result.selected){
                setImages(s => ([...s, ...result.selected]));
            }else{
                setImages(s => ([...s, result]));
            }
        }
    }
    const handleCancelImage = (img) => {
        setImages(s => (s.filter(image => image !== img)));
    }
    
    const handleCamera = async() => {
        const { status } = await Camera.requestCameraPermissionsAsync(); 
        console.log(status)
        if(status === "granted"){
            setShowCameraModal(true);
        }else{
            console.log('Camera permission denied.')
        }
    }
    const handleCapture = async() => {
        const options = {quality: 0.4, base64: false, skipProcessing: true}
        const data = await cameraRef.current.takePictureAsync(options)
        setImages(imgs => [...imgs, data])
        setShowCameraModal(false);
    }
    const handleCameraFlip = () => {
        setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
    const handleShowCurImage = (uri) => {
        setCurImage(uri)
        setImageModal(true);
    }

    useEffect(() => {
        if(images.length > 0){
            setDisableBtn(false)
        }else if(caption.trim().length){
            setDisableBtn(false)
        }else{
            setDisableBtn(true)
        }
    }, [images, caption]);

    return (
        <View style={{...styles.card, backgroundColor: colors.card, borderColor: colors.border}}>
            <Modal visible={showCameraModal} animationType="slide"
                onRequestClose={() => setShowCameraModal(false)} >
                <Camera type={cameraType} ref={cameraRef}
                    style={styles.cameraContainer}
                    zoom={0} autoFocus={true}
                    ratio="16:9" >
                    <View style={{flexDirection: "row", justifyContent: "space-between", padding: 10,}}>
                        <Ionicons name="close-sharp" size={35} color="white"
                            onPress={() => setShowCameraModal(false)} />
                        <MaterialCommunityIcons name="camera-flip-outline" size={35} color="white"
                            onPress={handleCameraFlip}/>
                    </View>
                    <View style={styles.cameraBtnContainer}>
                        <Entypo name="camera" size={45} color="white" style={{alignSelf: "center"}}
                            onPress={handleCapture} />
                    </View>
                </Camera>
            </Modal>
            <Modal visible={imageModal} animationType="slide" onRequestClose={() => setImageModal(false)}>
                <View style={styles.curImageContainer}>
                    <Image source={{uri: curImage}} style={styles.curImage} />
                    <Ionicons name="close-sharp" size={45} color="white"
                            style={{position: "absolute", padding: 10, right: 0,}}
                            onPress={() => setImageModal(false)} />
                </View>
            </Modal>
            
            <View style={{...styles.cardHeader, borderColor: colors.border}}>
                <View style={styles.cardHeaderLeft}>
                    <View>
                        <Image source={{uri: profile.pp}} style={styles.ppImg} />
                    </View>
                    <Text style={{...styles.headerText, color: colors.text}}>Create Post</Text>
                </View>
                <View>
                    {images.length > 3 ? 
                        <Button title="Clear All" color="" onPress={() => setImages([])} /> 
                    : null}
                </View>
            </View>
            <ScrollView style={styles.scrollContainer}
                keyboardShouldPersistTaps="handled" >
                <View style={styles.postImageContainer}>
                    {images.length > 0 ? 
                        images.map((img, idx) => (
                            <View key={idx} style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => handleShowCurImage(img.uri)}>
                                    <Image source={{uri: img.uri}} style={styles.postImage} />
                                </TouchableOpacity>
                                <Ionicons name="close-sharp" size={40} style={styles.imageCancelBtn}
                                    onPress={() => handleCancelImage(img)} />
                            </View>
                        ))
                    : null}
                </View>
                <View style={styles.formContainer}>
                    <TextInput style={{...styles.textInput, color: colors.text}} multiline={true} numberOfLines={1}
                        placeholder='What your status!'
                        placeholderTextColor={colors.text}
                        value={caption}
                        onChangeText={setCaption} />
                    <View style={styles.postIconcontainer}>
                        <FontAwesome name="image" size={30} style={styles.postIcon} onPress={pickImage}  />
                        <Entypo name="camera" size={30} style={styles.postIcon} onPress={handleCamera}  />
                    </View>
                    <View style={styles.postBtnContainer}>
                        <Button title="Post" color={'purple'} onPress={handleSubmit} disabled={disableBtn}></Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    cameraBtnContainer:{
        width: Dimensions.get("window").width,
        position: "absolute",
        bottom: 0,
        paddingVertical: 10,
    },
    card: {
        borderWidth: 2,
        borderRadius: 10,
        margin: 5,
        marginBottom: 35,
    },
    cardHeader: {
        padding: 8,
        borderWidth: 1, 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    cardHeaderLeft:{
        flexDirection: "row",
        alignItems: "center",
    },
    curImageContainer:{
        padding: 10,
    },
    curImage:{
        width: Dimensions.get("window").width - 20,
        height: Dimensions.get("window").height - 20,
    },
    imageCancelBtn: {
        position: "absolute",
        padding: 1,
        color: "white",
    },
    imageContainer: {
        position: "relative"
    },
    formContainer: {
        padding: 10,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 17,
        marginLeft: 5,
    },
    postBtn: {

    },
    postBtnContainer: {
        marginVertical: 10,
    },
    postIcon: {
        marginRight: 15,
        color: "grey",
    },
    postIconcontainer:{
        flex: 1,
        flexWrap: "wrap",
        marginVertical: 10,
        flexDirection: "row",
    }, 
    postImage: {
        width: 120,
        height: 120,
    },
    postImageContainer:{
        flexDirection: "row",
        margin: 4,
        flexWrap: "wrap",
    },
    ppImg:{
        width: 30,
        height: 30,
        borderRadius: 40,
    },
    scrollContainer:{

    },
    textInput:{
        padding: 7,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    }
})
export default CreatePost;