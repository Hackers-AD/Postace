import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { getAllNotify } from '../features/notify/notifySlicer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';

import Home from '../components/home';
import Profile from '../components/profile';
import Navbar from '../components/navbar';
import Notification from '../components/notification';
import Logout from '../components/logout';
import Settings from '../components/settings';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    const dispatch = useDispatch();
    const posts = useSelector(s => s.post.posts);
    const auth = useSelector(s => s.auth);
    const notifications = useSelector(s => s.notify.notes);
    const unreadNotes = notifications.filter(note => !note.read);
    const { colors } = useTheme();

    useEffect(() => {
        if(auth.user){
            const noteInterval = setInterval(() => {
                dispatch(getAllNotify())
            }, 10000);
            return (() => clearInterval(noteInterval))
        }
    }, [dispatch])

    return (
        <Tab.Navigator screenOptions={({route, navigation}) => ({
                headerTitle: () => <Navbar title={route.name} />,
                headerRight: () => <Logout navigation={navigation} />,
            })}>
            <Tab.Screen name="home" component={Home} options={{
                tabBarIcon: () => (<AntDesign name='home' color={colors.text} size={18} />),
                tabBarBadge: posts.length === 0 ? null : posts.length,
            }} />
            <Tab.Screen name="profile" component={Profile} options={{
                tabBarIcon: () => (<AntDesign name='user' color={colors.text} size={18} />),
            }} />
            <Tab.Screen name="notifications" component={Notification} options={{
                tabBarIcon: () => (<Feather name='bell' color={colors.text} size={18} />),
                tabBarBadge: unreadNotes.length ? unreadNotes.length : null,
            }} />
            <Tab.Screen name="settings" component={Settings} options={{
                tabBarIcon: () => (<Feather name='settings' color={colors.text} size={18} />),
            }} />
            
        </Tab.Navigator>
    );
}

export default HomeScreen;