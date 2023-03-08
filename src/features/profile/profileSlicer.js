import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { app } from '../../firebase';
import { getFirestore, getDocs, query, collection, where, setDoc, doc, getDoc} from "firebase/firestore";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);
export const getProfile = createAsyncThunk('profile/getProfile', async(user, thunkAPI) => {
    try{
        const q = query(collection(db, "profiles"), where("user.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        let profile = {}
        querySnapshot.forEach((doc) => {
            profile = doc.data();
        });
        
        return profile
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});
export const changeCp = createAsyncThunk('profile/changeCp', async({pid, img}, thunkAPI) => {
    try{
        let fileName = img.uri.split('/ImagePicker/').pop();
        let storageRef = ref(storage, 'profiles/' + fileName);
        let res = await fetch(img.uri);
        let blob = await res.blob();
        let image = new File([blob],fileName, {type: 'image/' + fileName.split('.').pop()})
        uploadBytes(storageRef, image).then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setDoc(doc(db, 'profiles', pid), {cp: downloadURL}, {merge: true})
            });
        })  
        return {...thunkAPI.getState().profile.data, cp: img.uri}
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const changePp = createAsyncThunk('profile/changePp', async({pid, img}, thunkAPI) => {
    try{
        let fileName = img.uri.split('/ImagePicker/').pop();
        let storageRef = ref(storage, 'profiles/' + fileName);
        let res = await fetch(img.uri);
        let blob = await res.blob();
        let image = new File([blob],fileName, {type: 'image/' + fileName.split('.').pop()})
        uploadBytes(storageRef, image).then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setDoc(doc(db, 'profiles', pid), {pp: downloadURL}, {merge: true})
            });
        });

        return {...thunkAPI.getState().profile.data, pp: img.uri}
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const editInfo = createAsyncThunk('profile/editInfo', async(data, thunkAPI) => {
    try{
        setDoc(doc(db, 'profiles', data.pid), {caption: data.caption}, {merge: true});
        return data.caption;       
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const editProfile = createAsyncThunk('profile/editProfile', async({caption, displayName}, thunkAPI) => {
    try{
        let profile = await thunkAPI.getState().profile.data;
        setDoc(doc(db, 'profiles',profile.id), {caption, user:{displayName}}, {merge: true});
        return {caption, displayName};       
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const getAll = createAsyncThunk('profile/getAll', async(posts, thunkAPI) => {
    try{
        let users = Array.from(new Set(posts.map((item) => item.uid)))
        let profiles = [];
        for(let uid of users){
            const q = query(collection(db, "profiles"), where("user.uid", "==", uid));
            const querySnapshot = await getDocs(q);
            let profile;
            querySnapshot.forEach((doc) => {
                profile = doc.data();
            });
            profiles.push(profile)
        }
        return profiles
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const getNoteProfiles = createAsyncThunk('profile/getNoteProfiles', async(notes, thunkAPI) => {
    try{
        let users = Array.from(new Set(notes.map((item) => item.sid)))
        let profiles = [];
        for(let uid of users){
            const q = query(collection(db, "profiles"), where("user.uid", "==", uid));
            const querySnapshot = await getDocs(q);
            let profile;
            querySnapshot.forEach((doc) => {
                profile = doc.data();
            });
            profiles.push(profile)
        }
        return profiles
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message});
    }
});

export const profileSlicer = createSlice({
    name: 'profile',
    initialState: {
        status: "idle",
        data: {},
        error: null,
        profiles: [],
        noteprofiles:[], 
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(getProfile.fulfilled, (state, action) =>{
            state.status = "success"
            state.data = action.payload
        })
        builder.addCase(getProfile.rejected, (state, action) =>{
            state.status = "failed"
            console.log(action.payload)
        })
        builder.addCase(changeCp.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(changeCp.fulfilled, (state, action) =>{
            state.status = "success"
            state.data = action.payload
        })
        builder.addCase(changeCp.rejected, (state, action) =>{
            state.status = "failed"
            console.log(action.payload)
        })
        builder.addCase(changePp.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(changePp.fulfilled, (state, action) =>{
            state.status = "success"
            state.data = action.payload
        })
        builder.addCase(changePp.rejected, (state, action) =>{
            state.status = "failed"
            console.log(action.payload)
        })
        builder.addCase(editInfo.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(editInfo.fulfilled, (state, action) =>{
            state.status = "success"
            state.data = {...state.data, caption: action.payload}
        })
        builder.addCase(editInfo.rejected, (state, action) =>{
            state.status = "failed"
            state.data = {...state.data, caption: action.payload}
        })
        builder.addCase(editProfile.fulfilled, (state, action) =>{
            state.status = "success"
            state.data = {...state.data, caption: action.payload.caption, 
                user: {...state.data.user, displayName: action.payload.displayName}}
        })
        builder.addCase(getAll.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(getAll.fulfilled, (state, action) =>{
            state.status = "success"
            if(state.profiles.length !== action.payload.length){
                state.profiles = action.payload
            }
            
        })
        builder.addCase(getAll.rejected, (state, action) =>{
            state.status = "failed"
            console.log(action.payload)
        })
        builder.addCase(getNoteProfiles.pending, (state, action) =>{
            state.status = "pending"
        })
        builder.addCase(getNoteProfiles.fulfilled, (state, action) =>{
            state.status = "success"
            state.noteprofiles = action.payload
        })
        builder.addCase(getNoteProfiles.rejected, (state, action) =>{
            state.status = "failed"
            console.log(action.payload)
        })
    }
});

export default profileSlicer.reducer;