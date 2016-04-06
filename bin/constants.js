
module.exports = {

  ENUM : {
    COMMENT           : 0,
    DATA_TYPE         : 1,
    PROTO             : 2
  },
  COMMENT_START       : '/**',
  COMMENT_END         : '*/',
  DATA_TYPES          : /(^(function|var|const|let)| (function|var|const|let)) (\w+)/gmi,
  PROTO_TYPE          : /(\w+)\.prototype.(\w+)(?:(?:\s*=\s*)(function))?/gmi,
  TAGFORMAT           : /(@[\w]+)([A-Za-z1-9.,!#$\-%|^&*(){}\[\]\'\";:<>\/? ]*)/gmi,
  EXTRACT_TYPE        : /(?:{(\w+)})/gi,
  EXTRACT_NAME        : /(?:\[([\w| =]+)\])/gi,
  EXTRACT_DESC        : /(?:{(\w+)})\s*(?:\[([\w| =]+)\])\s*([\w ]+)/gi,

  STARTING            : 0,
  LOOKING_FOR_COMMENT : 1,
  FOUND_A_COMMENT     : 2

}