const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const mongodbUri = 'mongodb://admin:admin@ds163738.mlab.com:63738/homework-blog-database';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri || process.env.MONGODB_URI || 'mongodb://localhost/blog');
console.log(`MONGODB_URI = ${process.env.MONGODB_URI}`);

const db = mongoose.connection;
db.on('error', (err) => {
  console.log('connection error', err);
});
db.once('open', () => {
  console.log('connectted');
});

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  // id: Number,
  title: String,
  content: String,
  time: String,
});

const Post = mongoose.model('post', PostSchema);

app.use(express.static(`${__dirname}/client/build/`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/public/index.html`);
});

app.get('/getTitles', (req, res) => {
  Post.find()
      .then(posts => res.json(posts));
  console.log('Server get titles');
});

app.get('/post/:postId', (req, res) => {
  const id = req.params.postId;
  Post.findById(id, (err, post) => {
    if (err) console.log(err);
    res.json(post);
    console.log(`Server get post ${id}: ${post}`);
  });
});

app.post('/post', (req, res) => {
  Post.create(req.body)
      .catch(err => console.log(err));
  res.json({ state: 'SUCCESS' });
  console.log('Server post');
});

app.put('/post/:postId', (req, res) => {
  const id = req.params.postId;
  Post.findByIdAndUpdate(id, req.body)
      .catch(err => console.log(err));
  res.json({ state: 'SUCCESS' });
  console.log(`Server edit ${id}`);
});

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), () => {
  console.log(app.get('port'));
});
