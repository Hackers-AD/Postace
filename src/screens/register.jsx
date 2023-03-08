import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Formik } from "formik";
import { AntDesign } from '@expo/vector-icons';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlicer";
import { styles } from './login';
import { useTheme } from "@react-navigation/native";

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();

    const initialState = {
        email: '',
        password: '',
        fullName: '',
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required('* This is a required field'),
        password: Yup.string().min(6, 'Too short!').required('* This is a required field'),
        fullName: Yup.string(),
    });

    const handleSubmit = (data) => {
        dispatch(registerUser(data));
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo1.png')} style={styles.image} />
            <Text style={{...styles.navText, color: colors.text}}>Postace</Text>
            <Formik
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
                <View style={{...styles.formContainer,  backgroundColor: colors.card}}>
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

                    <Text style={{color: colors.text, marginTop: 5, fontWeight: "bold", textTransform: "uppercase"}}>Full Name </Text>
                    <TextInput style={{...styles.textInput, color: colors.text}}
                        placeholder="Full name"
                        placeholderTextColor={colors.border}
                        value={values.fullName}
                        onChangeText={handleChange('fullName')} />
                    {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    <View style={{marginTop: 10,}}></View>
                    <View>
                        <Button title="Create Account" onPress={handleSubmit} />
                    </View>
                    <View style={styles.row}>
                        <Text style={{fontWeight: "bold", color: colors.text}}>OR</Text>
                    </View>
                    <View style={styles.flexBtn}>
                        <View style={styles.flexBtnBtn}>
                            <Button title="Log In" color='purple' onPress={() => navigation.navigate('login')} />
                        </View>
                    </View>
                </View>
            )}
            </Formik>
        </View>
    );
}
 
export default RegisterScreen;