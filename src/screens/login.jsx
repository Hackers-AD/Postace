import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Formik } from "formik";
import { AntDesign } from '@expo/vector-icons';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginGoogleUser } from "../features/auth/authSlicer";
import { useTheme } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const auth = useSelector(s => s.auth);
    const { colors } = useTheme();

    const initialState = {
        email: '',
        password: '',
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Valid email is required').required('* This is a required field'),
        password: Yup.string().min(6, 'Too short!').required('* This is a required field'),
    });

    const handleSubmit = (data) => {
        dispatch(loginUser(data));
    }
    
    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <Image source={require('../../assets/logo1.png')} style={styles.image} />
            <Text style={{...styles.navText, color: colors.text}}>Postace</Text>
            <Formik
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}>
            {({handleChange, handleSubmit, values, errors, touched }) => (
                <View style={{...styles.formContainer, backgroundColor: colors.card}}>
                    <Text style={{...styles.errorText}}>{auth.loginError}</Text>
                    <Text style={{color: colors.text, marginTop: 5, fontWeight: "bold", textTransform: "uppercase"}}>Email </Text>
                    <TextInput style={{...styles.textInput, color: colors.text}}
                        placeholder="Email address"
                        placeholderTextColor={colors.border}
                        value={values.email}
                        onChangeText={handleChange('email')} />
                    {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <Text style={{color: colors.text, marginTop: 5, fontWeight: "bold", textTransform: "uppercase"}}>Password </Text>
                    <TextInput style={{...styles.textInput, color: colors.text}}
                        placeholder="Password"
                        placeholderTextColor={colors.border}
                        value={values.password}
                        onChangeText={handleChange('password')} />
                    {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    <View style={{marginTop: 10,}}></View>
                    <View>
                        <Button title="Log In" onPress={handleSubmit} />
                    </View>
                    <View style={styles.row}>
                        <Text style={{fontWeight: "bold", color: colors.text}}>OR</Text>
                    </View>
                    <View style={styles.flexBtn}>
                        <View style={styles.flexBtnBtn}>
                            <Button title="Sign Up with Email" color='purple' onPress={() => navigation.navigate('register')} />
                        </View>
                    </View>
                </View>
            )}
            </Formik>
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        fontSize: 13,
        color: "red",
        fontStyle: 'italic',
        paddingVertical: 1,
    },
    formContainer:{
        width: "100%",
        padding: 15,
    },
    flexBtn: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: 7,
    },
    flexBtnBtn:{
        flex: 5,
    },
    image: {
        width: 110,
        height: 110,
    },
    navText: {
        fontSize: 30,
        marginTop: 2, 
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
    },
    textInput:{
        borderBottomWidth: 2,
        borderColor: 'darkgrey',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 4,
        fontSize: 17,
    }
})
 
export default LoginScreen;