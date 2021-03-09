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
const {Meta} = Card;
const {TabPane} = Tabs;
const SingleProduct =({product}) => {

    const {title, images, description} = product;

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
            <Card
                actions={[
                    <>
                        <ShoppingCartOutlined className="text-success"/> Add to Cart
                    </>,
                    <Link to={`/`}>
                       <HeartOutlined className="text-danger"/><br/> Add to Wishlist
                    </Link>,
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