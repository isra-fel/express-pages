/* global io */
// var socket = io();
// socket.emit('private message', { key: "value" });

var ShoutBox = React.createClass({
    socket: io(),
    getInitialState: function () {
        return {
            shouts: [],
            stat: {}
        };
    },
    componentDidMount: function () {
        this.socket.on('connection', res => {
            this.setState({shouts: res});
            this.socket.off('connection');
        });
        this.socket.on('shout', shout => {
            var maxShouts = this.props.maxShouts || 20;
            var newShouts;
            if (this.state.shouts.length >= maxShouts) {
                newShouts = [shout].concat(this.state.shouts.slice(0, maxShouts - 1));
            } else {
                newShouts = [shout].concat(this.state.shouts);
            }
            this.setState({shouts: newShouts});
        });
        this.socket.on('stat', stat => {
            this.setState({stat: stat});
        });
    },
    _onShoutSubmit: function (shout) {
        this.socket.emit('shout', shout);
    },
    render: function () {
        return (
            <div className="shoutbox">
                <ShoutForm onShoutSubmit={this._onShoutSubmit} />
                <ShoutList shouts={this.state.shouts} />
                <Stat stat={this.state.stat} />
            </div>
        );
    }
});

var ShoutList = props => (
    <div className="shout-list">
        {props.shouts.map(function (shout) {
            return <Shout author={shout.author} key={shout.id}>{shout.body}</Shout>;
        })}
    </div>
);

var ShoutForm = React.createClass({
    getInitialState: function () {
        var localAuthor = (typeof(Storage) !== 'undefined') ?
            localStorage.getItem('author') : undefined;
        return {author: localAuthor || '', body: ''};
    },
    _handleAuthorChange: function (e) {
        this.setState({author: e.target.value});
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('author', e.target.value.trim());
        }
    },
    _handleShoutBodyChange: function (e) {
        this.setState({body: e.target.value});
    },
    _handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim(),
            body = this.state.body.trim();
        if (!author || !body) {
            return;
        }
        this.props.onShoutSubmit({author: author, body: body});
        this.setState({body: ''});
    },
    render: function () {
        return (
            <form className="shout-form pure-form" onSubmit={this._handleSubmit}>
                <input type="text" placeholder="username" value={this.state.author} onChange={this._handleAuthorChange} />
                <input type="text" placeholder="say something..." value={this.state.body} onChange={this._handleShoutBodyChange} />
                <input type="submit" value="post" className="pure-button" />
            </form>
        );
    }
});

var Shout = props => (
    <div className="shout">
        <span className="author">
            {props.author}
        </span>
        <div className="shout-body">
            {props.children}
        </div>
    </div>
);

var Stat = props => (
    <div className="stat">
        <div className="online">
            当前有{props.stat.online || 0}人在线
        </div>
    </div>
);

ReactDOM.render(
    <ShoutBox maxShouts={40} />,
    document.getElementById('shoutbox')
);