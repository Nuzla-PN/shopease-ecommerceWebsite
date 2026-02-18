import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { cancelOrderAPI, reOrderAPI, viewMyOrders } from "../../APIs/productAPI.js";

const initialState = {
    address:null,
    myOrderProducts:[],
    loading:false,
    error:null
};

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {

    try {

      const data = await viewMyOrders(); 
      const orders = data.orders;

      const rows = orders.flatMap(order =>
        order.items.map(item => ({

          rowId: order._id + "-" + item.product._id,

          orderId: order._id,
          orderNumber: order.orderNumber,
          orderDate: order.createdAt,

          status: order.status,
          statusDate: order.updatedAt || order.createdAt,

          quantity: item.quantity,
          price: item.price,

          product: item.product,

          address: order.shippingAddress || null
        }))
      );

      return rows;

    } catch (err) {
      console.log("FETCH MY ORDERS ERROR:", err);
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

export const cancelMyOrder = createAsyncThunk(
  "orders/cancelMyOrder",
  async (orderId, thunkAPI) => {
    try {
      return await cancelOrderAPI(orderId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message|| "Cancel Failed");
    }
  }
);

export const reOrder = createAsyncThunk(
  "order/reOrder",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      return await reOrderAPI(productId, quantity);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers:{
        setAddress:(state,action)=>{
            state.address = action.payload;
        },
        clearAddress:(state)=>{
            state.address = null;
        }
    },
    extraReducers: (builder) => {

    builder
    //TO GET ORDER
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrderProducts = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //CANCELORDER
      .addCase(cancelMyOrder.fulfilled, (state, action) => {

        const updatedOrder = action.payload.order;

        state.myOrderProducts = state.myOrderProducts.map(row =>
          row.orderId === updatedOrder._id
            ? { ...row, status: updatedOrder.status }
            : row
        );

      })


      .addCase(cancelMyOrder.rejected, (state, action) => {
        state.error = action.payload;
      });

  }
});


export const {setAddress,clearAddress} = orderSlice.actions;
export default orderSlice.reducer;