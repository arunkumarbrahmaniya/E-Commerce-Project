import React from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';

const FileUpload = ({setValues, values, setLoading}) => {
    const {user} = useSelector((state) => ({...state}));

    const fileUploadAndResize = async(e) => {
        let files = e.target.files;
        let allUploadedFiles = values.images;
        if(files) {
            setLoading(true);
            for(let i = 0; i < files.length; i++){
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    'JPEG',
                    100,
                    0,
                    async(uri) => {
                        await axios.post(`${process.env.REACT_APP_API}/uploadimages`,{image: uri},{
                            headers:{
                                authtoken: user ? user.token :""
                            },
                        }).then((res) => {
                            setLoading(false);
                            allUploadedFiles.push(res.data);
                            setValues({...values, images: allUploadedFiles});
                        })
                        .catch((error) => {
                            setLoading(false);
                        })
                    },
                    'base64'
                );
            }
        }
    }
    const handleImageRemove = (id) => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API}/removeimage`,
        {public_id: id},
        {
            headers:{
            authtoken: user.token
            }
        }
        )
        .then((res) => {
            setLoading(false);
            const { images } = values;
            let filteredimages = images.filter((item) => {
                return item.public_id !== id
            });
            setValues({...values, images: filteredimages});
        })
        .catch((error) => {
            setLoading(false);

        })
    }
    return (
        <>
        <div className="row">
        {
                values.images && values.images.map((image) => (
                        <Badge
                            count="X"
                            style={{cursor:"pointer"}}
                            key={image.public_id}
                            onClick={() =>handleImageRemove(image.public_id)}
                        >
                            <Avatar
                                src={image.url}
                                size={100}
                                shape="square"
                                className="ml-3"
                            />
                        </Badge>
                    )
                )
            }
        </div>
        <br/>
        <div className="row">
            <label className="btn btn-primary btn-raised mb-3">
                Choose File
                <input
                    type="file"
                    multiple
                    hidden
                    accept="images/*"
                    onChange={fileUploadAndResize}
                />
            </label>
        </div>
        </>
    )
}

export default FileUpload;