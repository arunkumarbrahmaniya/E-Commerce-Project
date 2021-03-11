import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    getCategories
} from '../../functions/category';
import {
    LoadingOutlined
} from '@ant-design/icons';
const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCategories()
        .then((res) => {
            setCategories(res.data);
            setLoading(false);
        });
    },[]);

    const showCategories = () =>
        categories.map((c) => 
                <div key={c._id} className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3">
                    <Link to={`/category/${c.slug}`}>
                        {
                            c.name
                        }
                    </Link>
                </div>
        )

return (
    <div className="container">
        <div className="row">
            {
                loading ?
                <h4 className="col text-center text-danger">
                <span className="mr-3">
                    Loading...
                </span>
                 <LoadingOutlined
                     style={{fontSize:30}}
                 />
             </h4>
                : 
                showCategories()
            }
        </div>
    </div>
)
}

export default CategoryList;