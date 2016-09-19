
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
  EXTRACT_DESC        : /^([A-Za-z1-9.,!#$\-%|^&*(){}\[\]\'\";:<>\/? ]*)(?:@)/gmi,
  EXTRACT_TYPE        : /(?:{([A-Za-z1-9.,!#$\-%|^&*(){}\[\]\'\";:<>\/? ]*)})(?:\s*)([A-Za-z1-9.,!#$\-%|^&*(){}\[\]\'\";:<>\/?]*)/gi,
  EXTRACT_NAME        : /(?:\[([\w| =]+)\])/gi,

  STARTING            : 0,
  LOOKING_FOR_COMMENT : 1,
  FOUND_A_COMMENT     : 2,

  HEADER              : '### <a href="#{{link}}" name="{{link}}">Needle.{{header}}()</a>\n',
  PROPERTY            : '**{{name}}** - *{{type}}* - {{description}}.\n',
  FUNCTION_START      : ' - **{{function}}**(',
  PARAMS              : '< _{{type}}_ >{{name}}',
  FUNCTION_END        : ') - *{{return}}* - {{description}}\n',

  DESCRIPTION         : 'description'

}
