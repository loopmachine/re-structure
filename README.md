
# Re-structure

A pattern for structuring React applications.  Heavily based on the [re-frame](https://github.com/Day8/re-frame) ClojureScript project.

The re-frame [README](https://github.com/Day8/re-frame/blob/master/README.md) pretty much says it all.  This is an approximate adaptation of that idea, meant for building JavaScript applications.

### Examples

See [here](examples).

#### Run the examples locally:

```
npm install
npm run examples
```

Simple time/color example from `reagent`
: http://localhost:8000/simple.bundle

TodoMVC:
: http://localhost:8000/todomvc.bundle

Application "pages":
: http://localhost:8000/pages.bundle

## Concepts

### Application DB

Just like `re-frame` has one global application db structure that holds the entire application state, `re-structure` does too.  Your application db is just a data stucture that you create and initialize yourself.  You can use Immutable.js, which makes rendering more performant, but it's not required; you could use a regular JS object or any other data structure you want.

Once you initialize your db you have to register it with `re-structure` when bootstrapping your app:

```jsx
import {initApp} from 're-structure';

// initialize the application db
let db = Immutable.fromJS({
    timer: new Date(),
    timeColor: '#f34'
});

// register application db with re-structure
initApp(db);

// render your app
React.render(<App />, document.body);
```

`initApp` takes an optional second boolean parameter, which if set tells `re-structure` to log all changes to the db to the developer console.

### Projections

`Projections` are very similar to `sub`s in `re-frame`.  Where in `re-frame` you would do this:

```cljs
(register-sub
  :time-color
  (fn
    [db _]
    (reaction (:time-color @db))))
```

In `re-structure` you do this:

```js
// project a part of the application db 
export function timer(db) {
    return db.get('timer');
}
```

This defines a normal function that takes the current state of the application db as a parameter and returns a "projected" view of it, exactly what the registered `sub` does in the `re-frame` example.  Note that you didn't have to do anything special like register the function or wrap the result in a `reaction`.

### Views

An example `View`:

```jsx
import {timer} from './projections';

// a view is just a decorated React component
export default @View class Clock extends React.Component {
    // declare projections that the view depends on
    static projections = {timer};
    render() {
        {/* the current value of the projection is available as a prop */}
        return <div>{this.props.timer}</div>;
    }
}
```

`Views` have one ability that distinguishes them from normal React components: they can render `projection` values reactively as they change.  When a `View` depends on a `projection`'s results, it declares so in the `static projections` property.  Then, whenever the projection has an updated value (according to `===`), the `View` is automatically re-rendered and the new value is available as a `prop` with the same name (`this.props.timer` in the example above).  This is along the same lines as how `reaction`s are used in `re-frame`/`reagent`.

Beacuse `Views` are just decorated React components, you can still keep local state, use lifecycle methods, etc.

Projections can also be parameterized with `props` values:

```js
static projections = props => ({
    page: db => db.getIn(['pages', props.pageNumber])
});
```

In this example, `projections` defines a function that takes `props` as a parameter and returns an object of the same form as a normal `projections` definition.

### Commands

A `command` is a normal function that takes the current application db value and optional parameters and returns a new version of the application db, with changes applied to it.  It is similar to an `event handler` in `re-frame`.

An example command:

```js
// return a new version of db with an updated timeColor value
export function setTimeColor(db, {color}) {
    return db.set('timeColor', color);
}
```

To emit a command, you do just that:

```jsx
import {setTimeColor} from './commands';

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
```
