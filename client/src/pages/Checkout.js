import React, {useState,useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useSelector, useDispatch} from 'react-redux';
import { toast } from 'react-toastify';

import {
    getUserCart,
    emptyUserCart,
    saveUserAddress
} from '../functions/user';



const Checkout = () => {
    let dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const { user } = useSelector((state) => ({...state}));
    const [address, setAddress] = useState(''); 
    const [addressSaved, setAddressSaved] = useState(false);
    useEffect(() => {
        getUserCart(user.token)
        .then((res) => {
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        })
    },[]);

    const saveAddressToDB = () => {
        saveUserAddress(user.token, address)
        .then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address Saved");
            }
        });
    }
    const emptyCart = () => {
        if(typeof window !== 'undefined') {
            localStorage.removeItem('cart');
        }
        dispatch({
            type:"ADD_TO_CART",
            payload:[]
        })
        emptyUserCart(user.token)
        .then((res) => {
            setProducts([]);
            setTotal(0);
            toast.success("Cart is empty,Continue Shopping.")
        })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>
                    Delivery Address
                </h4>
                <br/>
                <br/>
                <ReactQuill
                    theme="snow"
                    value={address}
                    onChange={setAddress}
                />
                <button
                    onClick={saveAddressToDB}
                    className="btn btn-primary btn-raised mt-2"
                >
                    SAVE
                </button>
                <hr/>
                <h4>
                    Got Coupon?
                </h4>
                <br/>
                coupon input apply
            </div>
            <div className="col-md-6">
                <h4>
                    Order Summary
                </h4>
                <hr/>
                <p>Products {products.length}</p>
                <hr/>
                {
                    products.map((p,i) => (
                        <div key={i}>
                            <p>{p.product.title} ({p.color}) x {p.count} = {p.price * p.count}</p>
                        </div>
                    ))
                }
                <hr/>
                <p>
                    Cart Total: {total}
                </p>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-primary btn-raised"
                            disabled={!addressSaved || !products.length}
                        >
                            Place Order
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-primary btn-raised"
                            onClick={emptyCart}
                            disabled={!products.length}
                        >
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;