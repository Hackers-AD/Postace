import { View, Image, Text, StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native';

const Navbar = ({title}) => {
    const { colors } = useTheme();
    return (
        <View style={styles.navContainer}>
            <View style={styles.brandContainer}>
                <Image source={require('../../assets/logo1.png')} style={styles.navImage} />
                <Text style={{...styles.navText, color: colors.text}}>
                    {title ? title === 'home' ? 'Post Feed'.toUpperCase(): title.toUpperCase(): ''}
                </Text>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
    brandContainer: {
        flexDirection: 'row',
        alignItems: "center",
    },
    navContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
    },
    navImage: {
        width: 30,
        height: 30,
        marginRight: 4,
    },
    navText: {
        fontWeight: 'bold',
    }
});
 
export default Navbar;