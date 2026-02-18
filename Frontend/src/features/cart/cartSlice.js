import { createSlice } from "@reduxjs/toolkit";

 const initialState = {
    items:[] ,//cart items
    selectedIds: [] 
 };

 const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{

    addToCart:(state,action)=>{
        if(!Array.isArray(state.items)){
            state.items = [];
        }
        state.items.push(action.payload);
    
   },

    setCart:(state,action)=>{
        state.items = action.payload || [];
    },

    removeFromCart: (state, action) => {
            const cartId = action.payload;

            state.items = (state.items||[]).filter(
            (item) => item._id !== cartId
        );

            state.selectedIds = (state.selectedIds || []).filter(
            id => id !== cartId
      );
    },

    updateQuantity:(state,action)=>{
        const {cartId,quantity} = action.payload;
        const item = state.items.find(i=>i._id === cartId);

        if(item){
            item.quantity = quantity;
        }
    },

    clearCart: (state) => {
        state.items = [];
        state.selectedIds = [];
        },

    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload || [];
    }

    }

 });

export const {addToCart,setCart,removeFromCart,updateQuantity,clearCart,setSelectedIds} = cartSlice.actions;

export default cartSlice.reducer;