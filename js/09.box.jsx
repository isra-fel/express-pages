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
    render: function () {
        return (
            <div className="shoutbox">
                <h1>Hello, world! I am a shoutbox.</h1>
                <ShoutForm />
                <ShoutList shouts={this.state.shouts} />
            </div>
        );
    }
});

var ShoutList = React.createClass({
    _renderShout: function (shout) {
        return (
            <Shout author={shout.author} key={shout.id}>{shout.content}</Shout>
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
    render: function () {
        return (
            <div className="shout-form">
                Hello, world! I am a shout form.
            </div>
            <form className="shout-form">
                <input type="text" placeholder="username" />
                <input type="text" placeholder="say something..." />
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