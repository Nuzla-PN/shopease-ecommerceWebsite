import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWishlist } from "../../APIs/productAPI.js";


export const fetchWishlist = createAsyncThunk("wishlist/fetch",
    async()=>{
        const res = await getWishlist();
        return res.WishlistedItems || [];
    }
);

const wishlistSlice = createSlice({
    name:"wishlist",
    initialState:{
        items:[],
        loading:false
    },
    reducers:{
      
    },
    extraReducers:(builders)=>{
        builders
            .addCase(fetchWishlist.pending,(state)=>{
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state) => {
                state.loading = false;
            });
        }
});


export default wishlistSlice.reducer;