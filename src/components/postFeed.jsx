import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../features/post/postSlicer";
import { getAll } from "../features/profile/profileSlicer";
import Posts from "./posts";
import { useFocusEffect } from "@react-navigation/native";

const PostFeed = () => {
    const dispatch = useDispatch();
    const posts = useSelector(s => s.post.posts);

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    useFocusEffect(() => {
        dispatch(getAll(posts))
    })
    return (
        <>
            <Posts posts={posts} />
        </>
    );
}
export default PostFeed;