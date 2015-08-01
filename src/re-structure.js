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
        updates.onValue(db => console.log("db: %c" + prettyPrint(db.toJS()), "color:green;"));
    }
}

export function emit(command, ...params) {
    if (debugEnabled) {
        let output = `${command.name}(${params.map(param => prettyPrint(param)).join(', ')})`;
        console.log("command: %c" + output, "color:blue;");
    }
    commands.push({command, params});
}

function handleCommand(db, {command, params}) {
    return command(db, ...params);
}

export function View(DecoratedComponent) {
    return class extends React.Component {
        subscriptions = {};

        componentWillMount() {
            if (DecoratedComponent.projections === undefined) {
                return;
            }
            if (updates === undefined) {
                throw Error('Application db has not yet been initialized. Start with initApp(db).');
            }

            let declarations = {};
            if (typeof DecoratedComponent.projections === 'object') {
                declarations = DecoratedComponent.projections;
            }
            if (typeof DecoratedComponent.projections === 'function') {
                declarations = DecoratedComponent.projections(this.props);
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
        componentWillUnmount() {
            for (let name of Object.keys(this.subscriptions)) {
                this.subscriptions[name].unsubscribe();
            }
        }
        shouldComponentUpdate(nextProps, nextState) {
            return !objectEquals(this.props, nextProps) || !objectEquals(this.state, nextState);
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