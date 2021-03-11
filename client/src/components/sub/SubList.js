import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    getSubs
} from '../../functions/sub';
import {
    LoadingOutlined
} from '@ant-design/icons';
const SubList = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubs()
        .then((res) => {
            setSubs(res.data);
            setLoading(false);
        });
    },[]);

    const showSubs = () =>
        subs.map((s) => 
                <div key={s._id} className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3">
                    <Link to={`/subs/${s.slug}`}>
                        {
                            s.name
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
                showSubs()
            }
        </div>
    </div>
)
}

export default SubList;