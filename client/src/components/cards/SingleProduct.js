import React from 'react';
import {Card, Tabs} from 'antd';
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

const {TabPane} = Tabs;
const SingleProduct =({product, onStarClick, star}) => {

    const {title, images, description, _id} = product;

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
                        <ShoppingCartOutlined className="text-info"/> Add to Cart
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