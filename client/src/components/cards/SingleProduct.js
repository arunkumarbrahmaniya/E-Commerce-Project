import React, {useState} from 'react';
import {Card, Tabs, Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import {
    HeartOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import Default from '../../images/default.png';
import ProductListItems from './ProductListItems';
import StarRatings from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import showAverage from '../../functions/rating';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
const {TabPane} = Tabs;
const SingleProduct =({product, onStarClick, star}) => {

    const {title, images, description, _id} = product;
    const [tooltip, setTooltip] = useState('Click to add');
    const {user, cart} = useSelector((state) => ({...state}));
    const dispatch = useDispatch();
    const handleAddCart = () => {
        let cart = [];
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.push({...product,
            count: 1
        });
        let unique = _.uniqWith(cart,_.isEqual);
        localStorage.setItem('cart', JSON.stringify(unique));
        setTooltip('Added');
        dispatch({
            type: "ADD_TO_CART",
            payload: unique,
        });
        dispatch({
            type: "SET_VISIBLE",
            payload: true,
        })
        }
    }
    
    return (
        <>
        <div className="col-md-7">
            {
                images && images.length ?
                <Carousel
                showArrows={true}
                autoPlay
                infiniteLoop
            >
                {
                    images && images.map((image) => {
                        return (
                            <img
                                src={image.url}
                                key={image.public_id}
                                alt="shopping"
                            />
                        )
                    })
                }
            </Carousel>
            :
            <Card
                cover={
                    <img
                        src={Default}
                        style={{height:150, objectFit:"cover"}}
                        className="mb-3 card-image"
                        alt="shopping"
                    />
                }
            >

            </Card>
            }
            <Tabs type="card">
                <TabPane tab="Description" key="1">
                    {
                        description && description
                    }
                </TabPane>
                <TabPane tab="More" key="2">
                    {
                        description && description
                    }
                </TabPane>
            </Tabs>
        </div>

        <div className="col-md-5">
            <h1 className="bg-info p-3">{title}</h1>
            {
                product && product.rating && product.rating.length > 0 ?
                showAverage(product) : 
                <div className="text-center pt-1 pb-3">
                    No ratings yet
                </div>
            }
            <Card
                actions={[
                    <>
                        <Tooltip title={tooltip}>
                            <span className="text-link block" onClick={handleAddCart}>
                            <ShoppingCartOutlined
                                className="text-danger" 
                            /> <br/> Add to Cart
                </span>
            </Tooltip>
                    </>,
                    <Link to={`/`}>
                       <HeartOutlined className="text-success"/><br/> Add to Wishlist
                    </Link>,
                    <RatingModal>
                    <StarRatings
                        name={_id}
                        numberOfStars={5}
                        rating={star}
                        changeRating={onStarClick}
                        isSelectable={true}
                        starRatedColor="red"
                    />
                </RatingModal>
                ]}
            >
                <ProductListItems
                    product={product}
                />
            </Card>
        </div>
        </>
    )
}

export default SingleProduct;