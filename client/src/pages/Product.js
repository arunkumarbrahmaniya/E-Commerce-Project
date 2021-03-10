import React, {useEffect, useState} from 'react';
import {getSingleProduct, productStar} from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import {useSelector} from 'react-redux';
const Product = ({match}) => {
    const [product, setProduct] = useState([]);
    const { slug } = match.params;
    const [star, setStar] = useState(0);

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
    })
    const loadingSingleProduct = () => {
        getSingleProduct(slug)
        .then((res) => {
            setProduct(res.data);
        })
    }

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, newRating, user.token)
        .then((res) => {
            console.log("STAR", res.data);
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
    </div>
}

export default Product;