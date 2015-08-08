import React from 'react';
import Bacon from 'baconjs';

let debugEnabled = false;

function prettyPrint(obj) {
    return JSON.stringify(obj, null, 2)
}

const commands = new Bacon.Bus();

let updates;
export function initApp(db, debug=false) {
    updates = commands.scan(db, handleCommand).skipDuplicates();
    if (debug) {
        debugEnabled = true;
        updates.onValue(db => console.log("db: %c" + prettyPrint(db), "color:green;"));
    }
}

export function emit(command, ...params) {
    validateCommand(command, params);
    commands.push({command, params});
}

export function emitWithPath(path) {
    return function emit(command, ...params) {
        validateCommand(command, params);
        commands.push({command, params, path});
    }
}

function validateCommand(command, ...params) {
    if (typeof command !== 'function') {
        throw Error('a valid command fuction was not provided to emit. command params:' + prettyPrint(params));
    }
    if (debugEnabled) {
        let output = `${command.name}(${params.map(param => prettyPrint(param)).join(', ')})`;
        console.log("command: %c" + output, "color:blue;");
    }
}

function handleCommand(db, {command, params, path}) {
    if (path) {
        // swap a subset of the db at the location referred to by path
        return db.updateIn(path, db => command(db, ...params))
    }
    return command(db, ...params);
}

export function View(DecoratedComponent) {
    return class extends React.Component {
        subscriptions = {};

        componentWillMount() {
            if (updates === undefined) {
                throw Error('application db has not yet been initialized. Start with initApp(db).');
            }
            this.subscribeToProjections(this.props);
        }
        componentWillReceiveProps(nextProps) {
            // ignore projections that aren't parameterized with props
            if (typeof DecoratedComponent.projections !== 'function') {
                return;
            }
            // re-subscribe when props have changed
            if (!objectEquals(this.props, nextProps)) {
                this.unsubscribeFromProjections();
                this.subscribeToProjections(nextProps);
            }
        }
        componentWillUnmount() {
            this.unsubscribeFromProjections();
        }
        shouldComponentUpdate(nextProps, nextState) {
            return !objectEquals(this.props, nextProps) || !objectEquals(this.state, nextState);
        }
        subscribeToProjections(props) {
            if (DecoratedComponent.projections === undefined) {
                return;
            }

            let declarations = {};
            if (typeof DecoratedComponent.projections === 'object') {
                declarations = DecoratedComponent.projections;
            }
            if (typeof DecoratedComponent.projections === 'function') {
                declarations = DecoratedComponent.projections(props);
            }
            for (let name of Object.keys(declarations)) {
                let projectionFn = declarations[name];
                let projection = updates.map(projectionFn);

                this.subscriptions[name] = projection
                    .skipDuplicates()
                    .onValue(value => this.setState({
                        [name]: value
                    }));
            }
        }
        unsubscribeFromProjections() {
            for (let name of Object.keys(this.subscriptions)) {
                this.subscriptions[name]();
            }
        }
        render() {
            return <DecoratedComponent {...this.props} {...this.state} />
        }
    }
}

function objectEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    for (let prop of aKeys) {
        if (a[prop] !== b[prop]) {
            return false;
        }
    }
    return true;
}