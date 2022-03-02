{
  function stringifyToken(token) {
    switch (token.prefix) {
      case '$scale':
      case '$static':
        return [token.prefix, token.target, token.name].join('/');
      case '$semantic':
        return [token.prefix, token.group, token.name].join('/');
    }
  }
}

KDT
  = "\n"* defs:Definition* EOF {
    return defs;
  }

Definition
  = ScaleTokenDefinition
  / SemanticTokenDefinition
  / CommentDefinition
  / DeclarationOnly

SemanticTokenDefinition
  = token:Semantic _ rule:Condition? _ op:BindOperator _ binding:Scale EOL {
    return { op, rule, token, binding };
  }

ScaleTokenDefinition
  = ColorScaleTokenDefinition
  / OpacityScaleTokenDefinition
  / FontSizeScaleTokenDefinition
  / FontWeightScaleTokenDefinition
  / LineHeightScaleTokenDefinition


ColorScaleTokenDefinition
  = token:ColorScale _ rule:Condition? _ op:BindOperator _ binding:ColorLit EOL {
    return { op, rule, token: stringifyToken(token), binding };
  }

OpacityScaleTokenDefinition
  = token:OpacityScale _ rule:Condition? _ op:BindOperator _ binding:PercentLit EOL {
    return { op, rule, token: stringfyToken(token), binding };
  }

FontSizeScaleTokenDefinition
  = token:FontSizeScale _ rule:Condition? _ op:BindOperator _ binding:PointLit EOL {
    return { op, rule, token: stringifyToken(token), binding };
  }

FontWeightScaleTokenDefinition
  = token:FontWeightScale _ rule:Condition? _ op:BindOperator _ binding:FontWeightLit EOL {
    return { op, rule, token: stringifyToken(token), binding };
  }

LineHeightScaleTokenDefinition
  = token:LineHeightScale _ rule:Condition? _ op:BindOperator _ binding:(PointLit / PercentLit) EOL {
    return { op, rule, token: stringifyToken(token), binding };
  }

Condition
  = "@" cond:TokenName ":" when:TokenName {
    return { cond, when };
  }

DeclarationOnly
  = token:(Scale / Semantic) EOL {
    return { token }
  }

CommentDefinition
  = token:(Scale / Semantic) _ op:CommentOperator _ comment:StringLit EOL {
    return { type: "comment", token: stringifyToken(token), comment }
  }

Semantic
  = prefix:SemanticPrefix SLASH group:TokenName SLASH name:TokenName {
    return { prefix, group, name };
  }

Scale
  = ColorScale
  / OpacityScale
  / FontSizeScale
  / FontWeightScale
  / LineHeightScale

ColorScale
  = prefix:(ScalePrefix / StaticPrefix) SLASH target:"color" SLASH name:TokenName {
    return { prefix, target, name };
  }

OpacityScale
  = prefix:(ScalePrefix / StaticPrefix) SLASH target:"opacity" SLASH name:TokenName {
    return { prefix, target, name };
  }

FontSizeScale
  = prefix:(ScalePrefix / StaticPrefix) SLASH target:"font-size" SLASH name:TokenName {
    return { prefix, target, name };
  }

FontWeightScale
  = prefix:(ScalePrefix / StaticPrefix) SLASH target:"font-weight" SLASH name:TokenName {
    return { prefix, target, name };
  }

LineHeightScale
  = prefix:(ScalePrefix / StaticPrefix) SLASH target:"line-height" SLASH name:TokenName {
    return { prefix, target, name };
  }

TokenName
  = [a-z][a-z0-9]+ ("-" [a-z0-9]+)* {
    return text();
  }

SemanticPrefix
  = "$semantic" {
    return text();
  }

ScalePrefix
  = "$scale" {
    return text();
  }

StaticPrefix
  = "$static" {
    return text();
  }

ExpressionPrefix
  = "%"

// operators

BindOperator
  = "->"

CommentOperator
  = "#>"

// literals

ColorLit
  = ColorHexLit
  / ColorRgbaLit
  / ColorRgbLit

ColorHexLit "hex"
  = "#" code:HEXDIG+ {
    switch (code.length) {
      case 3:
      case 4:
      case 6:
      case 8:
        return text();
    }
    error('Invalid color code: ' + text());
  }

ColorRgbLit "rgb()"
  = "rgb" FUNC_OPEN _ r:INTEGER _ SEP _ g:INTEGER _ SEP _ b:INTEGER _ FUNC_CLOSE {
    if (r < 0 || r > 255) error('Invalid value must be 0 ~ 255, but got ' + r);
    if (g < 0 || g > 255) error('Invalid value must be 0 ~ 255, but got ' + g);
    if (b < 0 || b > 255) error('Invalid value must be 0 ~ 255, but got ' + b);
    return { r, g, b };
  }

ColorRgbaLit "rgba()"
  = "rgba" FUNC_OPEN _ r:INTEGER _ SEP _ g:INTEGER _ SEP _ b:INTEGER _ SEP _ a:NUMBER _ FUNC_CLOSE {
    if (r < 0 || r > 255) error('Invalid color code: value must be 0 ~ 255, but got ' + r);
    if (g < 0 || g > 255) error('Invalid color code: value must be 0 ~ 255, but got ' + g);
    if (b < 0 || b > 255) error('Invalid color code: value must be 0 ~ 255, but got ' + b);
    if (a < 0 || a > 1) error('Invalid color code: alpha must be 0.0 ~ 1.0, but got ' + a.toFixed(1));
    return { r, g, b, a };
  }

FontWeightLit
  = "thin"
  / "regular"
  / "bold"

PointLit "point"
  = value:INTEGER "pt" {
    return { type: 'point', value } ;
  }

PercentLit "percent"
  = value:NUMBER "%" {
    return { type: 'percent', value };
  }

StringLit "quoted string"
  = DoubleQuotedStringLit
  / SingleQuotedStringLit

DoubleQuotedStringLit
  = '"' chars:([^\n\r\f"])* '"' {
  	return chars.join('');
  }

SingleQuotedStringLit
  = "'" chars:([^\n\r\f'])* "'" {
  	return chars.join('');
  }

// macros

FUNC_OPEN "function opening ("
  = "("

FUNC_CLOSE "function closing )"
  = ")"

HEXDIG "hexadecimal"
  = [0-9a-fA-F]

NUMBER "number"
  = INTEGER ("." [0-9]+)? (("e" / "E") ("+" / "-")? [0-9]+)? {
    return parseFloat(text());
  }

INTEGER "integer"
  = "-"? ("0" / ([1-9] [0-9]*)) {
    return parseInt(text())
  }

SLASH
  = "/"

SEP "comma"
  = ","

EOL "end of line"
  = ";"? "\n"*

EOF "end of file"
  = "\n"*

_ "space"
  = " "*
