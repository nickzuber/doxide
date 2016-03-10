
module.exports = {

  ENUM : {
    COMMENT     : 0,
    DATA_TYPE   : 1,
    PROTO       : 2
  },
  COMMENT_START : '/**',
  COMMENT_END   : '*/',
  DATA_TYPES    : /(^(function|var|const|let)| (function|var|const|let)) (\w+)/gmi,
  PROTO_TYPE    : /(\w+)\.prototype.(\w+)(?:(?:\s*=\s*)(function))?/gmi,
  TAGFORMAT     : /(@[\w]+)([A-Za-z1-9.,!#$%^&*(){}\[\]\'\";:<>\/? ]*)/gmi,

}