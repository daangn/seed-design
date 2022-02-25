Definition 
  = expressions:(_ (Binding / CommentBinding / Declare) Terminate)* {
    return expressions.map(expr => expr[1])
  }

TokenDefinition = "$"

SemanticDeclarePrefix = TokenDefinition "semantic"

ScaleDeclarePrefix = TokenDefinition "scale" 

Declare 
  = (SemanticDeclare / ScaleDeclare)

SemanticDeclare = SemanticDeclarePrefix group:Group name:Name {
  return {
    ...name,
    ...group,
    description: ''
  }
}

ScaleDeclare
  = ColorDeclare 
    / OpacityDeclare 
    / FontSizeDeclare 
    / FontWeightDeclare 
    / LineHeightDeclare

ColorDeclare
  = ScaleDeclarePrefix "/color" name:Name {
    return {
      ...name,
      target: "color",
      description: ''
    }
}

OpacityDeclare
  = ScaleDeclarePrefix "/opacity" name:Name {
    return {
      ...name,
      target: "opacity",
      description: ''
    }  
  }

FontSizeDeclare
  = ScaleDeclarePrefix "/font-size" name:Name {
    return {
      ...name,
      target: "font-size",
      description: ''
    }
  }

FontWeightDeclare
  = ScaleDeclarePrefix "/font-weight" name:Name {
    return {
      ...name,
      target: "font-weight",
      description: ''
    }
  }

LineHeightDeclare
  = ScaleDeclarePrefix "/line-height" name:Name {
    return {
      ...name,
      target: "line-height",
      description: ''
    }
  }

Group
  = "/" group: Alphanumeric {
    return {
      group
    }
  }

Name 
  = "/" name: Alphanumeric {
    return {
      name
    }
  }

Binding
  = (color:ColorDeclare _ "->" _ value:(HexColor / RGBColor) { return {...color, value }}) 
  / (opacity:OpacityDeclare _ "->" _ value:Percentage { return { ...opacity, value }})
  / (fontSize:FontSizeDeclare _ "->" _ value:DecimalPX { return { ...fontSize, value }})
  / (fontWeight:FontWeightDeclare _ "->" _ value:FontWeightConst { return { ...fontWeight, value }})
  / (lineHeight:LineHeightDeclare _ "->" _ value:(DecimalPX / Percentage) { return { ...lineHeight, value }})
  / (semantic:SemanticDeclare _ "->" _ ref:(ScaleDeclare) { 
      return { ...semantic, ref:`$scale/${ref.target}/${ref.name}` } 
    })

CommentBinding
  = declare:Declare _ "#>" _ comment:AnyString {
    return {
      ...declare,
      description: comment
    }
  }

Terminate
  = _ ";" _{
    return ";"
  }

// Atomic expression
FontWeightConst = "thin" / "regular" / "bold"
Alphanumeric "alphanumeric" = chars:([a-z0-9\-]+) { return chars.join("")}
HexColor "#FFFFFF" = hex:("#"[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]) { return hex.join("") }
RGBColor "rgb(255, 255, 255)"
  = rgb:("rgb" _ "(" _ [0-9][0-9]?[0-9]? _ "," _ [0-9][0-9]?[0-9]? _ "," _ [0-9][0-9]?[0-9]? _ ")") { 
    return rgb.filter(el => el != null).join("")
  }
Percentage "%" 
  = percentage:([0-9]+"%") {
    return [...percentage[0], percentage[1]].join("")
  }
DecimalPX "px" = px:([0-9]+"px") { return [...px[0], px[1]].join("")}
AnyString  = '"' chars:[^(")]* '"' { return chars.join("")}
EOL "EndOfLine" = [\n]*
_ "whitespace" = [ \t\n\r]*
