/* global io */
var socket = io();
socket.emit('private message', { key: "value" });

var ShoutBox = React.createClass({
    render: function () {
        return (
            <div className="shoutbox">
                <h1>Hello, world! I am a shoutbox.</h1>
                <ShoutForm />
                <ShoutList />
            </div>
        );
    }
});

var ShoutList = React.createClass({
    render: function () {
        return (
            <div className="shout-list">
                Hello, world! I am a shout list.
                <Shout author="Israfel">This <strong>is</strong> a shout!</Shout>
                <Shout author="madao">This is <strong>another</strong> shout!</Shout>
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

ReactDOM.render(
    <ShoutBox />,
    document.getElementById('shoutbox')
);