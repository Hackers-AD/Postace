import { TouchableOpacity, StyleSheet,View, Text } from "react-native";
import { Children } from "react";

const ReactButton = (props) => {
    return (
        <TouchableOpacity style={{...styles.opacity, ...props.style}}>
            {props.title ? <Text>{props.title}</Text> : null}
            {Children.toArray(props.children).map((child, idx) => (
                <View key={idx} style={styles.children}>
                    {child}
                </View>
            ))}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    opacity:{
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgrey",
        borderWidth: 1,
        borderColor: "grey",
    },
    children:{
        paddingHorizontal: 1,
    }
})
export default ReactButton;