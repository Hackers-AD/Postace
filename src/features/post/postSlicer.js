import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, addDoc, collection, doc, setDoc, serverTimestamp, 
    arrayUnion, getDocs, getDoc, deleteDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../../firebase';

const db = getFirestore(app);
const storage = getStorage(app);
export const createPost = createAsyncThunk('post/createPost', async(data, thunkAPI) => {
    try{
        const user = await thunkAPI.getState().auth.user;
        let post = {
            caption: data.caption, 
            images: [], 
            date: new Date().toLocaleDateString(), 
            time: new Date().toLocaleTimeString(),
            uid: user.uid, 
            likes: []
        }
        
        const docRef = await addDoc(collection(db, 'posts'), post);
        setDoc(doc(db, 'posts', docRef.id), {id: docRef.id }, {merge: true});

        let imageURIList = [];
        if(data.images){
            for(let img of data.images){
                imageURIList.push(img.uri);
                let fileName = img.uri.split('/').pop();
                let storageRef = ref(storage, 'posts/' + fileName);
                let res = await fetch(img.uri);
                let blob = await res.blob();
                let image = new File([blob],fileName, {type: 'image/' + fileName.split('.').pop()})
                uploadBytes(storageRef, image).then((snapshot) =>{
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        setDoc(doc(db, 'posts', docRef.id), {images: arrayUnion(downloadURL)}, {merge: true});
                    });
                })  
            }
        }

        return {...post, id: docRef.id, images: imageURIList }
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message}); 
    }
});

export const delPost = createAsyncThunk('post/delPost', async(post, thunkAPI) => {
    try{
        deleteDoc(doc(db, 'posts', post.id));
        return post.id
    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message}); 
    }
})

export const likePost = createAsyncThunk('post/likePost', async(pid, thunkAPI) => {
    try{
        const postRef = doc(db, 'posts', pid);
        const uid = await thunkAPI.getState().auth.user.uid;
        
        getDoc(postRef).then(doc => {
            const likedByUser = doc.data().likes.filter(id => id === uid)
            if(likedByUser.length === 0){
                updateDoc(postRef, {
                    likes: arrayUnion(uid)
                })
            }else{
                updateDoc(postRef, {
                    likes: arrayRemove(uid)
                })
            }
        })

        return {uid, pid}

    }catch(error){
        return thunkAPI.rejectWithValue({error: error.message}); 
    }
})

export const getAllPosts = createAsyncThunk('post/getAllPosts', async(thunkAPI) => {
    try{
        let data = [];
        const docs = await getDocs(collection(db, 'posts'));
        docs.forEach(doc => {
            data.push(doc.data());
        })
        return data;
    }catch(error){
        thunkAPI.rejectWithValue({error: error.message})
    }
})

export const postSlicer = createSlice({
    name: "post",
    initialState: {
        status: 'idle',
        posts: [],
    },
    extraReducers: (builder) => {
        builder.addCase(createPost.pending, (state, action) => {
            state.status = 'pending'
            console.log('pending');
        })
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.status = 'success'
            state.posts = [...state.posts, action.payload]
            console.log('success');
        })
        builder.addCase(createPost.rejected, (state, action) => {
            state.status = "failed"
            console.error(action.payload)
        })
        builder.addCase(delPost.pending, (state, action) => {
            state.status = 'pending'
            console.log('pending');
        })
        builder.addCase(delPost.fulfilled, (state, action) => {
            state.status = 'success'
            state.posts = state.posts.filter(p => p.id !== action.payload)
            console.log('success');
        })
        builder.addCase(delPost.rejected, (state, action) => {
            state.status = "failed"
            console.error(action.payload)
        })
        builder.addCase(likePost.pending, (state, action) => {
            state.status = 'pending'
            console.log('pending');
        })
        builder.addCase(likePost.fulfilled, (state, action) => {
            state.status = 'success'
            let uid = action.payload.uid;
            let pid = action.payload.pid;
            state.posts = state.posts.map(post => {
                if(post.id === pid){
                    if(post.likes.filter(like => like === uid).length){
                        return {...post, likes: post.likes.filter(like => like !== uid)}
                    }else{
                        return {...post, likes: [...post.likes, uid]}
                    }
                }else{
                    return post
                }
            })
            console.log('success');
        })
        builder.addCase(likePost.rejected, (state, action) => {
            state.status = "failed"
            console.error(action.payload)
        })
        builder.addCase(getAllPosts.fulfilled, (state, action) => {
            state.status = 'success'
            state.posts = action.payload
            console.log('success')
        })
        builder.addCase(getAllPosts.rejected, (state, action) => {
            state.status = "failed"
            console.log(action.payload)
        })
    }
})

export default postSlicer.reducer