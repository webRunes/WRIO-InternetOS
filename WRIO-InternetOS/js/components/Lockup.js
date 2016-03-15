import React from 'react';



class LockupScreen extends React.Component {

    componentDidUpdate() {
        var hash = window.location.hash;
        window.location.hash = '';
        window.location.hash = hash;
    }

    render () {
        return (
            <div class="content col-xs-12 col-sm-5 col-md-7">
            <div class="margin">
                <aside>
                    <ul class="info nav nav-pills nav-stacked" id="profile-accordion">
                        <li class="panel">
                            <a href="#profile-element" data-parent="#profile-accordion" data-toggle="collapse"><span class="glyphicon glyphicon-chevron-down pull-right"></span>Lock up or switch user</a>
                            <div class="in" id="profile-element">
                                <div class="media">
                                    <div class="callout">
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
                <ul class="breadcrumb">
                    <li class="active">I'm Anonymous</li>
                </ul>
                <div id="cover-carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="item active">
                            <div class="img" style="background:url('img/animated.jpg') center center;background-size: cover;" id="container"></div>
                            <div class="carousel-caption">
                                <div class="carousel-text">
                                    <h2>Alexey Anshakov <sup>Standart account &middot; <a href="upgrade.htm">Upgrade</a></sup></h2>
                                    <h6>My motto</h6>
                                    <div class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam risus nulla, commodo vitae tincidunt quis, bibendum at felis. Donec placerat nisl ac libero lacinia, vel pellentesque metus placerat.</div>
                                    <ul class="features">
                                        <li><span class="glyphicon glyphicon-ok"></span>Люблю читать и играть на гитаре</li>
                                        <li><span class="glyphicon glyphicon-ok"></span>Моя цель - захватить Мир</li>
                                    </ul>
                                    <button type="button" class="btn btn-success btn-lg"><span class="glyphicon glyphicon-user"></span>Login with Twitter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

LockupScreen.proptypes = {

};

module.exports = LockupScreen;
