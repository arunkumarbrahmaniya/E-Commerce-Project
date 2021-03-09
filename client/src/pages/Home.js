import React, {useEffect, useState} from 'react';
import {
    getProductByCount,
} from '../functions/product';
import ProductCard from '../components/cards/ProductCard';
import Jumbotron from '../components/cards/Jumbotron';
import LoadingCard from '../components/cards/LoadingCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const[loading, setLoading] = useState(false);
    useEffect(() => {
        loadAllProducts();
    }, []);
    const loadAllProducts = () => {
        setLoading(true);
        getProductByCount(3)
        .then((res) => {
            setProducts(res.data);
            setLoading(false);
        });
    };

    return (
        <>
            <div className="jumbotron text-danger h1 font-weight-bold text-center">
                <Jumbotron
                    text={["New Arrivals", "Latest Products", "Best Sellers",]}
                />
            </div>
            <div className="container">
                { loading ? <LoadingCard count={3}/> : 
                    <div className="row">
                        {
                            products.map((product) => {
                                return (
                                    <div className="col-md-4" key={product._id}>
                                        <ProductCard
                                            product={product}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
            }
            </div>
        </>
    );
};

export default Home;