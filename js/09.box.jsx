/* global io */
var ShoutBox = React.createClass({
    socket: io(),
    getInitialState: function () {
        return {
            shouts: [],
            stat: {}
        };
    },
    componentDidMount: function () {
        this.socket.on('connection', latestShouts => {
            this.setState({shouts: latestShouts});
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
            return <Shout author={shout.author} key={shout._id}>{shout.body}</Shout>;
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
        var newAuthor = e.target.value;
        if (newAuthor.length > 12) {
            newAuthor = newAuthor.substr(0, 12);
        }
        this.setState({author: newAuthor.trim()});
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('author', newAuthor.trim());
        }
    },
    _handleShoutBodyChange: function (e) {
        var newBody = e.target.value;
        if (newBody.length > 140) {
            newBody = newBody.substr(0, 140);
        }
        // do not do trim here!
        this.setState({body: newBody});
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
                <input type="text" className="input-shout-author" placeholder={nls.get('name')} value={this.state.author} onChange={this._handleAuthorChange} />
                <input type="text" className="input-shout-body" placeholder={nls.get('saySomething')} value={this.state.body} onChange={this._handleShoutBodyChange} />
                <input type="submit" className="input-shout-submit pure-button" value={nls.get('post')} />
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
            <small>{nls.get('online').replace('_{0}', props.stat.online || 0)}</small>
        </div>
        <div className="about">
            <small>powered by <a href="http://weibo.com/whynotme">@Israfel</a></small>
        </div>
    </div>
);

var nls = {
    zhcn: {
        name: "名字",
        saySomething: "说些什么吧……",
        post: "发送",
        online: "当前有_{0}人在线"
    },
    enus: {
        name: "name",
        saySomething: "say something...",
        post: "post",
        online: "_{0} guys online"
    },
    get: function(name) {
        switch (navigator.language) {
            case 'zh-CN':
                return this.zhcn[name];
            case 'en-US':
            default:
                return this.enus[name];
        }
    }
};

ReactDOM.render(
    <ShoutBox maxShouts={40} />,
    document.getElementById('shoutbox')
);