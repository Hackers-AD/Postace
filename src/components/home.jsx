import { View, StyleSheet } from "react-native";
import PostFeed from "./postFeed";
import CreatePost from './creatPost';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Home = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="feed" component={PostFeed} />
            <Stack.Screen name="createpost" component={CreatePost} />
        </Stack.Navigator>
    );
}
 
export default Home;