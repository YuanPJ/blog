import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
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

export default class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      post: {},
      newContent: '',
      newTitle: '',
    };
    this.handleSubmitBtnClick = this.handleSubmitBtnClick.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.postId;
    fetch(`/post/${id}`)
      .then(res => res.json())
      .then(post => this.setState({ post }))
      .catch(err => console.log(err));
    console.log(`Render post ${id}`);
  }

  handleSubmitBtnClick() {
    if (this.state.newTitle !== '') {
      const id = this.props.match.params.postId;
      const post = this.state.post;
      fetch(`/post/${id}`, {
        method: 'put',
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
      })
      .catch(err => console.log(err));
      post.title = this.state.newTitle;
      post.content = this.state.newContent;
      post.time = Date();
      this.setState({
        dialogOpen: false,
        post,
        newTitle: '',
        newContent: '',
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

    return (
      <div>
        <Card
          style={{
            margin: '10px',
          }}
        >
          <CardHeader
            title={this.state.post.title}
            titleStyle={{
              fontSize: '50px',
            }}
            subtitle={this.state.post.time}
          />
          <pre>{this.state.post.content}</pre>
        </Card>
        <FloatingActionButton
          style={style.floatingButton}
          onTouchTap={() => {
            this.setState({
              dialogOpen: true,
              newTitle: this.state.post.title,
              newContent: this.state.post.content,
            });
          }}
        >
          <ModeEdit />
        </FloatingActionButton>
        <Dialog
          title="Edit Post"
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
