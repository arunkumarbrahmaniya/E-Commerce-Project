import React from 'react';
import {Drawer} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import productDefault from '../../images/default.png';

const SideDrawer = () => {
    let dispatch = useDispatch();
    const {drawer, cart} = useSelector((state) => ({...state}));
    const imageStyle = {
        width:'100%',
        height:'50px',
        objectFiy:'cover',
        border: '1px solid skyblue'
    }
    return (
        <Drawer
            className="text-center"
            placement="right"
            closable={false}
            title={`Cart / ${cart.length} Product`}
            visible={drawer}
            onClose={() => {
                dispatch({
                    type:"SET_VISIBLE",
                    payload: false
                })
            }}
        >
            {
                cart.map((p) => (
                    <div
                        key={p._id}
                        className="row"
                    >
                        <div className="col">
                            {
                                p.images[0] ? 
                                (
                                    <>
                                    <img src={p.images[0].url}
                                        style={imageStyle}
                                    />
                                    <p className="text-center bg-secondary text-light">
                                        {p.title} x {p.count}
                                    </p>
                                    </>
                                )
                                : 
                                (
                                    <img
                                        src={productDefault}
                                        style={imageStyle}
                                    />
                                )
                            }
                            {/* {
                                JSON.stringify(cart)
                            } */}
                        </div>
                    </div>
                ))
            }
            <Link to="/cart">
                <button onClick={() => dispatch({
                    type:"SET_VISIBLE",
                    payload: false
                })} className="btn btn-primary btn-raised text-center btn-block">
                    GO TO CART
                </button>
            </Link>
        </Drawer>
    );
}

export default SideDrawer;