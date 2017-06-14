import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { Link } from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader } from 'material-ui/Card';
import '../css/BlogHome.css';

const style = {
  floatingButton: {
    position: 'fixed',
    bottom: '5%',
    right: '5%',
  },
};

export default class BlogHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      posts: [],
      newContent: '',
      newTitle: '',
    };
    // this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleSubmitBtnClick = this.handleSubmitBtnClick.bind(this);
    // this.handleChangeReply = this.handleChangeReply.bind(this);
    // this.handleCreateReply = this.handleCreateReply.bind(this);
  }

  componentWillMount() {
    fetch('/getTitles')
      .then(res => res.json())
      .then(posts => this.setState({ posts }))
      .catch(err => console.log(err));
    console.log(process.env.NODE_ENV);
    console.log(`MONGODB_URI = ${process.env.MONGODB_URI}`);
  }

  handleSubmitBtnClick() {
    if (this.state.newTitle !== '') {
      let posts = this.state.posts;
      fetch('/post', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // id: posts.length,
          title: this.state.newTitle,
          content: this.state.newContent,
          time: Date(),
        }),
      });

      const newPost = {
        // id: posts.length,
        // userName: this.state.userName,
        title: this.state.newTitle,
        content: this.state.newContent,
        time: Date(),
      };
      posts = posts.concat(newPost);
      this.setState({
        dialogOpen: false,
        newTitle: '',
        newContent: '',
        posts,
      });
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={() => {
          this.setState({
            dialogOpen: false,
            newTitle: '',
            newContent: '',
          });
        }}
      />,
      <RaisedButton
        label="Submit"
        primary
        onTouchTap={this.handleSubmitBtnClick}
      />,
    ];

    const titles = this.state.posts.map(x =>
      <Link to={`/post/${x._id}`}>
        <Card
          style={{
            margin: '10px',
          }}
        >
          <CardHeader
            title={x.title}
            titleStyle={{
              fontSize: '50px',
            }}
            subtitle={x.time}
          />
        </Card>
      </Link>,
   ).reverse();

    return (
      <div>
        {titles}
        <FloatingActionButton
          style={style.floatingButton}
          onTouchTap={() => {
            this.setState({
              dialogOpen: true,
            });
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title="Add New Post"
          actions={actions}
          open={this.state.dialogOpen}
          autoScrollBodyContent
        >
          <div className="content-input">
            <TextField
              fullWidth
              hintText="Title"
              hintStyle={{
                fontSize: '18px',
              }}
              inputStyle={{
                fontSize: '18px',
              }}
              value={this.state.newTitle}
              onChange={(e) => {
                this.setState({ newTitle: e.target.value });
              }}
            />
            <textarea
              cols="45" rows="25"
              value={this.state.newContent}
              onChange={(e) => {
                this.setState({ newContent: e.target.value });
              }}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}
