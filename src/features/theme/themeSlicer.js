import { createSlice } from "@reduxjs/toolkit";


export const themeSlicer = createSlice({
    name: "theme",
    initialState: {
        status: "pending",
        name: "light",
        error: null
    },
    reducers: {
        toggleTheme: (state) => {
            state.name = state.name === "light" ? "dark" : "light"
        }
    }
})

export const { toggleTheme } = themeSlicer.actions
export default themeSlicer.reducer