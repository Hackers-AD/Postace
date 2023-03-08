import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { app } from '../../firebase';
import { getFirestore, getDocs, addDoc, query, setDoc, collection, where, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(app);
export const setNotify = createAsyncThunk('notify/setNotify', async(data,thunkAPI) => {
    try{
        const user = await thunkAPI.getState().auth.user;
        if(user.uid !== data.rid){
            const post = await thunkAPI.getState().post.posts.filter(post => post.id === data.likedpost.id);
            const likedByUser = post[0].likes.filter(like => like === user.uid)
            
            if(likedByUser.length){
                const q = query(collection(db, "notifications"), where("rid", "==", data.rid), 
                    where("sid", "==", user.uid), where("pid", "==", data.likedpost.id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((data) => {
                    deleteDoc(doc(db, 'notifications', data.data().id));
                });
            }else{
                let message = `likes your post!`;
                let notification = {
                    sid: user.uid,
                    rid: data.rid,
                    message,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    read: false,
                    pid: data.likedpost.id,
                }
                const docRef = await addDoc(collection(db, 'notifications'), notification);
                setDoc(doc(db, 'notifications', docRef.id), {id: docRef.id}, {merge: true});
            }
        }
    }catch(error){
        console.log(thunkAPI.rejectWithValue({error: error.message}))
    }
});

export const getAllNotify = createAsyncThunk('notify/getAllNotify', async(data,thunkAPI) => {
    try{
        const user = await thunkAPI.getState().auth.user;
        if(user){
            let notifications = []
            const q = query(collection(db, "notifications"), where("rid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((data) => {
                notifications.push(data.data());
            });
            return notifications
        }
    }catch(error){
        console.log(thunkAPI.rejectWithValue({error: error.message}))
    }
});

export const delNote = createAsyncThunk('notify/delNote', async(note,thunkAPI) => {
    try{
        deleteDoc(doc(db, 'notifications', note.id));
        return note       
    }catch(error){
        console.log(thunkAPI.rejectWithValue({error: error.message}))
    }
});

export const readNote = createAsyncThunk('notify/readNote', async(notes,thunkAPI) => {
    try{
        for(let note of notes){
            setDoc(doc(db, 'notifications', note.id), {read: true}, {merge: true})
        }     
    }catch(error){
        console.log(thunkAPI.rejectWithValue({error: error.message}))
    }
});

export const notifySlicer = createSlice({
    name: "notify",
    initialState: {
        status: "idle",
        notes:[],
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(getAllNotify.fulfilled, (state, action) => {
            state.status = 'success'
            state.notes = action.payload
        })
        builder.addCase(delNote.fulfilled, (state, action) => {
            state.status = 'success'
            state.notes = state.notes.filter(note => note.id !== action.payload.id)
        })
    }
})

export default notifySlicer.reducer;