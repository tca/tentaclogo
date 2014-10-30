/*

sp <- ' ' / '\n' / '\t'.
_  <- sp _ / .

digit <- '0' / '1' / '2' / '3' / '4' / '5' / '6' / '7' / '8' / '9'.
number <- d:digit ds:number -> (d+ds) / d:digit -> (d).
signed_number <- '-' n:number -> (-parseInt(n)) / n:number -> (parseInt(n)).

arith <- e:aprod -> (['(',e,')'].join('')).
aprod <- a:aexpr ( '*' b:aprod -> ([a,'*',b].join(''))
                 / -> (a)).
aexpr <- a:aterm ( '+' b:aexpr -> ([a,'+',b].join(''))
                 / -> (a)).
aterm <- n:signed_number -> (n)
       / '(' _ a:arith _ ')' -> (a).


cmd <- 'fd' / 'bk' / 'lt' / 'rt' / 'pu' / 'pd'.
command <- c:cmd _ n:aterm -> ([c,'(',n,')'].join(''))
         / 'repeat' _ n:aterm _ '[' body:commands _ ']' -> (['repeat(',n,',',body,')'].join(''))
         / 'if' _ b:aterm _ '[' thn:commands _ ']'  _ '[' els:commands _ ']' -> (['if(',b,',',thn,',',els,')'].join('')).

commands <- _ c1:command _ cr:commands -> (c1+'; '+cr)
          / -> ('').

start <- commands.

*/


function parse_sp(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = literal(input, state.pos, ' ');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '\n');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  state = literal(input, state.pos, '\t');
  if (state) {
  }
  } else stack.pop();
  } else stack.pop();
  return state;
}

function parse__(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = parse_sp(input, state.pos);
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  }
  }
  if (!state) {
    state = stack.pop();
  } else stack.pop();
  return state;
}

function parse_digit(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = literal(input, state.pos, '0');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '1');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '2');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '3');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '4');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '5');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '6');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '7');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, '8');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  state = literal(input, state.pos, '9');
  if (state) {
  }
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  return state;
}

function parse_number(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = parse_digit(input, state.pos);
  if (state) var d = state.val;
  if (state) {
  state = parse_number(input, state.pos);
  if (state) var ds = state.val;
  if (state) {
  if (state) state.val = (d+ds);
  }
  }
  if (!state) {
    state = stack.pop();
  state = parse_digit(input, state.pos);
  if (state) var d = state.val;
  if (state) {
  if (state) state.val = (d);
  }
  } else stack.pop();
  return state;
}

function parse_signed_number(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = literal(input, state.pos, '-');
  if (state) {
  state = parse_number(input, state.pos);
  if (state) var n = state.val;
  if (state) {
  if (state) state.val = (-parseInt(n));
  }
  }
  if (!state) {
    state = stack.pop();
  state = parse_number(input, state.pos);
  if (state) var n = state.val;
  if (state) {
  if (state) state.val = (parseInt(n));
  }
  } else stack.pop();
  return state;
}

function parse_arith(input, pos) {
  var state = { pos: pos };
  var stack = [];
  state = parse_aprod(input, state.pos);
  if (state) var e = state.val;
  if (state) {
  if (state) state.val = (['(',e,')'].join(''));
  }
  return state;
}

function parse_aprod(input, pos) {
  var state = { pos: pos };
  var stack = [];
  state = parse_aexpr(input, state.pos);
  if (state) var a = state.val;
  if (state) {
  stack.push(state);
  state = literal(input, state.pos, '*');
  if (state) {
  state = parse_aprod(input, state.pos);
  if (state) var b = state.val;
  if (state) {
  if (state) state.val = ([a,'*',b].join(''));
  }
  }
  if (!state) {
    state = stack.pop();
  if (state) state.val = (a);
  } else stack.pop();
  if (state) {
  }
  }
  return state;
}

function parse_aexpr(input, pos) {
  var state = { pos: pos };
  var stack = [];
  state = parse_aterm(input, state.pos);
  if (state) var a = state.val;
  if (state) {
  stack.push(state);
  state = literal(input, state.pos, '+');
  if (state) {
  state = parse_aexpr(input, state.pos);
  if (state) var b = state.val;
  if (state) {
  if (state) state.val = ([a,'+',b].join(''));
  }
  }
  if (!state) {
    state = stack.pop();
  if (state) state.val = (a);
  } else stack.pop();
  if (state) {
  }
  }
  return state;
}

function parse_aterm(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = parse_signed_number(input, state.pos);
  if (state) var n = state.val;
  if (state) {
  if (state) state.val = (n);
  }
  if (!state) {
    state = stack.pop();
  state = literal(input, state.pos, '(');
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = parse_arith(input, state.pos);
  if (state) var a = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, ')');
  if (state) {
  if (state) state.val = (a);
  }
  }
  }
  }
  }
  } else stack.pop();
  return state;
}

function parse_cmd(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = literal(input, state.pos, 'fd');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, 'bk');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, 'lt');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, 'rt');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, 'pu');
  if (state) {
  }
  if (!state) {
    state = stack.pop();
  state = literal(input, state.pos, 'pd');
  if (state) {
  }
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  } else stack.pop();
  return state;
}

function parse_command(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = parse_cmd(input, state.pos);
  if (state) var c = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = parse_aterm(input, state.pos);
  if (state) var n = state.val;
  if (state) {
  if (state) state.val = ([c,'(',n,')'].join(''));
  }
  }
  }
  if (!state) {
    state = stack.pop();
  stack.push(state);
  state = literal(input, state.pos, 'repeat');
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = parse_aterm(input, state.pos);
  if (state) var n = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, '[');
  if (state) {
  state = parse_commands(input, state.pos);
  if (state) var body = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, ']');
  if (state) {
  if (state) state.val = (['repeat(',n,',',body,')'].join(''));
  }
  }
  }
  }
  }
  }
  }
  }
  if (!state) {
    state = stack.pop();
  state = literal(input, state.pos, 'if');
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = parse_aterm(input, state.pos);
  if (state) var b = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, '[');
  if (state) {
  state = parse_commands(input, state.pos);
  if (state) var thn = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, ']');
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, '[');
  if (state) {
  state = parse_commands(input, state.pos);
  if (state) var els = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = literal(input, state.pos, ']');
  if (state) {
  if (state) state.val = (['if(',b,',',thn,',',els,')'].join(''));
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  } else stack.pop();
  } else stack.pop();
  return state;
}

function parse_commands(input, pos) {
  var state = { pos: pos };
  var stack = [];
  stack.push(state);
  state = parse__(input, state.pos);
  if (state) {
  state = parse_command(input, state.pos);
  if (state) var c1 = state.val;
  if (state) {
  state = parse__(input, state.pos);
  if (state) {
  state = parse_commands(input, state.pos);
  if (state) var cr = state.val;
  if (state) {
  if (state) state.val = (c1+'; '+cr);
  }
  }
  }
  }
  if (!state) {
    state = stack.pop();
  if (state) state.val = ('');
  } else stack.pop();
  return state;
}

function parse_start(input, pos) {
  var state = { pos: pos };
  var stack = [];
  state = parse_commands(input, state.pos);
  if (state) {
  }
  return state;
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
if (typeof exports !== 'undefined')
    exports.parse_sentence = parse_sentence;
