
// see https://github.com/react-bootstrap/react-bootstrap/issues/1914
import React from 'react'
import { Carousel as BootstrapCarousel } from 'react-bootstrap'
export default class Carousel extends BootstrapCarousel {
    direction(prevIndex, index) {
        if (prevIndex === index) {
            return null;
        }

        if (prevIndex === this.props.children.length - 1 && index === 0) {
            return 'next'
        }

        return prevIndex > index ?  'prev' : 'next';
    }

    componentWillReceiveProps(nextProps) {
        const activeIndex = this.getActiveIndex();
        if (nextProps.activeIndex == null && this.state.activeIndex >= nextProps.children.length) {
            this.setState({
                activeIndex: 0,
                previousActiveIndex: null,
                direction: null
            });
        }
    }

}