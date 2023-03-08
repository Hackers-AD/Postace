import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "../features/auth/authSlicer";
import PostReducer from "../features/post/postSlicer";
import ProfileReducer from "../features/profile/profileSlicer";
import NotifyReducer from "../features/notify/notifySlicer";
import ThemeReducer from "../features/theme/themeSlicer";
import { persistReducer, persistStore, 
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'theme', 'post', 'profile', 'notify'],
}

const reducers = combineReducers({
    auth: AuthReducer,
    post: PostReducer,
    profile: ProfileReducer,
    notify: NotifyReducer,
    theme: ThemeReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // action
                ignoredActionPaths: ['payload', 'meta.arg'], //payload
                ignoredPaths: [`post.posts`,] //state
            },
        }),
})

export const persistor = persistStore(store);