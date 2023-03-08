import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlicer';
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

const Logout = ({navigation}) => {
    const dispatch = useDispatch();
    const auth = useSelector(s => s.auth);
    const { colors } = useTheme();

    const handleLogout = () => {
        dispatch(logoutUser());
    }

    return (
        <View style={styles.container}>
            {auth.user ? 
            <>
                <AntDesign name='logout' size={25} color={colors.text}
                    onPress={handleLogout}
                    style={{marginRight: 25,}} /> 
                <AntDesign name='pluscircleo' size={25} color={colors.text}
                onPress={() => navigation.navigate('createpost')}
                style={{marginRight: 25,}} /> 
            </>
        : null}
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    }
})
export default Logout;