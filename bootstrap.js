function rule(n, body) {
  return (["function parse_", n, "(input, pos) {\n",
                  '  var state = { pos: pos };\n',
                  '  var stack = [];\n',
                  body, 
                  '  return state;\n',
               "}\n"].join(''));
}

function sentence2(r, g) {
  return (r + "\n" + g);
}

function sentence1(r) {
  return (r + "\n"
               + 'function parse_char(input, pos) {\n'
               + '  if (pos >= input.length) return null;\n'
               + '  return { pos: pos + 1, val: input.charAt(pos) };\n'
               + '}\n'
               + 'function literal(input, pos, string) {\n'
               + '  if (input.substr(pos, string.length) === string) {\n'
               + '    return { pos: pos + string.length, val: string };\n'
               + '  } else return null;\n'
               + '}\n'
               + "if (typeof exports !== 'undefined')\n"
               + "    exports.parse_sentence = parse_sentence;\n"
           );
}
function nonterminal(n) {
  return ['  state = parse_', n, '(input, state.pos);\n'].join('');
}
function labeled(label, value) {
  return [value, '  if (state) var ', label, ' = state.val;\n'].join('');
}
function sequence(foo, bar) {
  return [foo, '  if (state) {\n', bar, '  }\n'].join('');
}
function string(s) {
  return ["  state = literal(input, state.pos, '", s, "');\n"].join('');
}
function choice(a, b) {
  return [
     '  stack.push(state);\n',
     a,
     '  if (!state) {\n',
     '    state = stack.pop();\n',
     b,
     '  } else {\n',
     '    stack.pop();\n', // discard unnecessary saved state
     '  }\n'].join('');
}
function negation(t) {
  return [
     '  stack.push(state);\n',
     t,
     '  if (state) {\n',
     '    stack.pop();\n',
     '    state = null;\n',
     '  } else {\n',
     '    state = stack.pop();\n',
     '  }\n'].join('');
}
function result_expression(result) {
  return ['  state.val = ', result, ';\n'].join('');
}
function parse_char(input, pos) {
  if (pos >= input.length) return null;
  return { pos: pos + 1, val: input.charAt(pos) };
}
function literal(input, pos, string) {
  if (input.substr(pos, string.length) === string) {
    return { pos: pos + string.length, val: string };
  } else return null;
}
var sp_rule = rule('sp', choice(string(' '), choice(string('\\n'), 
                                                    string('\\t'))));
var __rule = rule('_',
                  choice(sequence(nonterminal('sp'), nonterminal('_')), 
                         ''));
function nseq() {
  var rv = arguments[arguments.length-1];
  for (var ii = arguments.length-2; ii >= 0; ii--)
    rv = sequence(arguments[ii], rv);
  return rv;
}
var rule_rule = rule('rule',
    nseq(labeled('n', nonterminal('name')), nonterminal('_'),
         string('<-'), nonterminal('_'),
         labeled('body', nonterminal('choice')), 
         string('.'), nonterminal('_'),
         result_expression(
            "[\"function parse_\", n, \"(input, pos) {\\n\",\n" +
            "                      '  var state = { pos: pos };\\n',\n" +
            "                      '  var stack = [];\\n',\n" +
            "                      body, \n" +
            "                      '  return state;\\n',\n" +
            "                   \"}\\n\"].join('')")));
var sentence_rule = rule('sentence',
    choice(
        nseq(nonterminal('_'),
             labeled('r', nonterminal('rule')),
             labeled('g', nonterminal('sentence')),
             result_expression('r + "\\n" + g')),
        nseq(nonterminal('_'),
             labeled('r', nonterminal('rule')),
             result_expression('r + "\\n"\n' +
        "+ 'function parse_char(input, pos) {\\n'\n" +
        "+ '  if (pos >= input.length) return null;\\n'\n" +
        "+ '  return { pos: pos + 1, val: input.charAt(pos) };\\n'\n" +
        "+ '}\\n'\n" +
        "+ 'function literal(input, pos, string) {\\n'\n" +
        "+ '  if (input.substr(pos, string.length) === string) {\\n'\n" +
        "+ '    return { pos: pos + string.length, val: string };\\n'\n" +
        "+ '  } else return null;\\n'\n" +
        "+ '}\\n'\n" +
        "+ 'if (typeof exports !== "+'"undefined"'+") {\\n'\n" +
        "+ '    exports.parse_sentence = parse_sentence;\\n'\n" +
        "+ '}\\n'\n"))));
function nchoice() {
  var rv = arguments[arguments.length-1];
  for (var ii = arguments.length-2; ii >= 0; ii--)
    rv = choice(arguments[ii], rv);
  return rv;
}

var meta_rule = rule('meta',
  nchoice(string('!'), string('\\\''), string('<-'), string('/'),
          string('.'), string('('),    string(')'),  string(':'),
          string('->')));
var name_rule = rule('name', 
    choice(nseq(labeled('c', nonterminal('namechar')),
                labeled('n', nonterminal('name')),
                result_expression('c + n')),
           nonterminal('namechar')));
