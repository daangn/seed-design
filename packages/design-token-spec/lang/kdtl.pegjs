{
  function stringifyToken(token) {
    switch (token.prefix) {
      case '$scale':
        return [token.prefix, token.target, token.name].join('/');
      case '$semantic':
        return [token.prefix, token.group, token.value].join('/');
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
  = token:Semantic _ op:BindOperator _ binding:Scale EOL {
    return { op, token, binding };
  }

ScaleTokenDefinition
  = ColorScaleTokenDefinition
  / OpacityScaleTokenDefinition
  / FontSizeScaleTokenDefinition
  / FontWeightScaleTokenDefinition
  / LineHeightScaleTokenDefinition


ColorScaleTokenDefinition
  = token:ColorScale _ op:BindOperator _ binding:ColorLit EOL {
    return { op, token: stringifyToken(token), binding };
  }
  
OpacityScaleTokenDefinition
  = token:OpacityScale _ op:BindOperator _ binding:PercentLit EOL {
    return { op, token: stringfyToken(token), binding };
  }

FontSizeScaleTokenDefinition
  = token:FontSizeScale _ op:BindOperator _ binding:PointLit EOL {
    return { op, token: stringifyToken(token), binding };
  }

FontWeightScaleTokenDefinition
  = token:FontWeightScale _ op:BindOperator _ binding:FontWeightLit EOL {
    return { op, token: stringifyToken(token), binding };
  }

LineHeightScaleTokenDefinition
  = token:LineHeightScale _ op:BindOperator _ binding:(PointLit / PercentLit) EOL {
    return { op, token: stringifyToken(token), binding };
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
  = prefix:ScalePrefix SLASH target:"color" SLASH name:TokenName {
    return { prefix, target, name };
  }

OpacityScale
  = prefix:ScalePrefix SLASH target:"opacity" SLASH name:TokenName {
    return { prefix, target, name };
  }

FontSizeScale
  = prefix:ScalePrefix SLASH target:"font-size" SLASH name:TokenName {
    return { prefix, target, name };
  }

FontWeightScale
  = prefix:ScalePrefix SLASH target:"font-weight" SLASH name:TokenName {
    return { prefix, target, name };
  }

LineHeightScale
  = prefix:ScalePrefix SLASH target:"line-height" SLASH name:TokenName {
    return { prefix, target, name };
  }

TokenName
  = [a-z]+ ("-" [a-z]+)* {
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
  / ColorRgbLit

ColorHexLit "#FFFFFF"
  = "#" HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG {
    return text();
  }

ColorRgbLit "rgb(R, G, B)"
  = "rgb" FUNC_OPEN _ r:INTEGER _ SEP _ g:INTEGER _ SEP _ b:INTEGER _ FUNC_CLOSE {
    if (r < 0 || r > 255) error('r must be 0 ~ 255');
    if (g < 0 || g > 255) error('g must be 0 ~ 255');
    if (b < 0 || b > 255) error('b must be 0 ~ 255');
    return { r, g, b };
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

StringLit
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
