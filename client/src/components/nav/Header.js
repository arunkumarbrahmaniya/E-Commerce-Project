import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserAddOutlined,
    HomeOutlined, LoginOutlined,
    UserOutlined, 
    LogoutOutlined,
    ShoppingOutlined
} from
    '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Search from '../forms/Search';
const { SubMenu } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('');
    let dispatch = useDispatch();
    let { user } = useSelector((state) => ({...state}));
    let history = useHistory();
    const handleClick = (e) => {
        setCurrent(e.key);
    }
    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type:"LOGOUT",
            payload:null
        });
        history.push("/login");
    }
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">
                    Home
                </Link>
            </Menu.Item>
            <Menu.Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">
                    Shop
                </Link>
            </Menu.Item>
            {
                (!user && (
                    <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
                        <Link to="/register">
                            Register
                        </Link>
                    </Menu.Item>
                ))
            }
            {
                (!user && (
                    <Menu.Item key="login" icon={<LoginOutlined />} className="float-right">
                        <Link to="/login">
                            Login
                        </Link>
                    </Menu.Item>
                ))
            }
            {
                (user && (
                    <SubMenu key="SubMenu" icon={ <UserOutlined />} title={user.email && user.email.split('@')[0]} className="float-right">
                        {user && user.role === 'subscriber' && 
                            <Menu.Item>
                                <Link to="/user/history">
                                    Dashboard
                                </Link>
                            </Menu.Item>
                        }
                        {user && user.role === 'admin' && 
                            <Menu.Item>
                                <Link to="/admin/dashboard">
                                    Dashboard
                                </Link>
                            </Menu.Item>
                        }
                        <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
                            Logout
                        </Menu.Item>
                    </SubMenu>
                ))
            }
            <span className="float-right p-1">
                <Search/>
            </span>
      </Menu>
    )
}

export default Header;