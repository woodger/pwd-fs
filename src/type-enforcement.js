const TypeEnforcement = require('type-enforcement');

module.exports = new TypeEnforcement({
  '#constructor()': {
    src: String
  },
  '#bitmask()': {
    mode: Number
  },
  '#test()': {
    src: String,
    flag: String,
    resolve: Boolean
  },
  '#stat()': {
    src: String,
    resolve: Boolean
  },
  '#chmod()': {
    src: String,
    mode: Number,
    resolve: Boolean
  },
  '#chown()': {
    src: String,
    uid: Number,
    gid: Number,
    resolve: Boolean
  },
  '#symlink()': {
    src: String,
    use: String,
    resolve: Boolean
  },
  '#copy()': {
    src: String,
    dir: String,
    umask: Number,
    resolve: Boolean
  },
  '#rename()': {
    src: String,
    use: String,
    resolve: Boolean
  },
  '#remove()': {
    src: String,
    resolve: Boolean
  },
  '#read()': {
    src: String,
    encoding: String,
    flag: String,
    resolve: Boolean
  },
  '#write()': {
    src: String,
    encoding: String,
    umask: Number,
    flag: String,
    resolve: Boolean
  },
  '#append()': {
    src: String,
    encoding: String,
    umask: Number,
    flag: String,
    resolve: Boolean
  },
  '#readdir()': {
    dir: String,
    encoding: String,
    resolve: Boolean
  },
  '#mkdir()': {
    dir: String,
    umask: Number,
    resolve: Boolean
  }
});
