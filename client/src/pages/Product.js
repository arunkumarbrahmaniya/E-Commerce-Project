import React, {useEffect, useState} from 'react';
import {getSingleProduct, productStar} from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import {useSelector} from 'react-redux';
import {
    getRelated
} from '../functions/product';
import ProductCard from '../components/cards/ProductCard';
const Product = ({match}) => {
    const [product, setProduct] = useState([]);
    const { slug } = match.params;
    const [star, setStar] = useState(0);
    const [related, setRelated] = useState([]);
    const {user} = useSelector((state) => ({...state}));
    useEffect(() => {
        loadingSingleProduct();
    },[slug]);
    useEffect(() => {
        if(product.rating && user) {
            let existingRatingObject = product.rating.find(
                (element) => element.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);
        }
    },[product.rating, user]);
    const loadingSingleProduct = () => {
        getSingleProduct(slug)
        .then((res) => {
            setProduct(res.data);
            getRelated(res.data._id)
            .then((res) => {
                setRelated(res.data);
            })
        })
    }

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, newRating, user.token)
        .then((res) => {
            loadingSingleProduct();
        });
    }

    return <div className="container-fluid">
        <div className="row pt-4">
            <SingleProduct
                product={product}
                onStarClick={onStarClick}
                star={star}
            />
        </div>

        <div className="row">
            <div className="col text-center pt-5 pb-5">
                <hr/>
                <h4>
                    Related Products
                </h4>
                <hr/>

            </div>
        </div>
        <div className="row pb-5">
            {
                related.length ?
                related.map((r) => {
                    return(
                        <div key={r._id} className="col md-4">
                            <ProductCard
                                product={r}
                            />
                        </div>
                    )
                })
                :
                <div className="text-center col">
                    No Products Found
                </div>
            }
        </div>
    </div>
}

export default Product;