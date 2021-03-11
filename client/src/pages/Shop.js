import React, {useState, useEffect} from 'react';
import {
    getProductByCount,
    fetchProductsByFilter
} from '../functions/product';
import {
    getCategories
} from '../functions/category';
import {
    getSubs
} from '../functions/sub';
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import {Menu, Slider, Checkbox, Radio} from 'antd';
import {
    DollarOutlined,
    DownSquareOutlined,
    StarOutlined,
    BgColorsOutlined,
    FireOutlined,
    ShrinkOutlined
} from '@ant-design/icons';
import showAverage from '../functions/rating';
import Star from '../components/forms/Star';
const { SubMenu } = Menu;
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const search = useSelector((state) => ({...state}));
    const {text} = search.search;
    const [price, setPrice] = useState([0,0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesIds, setCategoriesIds] = useState([]);
    const [star, setStar] = useState('');
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo","Asus"],);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(["Black", "Brown", "Silver", "White","Blue"]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    
    let dispatch = useDispatch();
    useEffect(() => {
        loadAllProducts();
        fetchCategories();
        getSubs().then((res) => setSubs(res.data))
    },[]);

    const fetchCategories = () => {
        getCategories().then((res) => setCategories(res.data));
    }

    // search products by default on page load

    const loadAllProducts = () => {
        getProductByCount(12).then((product) => {
            setProducts(product.data);
            setLoading(false);
        });
    };

    // load products based on user search input

    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({query: text});
        }, 300);
        return () => clearTimeout(delayed);
    },[text]);

    const fetchProducts = (arg) => fetchProductsByFilter(arg).then((res) => {
        setProducts(res.data);
        setLoading(false);
    })

    // load product based on price range

    useEffect(() => {
        fetchProducts({price});
    },[ok]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload:{
                text:""
            },
        });

        setCategoriesIds([]);
        setPrice(value);
        setStar('');
        setSub('');
        setBrand("");
        setColor("");
        setShipping('');
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    }

    //load product based on category

    const showCategories = () => categories.map((c) => <div key={c._id}>
        <Checkbox className="pb-2 pl-4 pr-4"
        value={c._id} name="category"
        onChange={handleCheck}
        checked={categoriesIds.includes(c._id)}
        >
            {
                c.name
            }
        </Checkbox>
    </div>);

    const handleCheck = (e) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload:{
                text:""
            }
        })
        setPrice([0,0]);
        setStar("");
        setSub('');
        setBrand("");
        setColor("");
        setShipping('');
        let inTheState = [...categoriesIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else{
            inTheState.splice(foundInTheState, 1);
        }
        setCategoriesIds(inTheState);
        fetchProducts({category: inTheState});
    }

    // show Products by star ratings

    const handleStarClick = (number) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload:{
                text:""
            }
        })
        setPrice([0,0])
        setCategoriesIds([]);
        setStar(number);
        setSub('');
        setBrand("");
        setColor("");
        setShipping('');
        fetchProducts({
            stars: number
        })
    }
    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star
                starClick={handleStarClick}
                numberOfStars={5}
            />
            <Star
                starClick={handleStarClick}
                numberOfStars={4}
            />
            <Star
                starClick={handleStarClick}
                numberOfStars={3}
            />
            <Star
                starClick={handleStarClick}
                numberOfStars={2}
            />
            <Star
                starClick={handleStarClick}
                numberOfStars={1}
            />
        </div>
    )

    //show products by sub category

    const showSubCategories = () =>
    subs.map((sub) =>
    <div className="p-1 m-1 badge badge-primary"
    style={{cursor:"pointer"}}
    key={sub._id}
    onClick={() => handleSub(sub)}>
        {sub.name}
    </div>
);

const handleSub = (sub) => {
    setSub(sub);
    dispatch({
        type:"SEARCH_QUERY",
        payload:{
            text:""
        }
    })
    setPrice([0,0])
    setCategoriesIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping('');
    fetchProducts({
        sub
    });
}

// show products based on brands

