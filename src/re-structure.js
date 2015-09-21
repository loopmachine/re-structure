import React from 'react';

let debug;

let scanner;
export function initApp(db, debugOptions={logCommands: false, logProjections: false}) {
    scanner = scan(db, commandHandler);

    if (debugOptions === true) {
        debug = {logCommands: true, logProjections: true};
    } else {
        debug = debugOptions;
    }

    if (!debug.logProjections) {
        return;
    }
    let subscriptionFn = db => console.log("db: %c" + prettyPrint(db), "color:green;")
    let projectionFn = (typeof debug.logProjections === 'function') ? debug.logProjections : db => db;
    scanner.subscribe(subscriptionFn, projectionFn);
}

function commandHandler(db, {command, params}) {
    return command(db, ...params);
}

export function emit(command, ...params) {
    if (!commandIsvalid(command, params)) {
        console.error('a valid command fuction was not provided to emit. command params:' + prettyPrint(params));
        return;
    }
    if (debug.logCommands) {
        logCommand(command, params);
    }
    scanner.push({command, params});
}

function commandIsvalid(command, ...params) {
    return (typeof command === 'function');
}

function logCommand(command, ...params) {
    let output = `${command.name}(${params.map(param => prettyPrint(param)).join(', ')})`;
    console.log("command: %c" + output, "color:blue;");
}

export function View(DecoratedComponent) {
    return class extends React.Component {
        subscriptions = {};

        componentWillMount() {
            if (scanner === undefined) {
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
                if (declarations === undefined) {
                    console.error('projections declaration return value is undefined. did you forget to surround returned obj with parens?');
                    declarations = {};
                }
            }
            for (let name of Object.keys(declarations)) {
                let projectionFn = declarations[name];
                if (typeof projectionFn !== 'function') {
                    console.error('declared projection is not a function: ', name);
                }
                this.subscriptions[name] = scanner.subscribe(value => {
                    this.setState({
                        [name]: value
                    })
                }, projectionFn);
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

function scan(initialState, transformFn) {
    let state = initialState;
    let subscriptions = [];

    function subscribe(subscriptionFn, projectionFn) {
        let currentProjection = project(state, projectionFn);
        subscriptionFn(currentProjection);

        subscriptions.push({subscriptionFn, projectionFn, value: currentProjection});
        return function unsubscribe() {
            subscriptions = subscriptions.filter(subscription => subscription.subscriptionFn !== subscriptionFn);
        }
    }

    function push(event) {
        let prevDb = state;
        state = transformFn(prevDb, event);
        if (prevDb === state) return;

        subscriptions.forEach(subscription => {
            let currentProjection = project(state, subscription.projectionFn);
            if (subscription.value === currentProjection) return;

            subscription.value = currentProjection;
            subscription.subscriptionFn(currentProjection);
        });
    }

    function project(state, projectionFn) {
        return projectionFn ? projectionFn(state) : state;
    }

    return {subscribe, push};
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

function prettyPrint(obj) {
    return JSON.stringify(obj, null, 2)
}
