import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { app } from '../../firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, addDoc, collection, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);
export const loginUser = createAsyncThunk('auth/loginUser', async(data, thunkAPI) => {
    try{
        let user;
        await signInWithEmailAndPassword(auth, data.email, data.password).then(userCredential => {
            user = userCredential.user;
        });
        return user.providerData[0]       
    }catch(error){
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const loginGoogleUser = createAsyncThunk('auth/loginUser', async(data, thunkAPI) => {
    try{
        let user = {
            email: "aneildhakal21@gmail.com",
            password: '072bex05',
            displayName: "Anu Dhakal",
            photoURL: "https://firebasestorage.googleapis.com/v0/b/postace1.appspot.com/o/logo192.png?alt=media&token=b8a4976d-f849-4c1c-abe4-ef484a4312c5"
        }
        return user;
    }catch(err){
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async(data, thunkAPI) => {
    try{
        let user = null;
        await createUserWithEmailAndPassword(auth, data.email, data.password).then(userCredential => {
            user = userCredential.user;
        });
        updateProfile(user, {
            displayName: data.fullName,
            email: data.email,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/postace1.appspot.com/o/logo192.png?alt=media&token=b8a4976d-f849-4c1c-abe4-ef484a4312c5"
        });

        const docRef = await addDoc(collection(db, 'profiles'), {
            user: user.providerData[0],
            cp: "https://firebasestorage.googleapis.com/v0/b/postace1.appspot.com/o/adaptive-icon.png?alt=media&token=f883348a-a66b-417f-b350-dffca8d76ab9",
            pp: "https://firebasestorage.googleapis.com/v0/b/postace1.appspot.com/o/logo192.png?alt=media&token=b8a4976d-f849-4c1c-abe4-ef484a4312c5",
        });
        setDoc(doc(db, 'profiles', docRef.id), {id: docRef.id}, {merge: true});

        return {...user.providerData[0],
            displayName: data.fullName,
            email: data.email,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/postace1.appspot.com/o/logo192.png?alt=media&token=b8a4976d-f849-4c1c-abe4-ef484a4312c5"
        };
    }catch(err){
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const getUser = createAsyncThunk('auth/getUser', async(uid, thunkAPI) => {
    try{
        console.log(getAuth().getUser())
        return {}
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message})
    }
})

export const authSlicer = createSlice({
    name: 'auth',
    initialState: {
        state: 'idle',
        user: null,
        loginError: null,
        registerError: null,
    },
    reducers: {
        logoutUser: (state, action) => {
            state.user = null
            state.status = 'idle'
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'success'
            state.user = action.payload
            state.loginError = null
        }),
        builder.addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed'
            state.loginError = action.payload
        }),
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'success'
            state.user = action.payload
            state.registerError = null
        }),
        builder.addCase(registerUser.rejected, (state, action) => {
            state.status = 'failed'
            state.registerError = action.payload
        })
        builder.addCase(getUser.pending, (state, action) => {
            state.status = 'pending'
            console.log(action.payload)
        }),
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.status = 'success'
            // state.user = action.payload
        }),
        builder.addCase(getUser.rejected, (state, action) => {
            state.status = 'failed'
            console.log(action.payload)
        })
    }
});

export const { logoutUser } = authSlicer.actions
export default authSlicer.reducer