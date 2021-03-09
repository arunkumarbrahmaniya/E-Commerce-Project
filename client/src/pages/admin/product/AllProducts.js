import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav'
import {
    getProductByCount
} from '../../../functions/product';
import AdminProductCard from '../../../components/cards/AdminProductCard';
const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadAllProducts();
    },[]);

    const loadAllProducts = () => {
        setLoading(true);
        getProductByCount(100)
        .then((res) => {
            setProducts(res.data);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
        })
    }


    return (
        <div className="container-fluid p-4">
        <div className="row">
            <div className="col-md-2">
                <AdminNav/>
            </div>
            <div className="col">
               <div className="col">
               {
                   loading ? 
                   <h4 className="text-danger">
                       Loading...
                   </h4>
                   : 
                   <h4>
                       All Products
                   </h4>
               }
                   <div className="row">
                   {
                       products.map((product) =>(
                           <div className="col-md-4 pb-3" key={product._id}>
                                <AdminProductCard product={product}/>
                           </div>
                       ))
                   }
                   </div>
               </div> 
            </div>
        </div>
    </div>
    )
}

export default AllProducts;