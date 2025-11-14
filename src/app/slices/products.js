import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
// Demo Data
import { getProductsData, getProductById as getProductByIdFromFirebase } from '../data/productsData'
// Alert
import Swal from "sweetalert2";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const products = await getProductsData();
        return products;
    }
);

// Async thunk for fetching single product
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id) => {
        const product = await getProductByIdFromFirebase(id);
        return product;
    }
);

// Product Slice
const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false,
        error: null,
        carts: [],
        favorites: [],
        compare: [],
        single: null,
        singleLoading: false,
        singleError: null,
    },
    reducers: {
        // Clear single product
        clearSingleProduct: (state) => {
            state.single = null;
            state.singleLoading = false;
            state.singleError = null;
        },
        // Add to Cart
        addToCart: (state, action) =>{

            let { id } = action.payload;

            // Check existance
            let item = state.carts.find(i => i.id === parseInt(id))
            if (item === undefined) {
                // Get Product
                let arr = state.products.find(item => item.id === parseInt(id))
                arr.quantity = 1
                state.carts.push(arr)
                Swal.fire({
                    title: 'Success!',
                    text: 'Successfully added to your Cart',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2500
                  })

            }else{
                Swal.fire({
                    title: 'Failed!',
                    text: 'This product is already added in your Cart',
                    imageUrl: item.img,
                    imageWidth: 200,
                    imageAlt: item.title,
                    showConfirmButton: false,
                    timer: 5000
                  })
              }
        },
        // Add to Compare
        addToComp: (state, action) =>{
            if (state.compare.length >= 3) {
                Swal.fire({
                    title: 'Failed!',
                    text: 'Compare List is Full',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 2500,
                  })
                return;
            }

            let { id } = action.payload;

            // Check existance
            let item = state.compare.find(i => i.id === parseInt(id))
            if (item === undefined) {
                // Get Product
                let arr = state.products.find(item => item.id === parseInt(id))
                state.compare.push(arr)
                Swal.fire({
                    title: 'Success!',
                    text: 'Successfully added to Compare List',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                  })
            }else{
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Already Added in Compare List',
                        imageUrl: item.img,
                        imageWidth: 200,
                        imageAlt: item.title,
                        showConfirmButton: false,
                        timer: 5000,
                    })
              }
        },
        // Update Cart
        updateCart: (state, action) =>{
            let { val, id } = action.payload;
            state.carts.forEach(item => {
                if(item.id === parseInt(id)){
                    item.quantity = val
                }
            })

        },
        // Remove Cart
        removeCart: (state, action) =>{
            let { id } = action.payload;
            let arr = state.carts.filter(item => item.id !== parseInt(id))
            state.carts = arr
            
        },
        // Delete from Compare
        delCompare: (state, action) =>{
            let { id } = action.payload;
            let arr = state.compare.filter(item => item.id !== parseInt(id))
            state.compare = arr
            
        },
        // Clear Cart
        clearCart: (state) =>{
            state.carts = []
        },
        // Add to Favorite / Wishlist
        addToFav: (state, action) =>{
            let { id } = action.payload;

            // Check existance
            let item = state.favorites.find(i => i.id === parseInt(id))
            if (item === undefined) {
                // Get Product
                let arr = state.products.find(item => item.id === parseInt(id))
                arr.quantity = 1
                state.favorites.push(arr)
                Swal.fire('Success', "Added to Wishlist", 'success')
            }else{
                  Swal.fire('Failed', "Already Added in Wishlist", 'warning')
              }
        },
        // Remove from Favorite / Wishlist
        removeFav: (state, action) =>{
            let { id } = action.payload;
            let arr = state.favorites.filter(item => item.id !== id)
            state.favorites = arr
            
        },
    },
    extraReducers: (builder) => {
        // Fetch products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        
        // Fetch single product
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.singleLoading = true;
                state.singleError = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.singleLoading = false;
                state.single = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.singleLoading = false;
                state.singleError = action.error.message;
                // Fallback: products array'den ara
                const id = action.meta.arg;
                const product = state.products.find(item => item.id === parseInt(id));
                if (product) {
                    state.single = product;
                }
            });
    }
})

const productsReducer = productsSlice.reducer
export default productsReducer