var namechar_rule = rule('namechar',
    nseq(negation(nonterminal('meta')),
         negation(nonterminal('sp')), nonterminal('char')));
var term_rule = rule('term',
    nchoice(nonterminal('labeled'), nonterminal('nonterminal'), 
            nonterminal('string'),  nonterminal('negation'),
            nonterminal('parenthesized')));
var nonterminal_rule = rule('nonterminal',
    nseq(labeled('n', nonterminal('name')), nonterminal('_'),
         result_expression("['  state = parse_', n, " +
                           "'(input, state.pos);\\n'].join('')")));
var labeled_rule = rule('labeled',
    nseq(labeled('label', nonterminal('name')), nonterminal('_'),
         string(':'), nonterminal('_'),
         labeled('value', nonterminal('term')),
         result_expression("[value, '  if (state) var ', " +
                           "label, ' = state.val;\\n'].join('')")));
var sequence_rule = rule('sequence',
    nchoice(nseq(labeled('foo', nonterminal('term')),
                 labeled('bar', nonterminal('sequence')),
                 result_expression("[foo, '  if (state) {\\n', " +
                                   "bar, '  }\\n'].join('')")),
            nonterminal('result_expression'),
            sequence(result_expression("''"))));
var string_rule = rule('string',
    nseq(string("\\'"), labeled('s', nonterminal('stringcontents')),
         string("\\'"), nonterminal('_'),
         result_expression('["  state = literal(input, state.pos, ' +
                           '\'", s, "\');\\n"].join(\'\')')));
var stringcontents_rule = rule('stringcontents',
    nchoice(nseq(negation(string("\\\\")), negation(string("\\'")),
                 labeled('c', nonterminal('char')),
                 labeled('s', nonterminal('stringcontents')),
                 result_expression('c + s')),
            nseq(labeled('b', string("\\\\")),
                 labeled('c', nonterminal('char')),
                 labeled('s', nonterminal('stringcontents')),
                 result_expression('b + c + s')),
            result_expression("''")));
var choice_rule = rule('choice',
    choice(nseq(labeled('a', nonterminal('sequence')),
                string('/'), nonterminal('_'),
                labeled('b', nonterminal('choice')),
                result_expression(
                    "['  stack.push(state);\\n',\n" +
                    " a,\n" +
                    " '  if (!state) {\\n',\n" +
                    " '    state = stack.pop();\\n',\n" +
                    " b,\n" +
                    " '  } else {\\n',\n" +
                    " '    stack.pop();\\n',\n" +
                    " '  }\\n'].join('')")),
           nonterminal('sequence')));
var negation_rule = rule('negation',
    nseq(string('!'), nonterminal('_'), labeled('t', nonterminal('term')),
         result_expression(
                    "['  stack.push(state);\\n',\n" +
                    " t,\n" +
                    " '  if (state) {\\n',\n" +
                    " '    stack.pop();\\n',\n" +
                    " '    state = null;\\n',\n" +
                    " '  } else {\\n',\n" +
                    " '    state = stack.pop();\\n',\n" +
                    " '  }\\n'].join('')")));
var result_expression_rule = rule('result_expression',
    nseq(string('->'), nonterminal('_'), 
         labeled('result', nonterminal('expr')),
         result_expression("['  if (state) state.val = ', " +
                           "result, ';\\n'].join('')")));
var expr_rule = rule('expr',
    nseq(string('('), nonterminal('_'),
         labeled('e', nonterminal('exprcontents')),
         string(')'), nonterminal('_'),
         result_expression('e')));
var inner_rule = rule('inner',
    nseq(string('('), nonterminal('_'),
         labeled('e', nonterminal('exprcontents')),
         string(')'),
         result_expression("'(' + e + ')'")));
var exprcontents_rule = rule('exprcontents',
    choice(
        nseq(labeled('c',
                     choice(nseq(negation(string('(')),
                                 negation(string(')')),
                                 nonterminal('char')),
                            nonterminal('inner'))),
             labeled('e', nonterminal('exprcontents')),
             result_expression('c + e')),
        result_expression("''")));
var parenthesized_rule = rule('parenthesized',
    nseq(string('('), nonterminal('_'),
         labeled('body', nonterminal('choice')),
         string(')'), nonterminal('_'),
         result_expression('body')));
function nsentence() {
  var rv = sentence1(arguments[arguments.length-1]);
  for (var ii = arguments.length-2; ii >= 0; ii--)
    rv = sentence2(arguments[ii], rv);
  return rv;
}

var all_rules = nsentence(sp_rule, __rule, rule_rule, sentence_rule, 
                          meta_rule, name_rule, namechar_rule, term_rule,
                          nonterminal_rule, labeled_rule, sequence_rule,
                          string_rule, stringcontents_rule, choice_rule,
                          negation_rule, result_expression_rule, expr_rule,
                          inner_rule, exprcontents_rule, parenthesized_rule);
eval(all_rules);
if (typeof exports !== 'undefined') exports.parse_sentence = parse_sentence;
