import React from 'react';
import {View, emit} from '../../src/re-structure';
import {timer, timeColor, setTimeColor} from './db';

import './simple.css';

let Clock = @View class Clock extends React.Component {
    static projections = {timer, timeColor};
    format = date => `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    render() {
        return (
            <div className="example-clock" style={{color: this.props.timeColor}}>
                {this.format(this.props.timer)}
            </div>
        );
    }
}

let ColorInput = @View class ColorInput extends React.Component {
    static projections = {timeColor};
    render() {
        return (
            <div className="color-input">
                Time Color: <input type="text"
                                   value={this.props.timeColor}
                                   onChange={e => emit(setTimeColor, {color: e.target.value})}/>
            </div>
        );
    }
}

export default @View class Simple extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World, it is now</h1>
                <Clock />
                <ColorInput />
            </div>
        );
    }
}