const showBrands = () => brands.map((b) => (
    <Radio
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pt-2 pr-5"
    >
        {
            b
        }
    </Radio>
    )
)
const handleBrand = (e) => {
    setSub('');
    dispatch({
        type:"SEARCH_QUERY",
        payload:{
            text:""
        }
    })
    setPrice([0,0])
    setCategoriesIds([]);
    setStar("");
    setColor("");
    setShipping('');
    setBrand(e.target.value);
    fetchProducts({
        brand: e.target.value
    });
}

//show product  based on colors

const showColors = () => colors.map((c) =>(
    <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pt-2 pr-5"
    >
        {
            c
        }
    </Radio>
))

const handleColor = (e) => {
    setSub('');
    dispatch({
        type:"SEARCH_QUERY",
        payload:{
            text:""
        }
    })
    setPrice([0,0])
    setCategoriesIds([]);
    setStar("");
    setBrand('');
    setShipping('');
    setColor(e.target.value)
    fetchProducts({
        color: e.target.value
    });
}

// search products based on shipping yes or no

const showShipping = () => (
    <>
        <Checkbox 
            className="pb-2 pl-4 pr-4 pt-2"
            onChange={handleShipping}
            value="Yes"
            checked={shipping === "Yes"}
        >
            Yes
            </Checkbox>
        <Checkbox 
            className="pb-2 pl-4 pr-4"
            onChange={handleShipping}
            value="No"
            checked={shipping === "No"}
        >
            No
            </Checkbox>
    </>
)
const handleShipping = (e) => {
    setSub('');
    dispatch({
        type:"SEARCH_QUERY",
        payload:{
            text:""
        }
    })
    setPrice([0,0])
    setCategoriesIds([]);
    setStar("");
    setBrand('');
    setColor('');
    setShipping(e.target.value);
    fetchProducts({
        shipping: e.target.value
    });
}
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>
                        Search/Filter
                    </h4>
                    <hr/>
                    <Menu defaultOpenKeys={['1','2','3','4','5', '6', '7']} mode="inline">
                        <SubMenu key="1" title={<span className="h6"><DollarOutlined/>Price</span>}>
                            <div>
                                <Slider 
                                    className="ml-4 mr-4"
                                    tipFormatter={(value) => `$${value}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="4999"
                                />
                            </div>
                        </SubMenu>
                        <SubMenu key="2" title={<span className="h6"><DownSquareOutlined/>Categories</span>}>
                            <div className="pt-3 pb-2">
                                {
                                    showCategories()
                                }
                            </div>
                        </SubMenu>
                        <SubMenu key="3" title={<span className="h6"><StarOutlined/>Rating</span>}>
                            <div className="pt-3 pb-2">
                                {
                                    showStars()
                                }
                            </div>
                        </SubMenu>
                        <SubMenu key="4" title={<span className="h6"><DownSquareOutlined/>Sub Categories</span>}>
                            <div className="pt-2 pb-2 pl-4 pr-4">
                                {
                                    showSubCategories()
                                }
                            </div>
                        </SubMenu>
                        <SubMenu key="5" title={<span className="h6"><FireOutlined />Brands</span>}>
                            <div className="pr-5">
                                {
                                    showBrands()
                                }
                            </div>
                        </SubMenu>
                        <SubMenu key="6" title={<span className="h6"><BgColorsOutlined />Colors</span>}>
                            <div className="pr-5">
                                {
                                    showColors()
                                }
                            </div>
                        </SubMenu>
                        <SubMenu key="7" title={<span className="h6"><ShrinkOutlined />Shipping</span>}>
                            <div  className="pt-2 pb-2 pr-5">
                                {
                                    showShipping()
                                }
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {
                        loading ?
                        <h4 className="text-danger">
                            Loading...
                        </h4>
                        :
                        <h4>
                            Products
                        </h4>
                    }
                    {
                        products.length < 1 && <p>No Products Found</p>
                    }
                    <div className="row">
                        {
                            products.map((p) =>(
                                <div key={p._id} className="col-md-4">
                                    <ProductCard
                                        product={p}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Shop;