# Karrot Design Token Specification

Specification for Karrot Design Token (KDT) and its language.

## What is Design Token?

TBD

## What is KDT?

KDT is customized format for the karrot-ui, which is reference library of Karrot's design system.

## Structure

The KDT contains two types of tokens, **"scale tokens"** and **"semantic tokens"**.

## Language

### Content Type

KDTs are usually stored in DB, but can be serialized to text. Serialized text contains only information about the schema and values of the design token and is stored in file with Design Token Definition Language (DTDL) format.

DTDL is defined as a subset with only token definitions(`$`) in KDT. Its Extension of the file should be `.dtdl` and its MIME type should be `application/dtdl`.

### Concepts

#### Prefixing Syntax

Every syntax in KDT is started with specific prefix such like `$` or `%`. These prefixes can be used to identify meaningful definitions and expressions in different content types.

#### Declarative

The KDT is a declarative DSL. It has much less expressive than other languages like SASS and focuses on design token use cases.

#### Domain-specific

Instead of being compatible with every possible cases, KDT focus more on the real problem. KDT provide some opinions on how to use Design Token.

It can still be exchangable with other formats with a wider range of expressions, such as the [DTCG format](https://design-tokens.github.io/community-group/format/).

#### One-liner

The syntax of KDT is designed so that you can express the same intent separately line by line. This feature allows the language to interoperate well with tools that don't support code editing, such as Figma.

### Token Definitions (`$`)

Every definitions start with `$`, `$scale` or `$semantic`. Usually defined as `{declaration} -> {binding}`.

#### Declarations & Bindings

Scale tokens and semantic tokens can be declared name-only.

User may specify scale tokens first, as format of `$scale/{target}/{name}`.

```
$scale/color/carrot-100;
$scale/color/carrot-200;
$scale/color/carrot-300;
$scale/color/carrot-400;
$scale/color/carrot-500;
```

An abstract structure may looks like this:

```json
scale {
  "name": "carrot-100",
  "target": "color"
}
```

`name` is *unique*, can contain alphanumeric(lowcase only), and `-`.

`target` is the pre-defined name associated with the actual display. 

Definitions for scale tokens can contain value binding using `->`

```
$scale/color/carrot-100 -> #FFF5F0;
$scale/color/carrot-200 -> #FFE2D2;
$scale/color/carrot-300 -> #FFD2B9;
$scale/color/carrot-400 -> #FFBC97;
$scale/color/carrot-500 -> #FF9E66;
```

An abstract structure may looks like this:

```json
scale {
  "name": "carrot-100",
  "target": "color",
  "value": "#FFF5F0"
}
```

The available value formats depend on the target.

| Target        | Available value formats                       |
|:------------- |:--------------------------------------------- |
| `color`       | hex (`#FFFFFF`), RGB (`rgb(255, 255, 255)`)   |
| `opacity`     | percentage (`70%`)                            |
| `font-size`   | decimals (px)                                 |
| `font-weight` | `thin`, `regular`, `bold`                     |
| `line-height` | decimals (px), percentage (`70%`)             |

It is intentionally defined to be web-like, but it should be kept in mind that they are not identical and may be used differently by different platforms.

Similarly, format of semantic token is `$semantic/{group}/{name}`, but user can name the group freely.

```
$semantic/color/primary;
$semantic/color/secondary;

$semantic/typography/title;
$semantic/typography/subtitle;
```

An abstract structure may looks like this:

```json
semantic {
  "name": "primary",
  "group": "color"
}
```

The binding of the value of a semantic token is specified as reference to another tokens.

```
$semantic/color/primary -> $scale/color/carrot-500;
```

An abstract structure may looks like this:

```json
semantic {
  "name": "primary",
  "group": "color",
  "ref": "$scale/color/carrot-500"
}
```

#### Token References

Depending on the context, other tokens can be referenced through the same syntax as declaration.

#### Conditional Bindings

TBD

#### Composed Bindings

TBD

#### Comment Bindings

User can leave a single line of comment on a specific token using `#>`.

```
$semantic/color/primary #> This is primary color;
```

An abstract structure may looks like this:

```json
semantic {
  ...
  "description": "This is primary color"
}
```

The description of every node is initialized to an empty string in the absence of an explicit binding.

#### Handling Duplicated Definitions

TBD

### Processor Defintions (`%`)

Expressions is formated as `%{expression}`, for example `%query($scale/color/*$name)`.

#### Pre-defined Expressions

Library:

- `%get({at_rule*?}{reference})`: get value of the reference.
- `%query({at_rule*?}{reference_pattern})`: get iterable for the pattern. it allows wildcard (`*`) in token name position.

For Figma frames:

- `%figma:color({at_rule*?}{reference})`: set frame color to the referencing value.
- `%figma:text({at_rule*?}{reference})`: set frame text to the referencing value.
