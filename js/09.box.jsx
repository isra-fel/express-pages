/* global io */
// var socket = io();
// socket.emit('private message', { key: "value" });

var ShoutBox = React.createClass({
    socket: io(),
    getInitialState: function () {
        return {
            shouts: []
        };
    },
    componentDidMount: function () {
        this.socket.on('connection', function (res) {
            this.setState({shouts: res});
            this.socket.off('connection');
        }.bind(this));
        this.socket.on('shout', function (shout) {
            this.setState({shouts: this.state.shouts.concat([shout])})
        }.bind(this));
    },
    _onShoutSubmit: function (shout) {
        this.socket.emit('shout', shout);
    },
    render: function () {
        return (
            <div className="shoutbox">
                <h1>Hello, world! I am a shoutbox.</h1>
                <ShoutForm onShoutSubmit={this._onShoutSubmit} />
                <ShoutList shouts={this.state.shouts} />
            </div>
        );
    }
});

var ShoutList = React.createClass({
    _renderShout: function (shout) {
        return (
            <Shout author={shout.author} key={shout.id}>{shout.body}</Shout>
        )
    },
    render: function () {
        return (
            <div className="shout-list">
                Hello, world! I am a shout list.
                {this.props.shouts.map(this._renderShout)}
            </div>
        );
    }
});

var ShoutForm = React.createClass({
    getInitialState: function () {
        return {author: '', body: ''};
    },
    _handleAuthorChange: function (e) {
        this.setState({author: e.target.value});
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
            <form className="shout-form" onSubmit={this._handleSubmit}>
                <input type="text" placeholder="username" value={this.state.author} onChange={this._handleAuthorChange} />
                <input type="text" placeholder="say something..." value={this.state.body} onChange={this._handleShoutBodyChange} />
                <input type="submit" value="post" />
            </form>
        );
    }
});

var Shout = React.createClass({
    render: function () {
        return (
            <div className="shout">
                <span className="author">
                    {this.props.author}
                </span>
                <span className="shout-body">
                    {this.props.children}
                </span>
            </div>
        );
    }
});

var shouts = [{
    author: "Israfel",
    content: "a shout",
    id: "A001"
}, {
    author: "madao",
    content: "another shout",
    id: "A002"
}];

ReactDOM.render(
    <ShoutBox shouts={shouts} />,
    document.getElementById('shoutbox')
);