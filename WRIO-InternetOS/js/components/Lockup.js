import React from 'react';
import UserStore from '../store/UserStore.js';
import Login from '../../../widgets/Login.jsx';


var imgStyle = {
    background: "url('//default.wrioos.com/img/animated.jpg') center center",
    'backgroundSize': 'cover'
};

var backStyle = {
    background: "url('//default.wrioos.com/img/welcome_back-cover.jpg') center center",
    'backgroundSize': 'cover'
};


class LockupHeader extends React.Component {
    render() {
        return (
            <div className="margin">
            <aside>
                <ul className="info nav nav-pills nav-stacked" id="profile-accordion">
                    <li className="panel">
                        <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse"><span className="glyphicon glyphicon-chevron-down pull-right"></span>Lock up or switch user</a>
                        <div className="in" id="profile-element">
                            <div className="media">
                                <div className="callout">
                                    <h5>Choose user</h5>
                                    <p>Выберите пользователя чтобы продолжить. <a href="#">Learn more</a>.</p>
                                    <p>Если у вас уже есть учетная запись WRIO, нажмите <a href="lock_up_add.htm">здесь</a>.</p>
                                    <p>Свяжитесь с <a href="mailto:info@webrunes.com?subject=Login issue">нами</a> если у вас возникли проблемы с авторизацией.</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </aside>
            <ul className="breadcrumb">
                <li className="active">I'm Anonymous</li>
            </ul>
            </div>);
    }
}

class LockupImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            description:"",
            name: "",
            users:[]
        };
        this.gotHistory = false;
    }

    getUserHistory() {
        UserStore.getLoggedUsers().then((users)=>{
            var result = [];
            this.gotHistory = true;

            if (users) {
                Object.values(users).forEach((value) => {
                    result.push(value);
                });
            }

            this.setState({
                users:result
            });
        });
    }

    componentDidMount() {
        this.getUserHistory();
    }

    getCarouselItem(user) {
        console.log(user);
        return (
        <div className="carousel-text" key={user.id}>
            <h2>{user.name} &nbsp;<sup>Standart account &middot; <a href="upgrade.htm">Upgrade</a></sup></h2>
            <h6>My motto</h6>
            <div className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam risus nulla, commodo vitae tincidunt quis, bibendum at felis. Donec placerat nisl ac libero lacinia, vel pellentesque metus placerat.</div>
            <ul className="features">
                <li><span class="glyphicon glyphicon-ok"></span>Люблю читать и играть на гитаре</li>
                <li><span class="glyphicon glyphicon-ok"></span>Моя цель - захватить Мир</li>
            </ul>
            <button type="button" className="btn btn-success btn-lg" onClick={Login.doLogin}>
                <span className="glyphicon glyphicon-user"></span>Login with Twitter</button>
        </div>);
    }

    render() {

        if (this.gotHistory && (this.state.users.length === 0)) {
            return (<WelcomeBack />);
        }

        return (
            <div id="cover-carousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                <div className="item active">
                    <div className="img" style={imgStyle} id="container"></div>
                    <div className="carousel-caption">
                        {this.state.users.map((user) => {
                            return this.getCarouselItem(user);
                        })}
                    </div>
                </div>
            </div>
        </div>);
    }
}

class WelcomeBack extends React.Component {
    render() {
        return (<div id="cover-carousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                <div className="item active">
                    <div className="img" style={backStyle}></div>
                    <div className="carousel-caption">
                        <div className="carousel-text">
                            <h2>Welcome back!</h2>
                            <div className="description">Добавить существующую учетную запись WRIO OS в один клик! Добавление происходит через привязку Твиттер аккаунта.</div>
                            <button type="button" className="btn btn-success btn-lg" onClick={Login.doLogin}>
                                <span className="glyphicon glyphicon-plus"></span>Add user</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}


class LockupScreen extends React.Component {

    componentDidUpdate() {
        var hash = window.location.hash;
        window.location.hash = '';
        window.location.hash = hash;
    }

    render () {
        return (
            <div className="content col-xs-12 col-sm-5 col-md-7">
                <LockupHeader />
                <LockupImage />
        </div>);
    }
}

LockupScreen.proptypes = {

};

module.exports = LockupScreen;
