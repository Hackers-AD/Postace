import { NavigationContainer, DefaultTheme, DarkTheme, useTheme} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "./features/profile/profileSlicer";
import { useEffect } from "react";

import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import RegisterScreen from "./screens/register";
import Navbar from "./components/navbar";

const Stack = createNativeStackNavigator();

const AppHome = () => {
    const dispatch = useDispatch();
    const theme = useSelector(s => s.theme.name);
    const auth = useSelector(s => s.auth);
    const { colors } = useTheme();

    useEffect(() => {
        dispatch(getProfile(auth.user));
    }, [dispatch, auth]);

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            primary: 'rgb(255, 45, 85)',
            background: 'rgb(242, 242, 242)',
            card: 'rgb(255, 255, 255)',
            text: 'rgb(28, 28, 30)',
            border: 'rgb(199, 199, 204)',
            notification: 'rgb(255, 69, 58)',
            error: "red",
        },
        dark: false,
    };
    return (
        <NavigationContainer theme={theme === "light" ? MyTheme : DarkTheme} >
            <Stack.Navigator screenOptions={({route}) => ({
                headerTitle: () => (<Navbar title={route.name} />),
                headerTitleStyle:{
                    color: colors.text
                },
            })}>
                {auth.user ?
                    <Stack.Screen name="homescreen" component={HomeScreen} options={{
                        headerShown: false
                    }} />
                :
                    <>                    
                    <Stack.Screen name="login" component={LoginScreen} options={{
                        title: "Postace LOGIN".toUpperCase(),
                    }} />
                    <Stack.Screen name="register" component={RegisterScreen} options={{
                        title: "Postace Account".toUpperCase(),
                    }} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}
 
export default AppHome;