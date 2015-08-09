import React from 'react/addons';
import Immutable from 'immutable';
let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import {View, emit} from '../../src/re-structure';
import {activeCount, completedCount, showing, visibleTodos} from './db';
import {toggleDone, toggleCompleteAll, addTodo, deleteTodo, clearCompleted} from './db';
import './todomvc.css';

let TodoItem = @View class TodoItem extends React.Component {
    static propTypes = {
        todo: React.PropTypes.object.isRequired
    };
    render() {
        let {todo} = this.props;
        return (
            <li className={todo.get('done') ? 'completed' : 'active'}>
                <div className="view">
                    <input type="checkbox" className="toggle"
                           checked={todo.get('done')}
                           onChange={() => emit(toggleDone, {id: todo.get('id')})} />
                    <label>{todo.get('title')}</label>
                    <button className="destroy" onClick={() => emit(deleteTodo, {id: todo.get('id')})}></button>
                </div>
                <input className="edit" />
            </li>
        );
    }
};

let StatsFooter = @View class StatsFooter extends React.Component {
    static projections = {activeCount, completedCount, showing};
    render() {
        let {activeCount, completedCount, showing} = this.props;
        return (
            (activeCount === 0 && completedCount === 0) ? null :
            <footer className="footer">
                <span className="todo-count"><strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left</span>
                <ul className="filters">
                    <li><a className={showing === 'all' ? 'selected': ''} href="#/">All</a></li>
                    <li><a href="#/active" className={showing === 'active' ? 'selected': ''}>Active</a></li>
                    <li><a href="#/completed" className={showing === 'completed' ? 'selected' : ''}>Completed</a></li>
                </ul>
                {completedCount === 0 ? null :
                    <button className="clear-completed" onClick={() => emit(clearCompleted)}>Clear completed</button>}
            </footer>
        );
    }
};

export default @View class TodoApp extends React.Component {
    static projections = {visibleTodos, completedCount};
    state = {title: ''}
    save = () => {
        emit(addTodo, {title: this.state.title});
        this.setState({title: ''});
    }
    render() {
        let {visibleTodos, completedCount} = this.props;
        return (
            <div>
                <section className="todoapp">
                    <header className="header">
                        <h1>todos</h1>
                        <input className="new-todo"
                               placeholder="What needs to be done?"
                               value={this.state.title}
                               onChange={e => this.setState({title: e.target.value.trim()})}
                               onKeyDown={e => e.keyCode === 13 ? this.save() : null}
                               autoFocus />
                    </header>
                    <section className="main">
                        <input type="checkbox" className="toggle-all"
                               checked={completedCount > 0}
                               onChange={() => emit(toggleCompleteAll)} />
                        <label htmlFor="toggle-all">Mark all as complete</label>
                        <ul className="todo-list">
                            <ReactCSSTransitionGroup transitionName="fade">
                                {visibleTodos.map(todo => <TodoItem key={todo.get('id')} todo={todo} />)}
                            </ReactCSSTransitionGroup>
                        </ul>
                    </section>
                    <StatsFooter />
                </section>
                <footer className="info"><p>Double-click to edit a todo</p></footer>
            </div>
        );
    }
};
