import React, {useState,useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useSelector, useDispatch} from 'react-redux';
import { toast } from 'react-toastify';

import {
    getUserCart,
    emptyUserCart,
    saveUserAddress,
    applyCoupan
} from '../functions/user';



const Checkout = () => {
    let dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const { user } = useSelector((state) => ({...state}));
    const [address, setAddress] = useState(''); 
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupan, setCoupan] = useState('');
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    
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
            setTotalAfterDiscount(0);
            setCoupan("");
            toast.success("Cart is empty,Continue Shopping.")
        })
    }

    const showAddress = () => <>
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
    </>
    const showProductSummary = () =>
        products.map((p,i) => (
            <div key={i}>
                <p>{p.product.title} ({p.color}) x {p.count} = {p.price * p.count}</p>
            </div>
        ))
    const applyDiscountCoupan = () => {
        applyCoupan(user.token, coupan)
        .then((res) => {
            if(res.data) {
                setTotalAfterDiscount(res.data);
                setDiscountError('');
            }
            if (res.data.error) {
                setDiscountError(res.data.error);
            }
        })
    }
    const showApplyCoupan = () =>
        <>
            <input
                type="text"
                className="form-control"
                onChange={(e) =>{setCoupan(e.target.value)
                setDiscountError('')}}
                value={coupan}
            />
            <button className="btn btn-primary mt-2 btn-raised"
                onClick={applyDiscountCoupan}
            >
                Apply
            </button>
        </>

    return (
        <div className="row p-4">
            <div className="col-md-6">
                <h4>
                    Delivery Address
                </h4>
                <br/>
                <br/>
                {
                    showAddress()
                }
                <hr/>
                <h4>
                    Got Coupon?
                </h4>
                <br/>
                {
                    showApplyCoupan()
                }
                <br/>
                {
                    discountError && <p className="bg-danger p-2 text-light">{
                        discountError
                    }</p>
                }
            </div>
            <div className="col-md-6">
                <h4>
                    Order Summary
                </h4>
                <hr/>
                <p>Products {products.length}</p>
                <hr/>
                {
                    showProductSummary()
                }
                <hr/>
                <p>
                    Cart Total: {total}
                </p>
                {
                    totalAfterDiscount > 0 && (
                        <div className="bg-success p-2 text-light">
                            Discount Applied: Total Payable:
                            {
                                totalAfterDiscount
                            }
                        </div>
                        
                    )
                }
                <br/>
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