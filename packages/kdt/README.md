# Karrot Design Token (KDT) Specification

Specification for Karrot Design Token (KDT) and its language (KDTL).

## What is Design Token?

TBD

## What is KDT?

KDT is customized format for the karrot-ui, which is reference library of Karrot's design system.

## Structure

The KDT contains two types of tokens, **"scale tokens"** and **"semantic tokens"**.

## Language

### Content Type

KDT includes multiple token definitions(`$`) and expressions(`%`). Its file extension should be `.kdt` and its MIME type should be `application/design-tokens+kdt`.

KDT is usually stored in DB, but can be serialized to text. The serialized text can hold information about the schema and values of the design token and other expressions may be ignored.

### Language Concepts

#### Prefixed Syntax

Every syntax in KDT is started with specific prefix such like `$` or `%`. These prefixes can be used to identify meaningful definitions and expressions in a mixed content format.

#### Declarative

The KDT is a declarative DSL. It has much less expressive than other languages like [SASS](https://sass-lang.com/) and only focuses on design token use cases.

#### Domain-specific

Instead of being compatible with every possible case, KDT focuses more on the real problem. KDT has opinions on how to define and to use design tokens.

It can still be exchangeable with other formats like the [DTCG format](https://design-tokens.github.io/community-group/format/).

#### One-liner

The syntax of KDT is designed so that you can express the intent separately line by line. This allows the language to interoperate well with tools that don't support multiline code editing, such as Figma.

### Syntax

Every definitions start with `$`, **`$scale`**, **`$static`** or **`$semantic`**.

#### Scale Token Definitions (`$scale`)

Scale tokens and semantic tokens can be declared name-only.

User may specify scale tokens first, as format of `$scale/{target}/{name}`.

```
$scale/color/carrot-100;
$scale/color/carrot-200;
$scale/color/carrot-300;
$scale/color/carrot-400;
$scale/color/carrot-500;
```

- `name` is *unique*, can contain alphanumeric(lowcase only), and `-`.
- `target` is the pre-defined name associated with the actual display. 

Definitions for scale tokens can contain value binding using `->` operator.

```
$scale/color/carrot-100 -> #FFF5F0;
$scale/color/carrot-200 -> #FFE2D2;
$scale/color/carrot-300 -> #FFD2B9;
$scale/color/carrot-400 -> #FFBC97;
$scale/color/carrot-500 -> #FF9E66;
```

The available value formats depend on the target.

| Target        | Available value formats                                                         |
|:------------- |:------------------------------------------------------------------------------- |
| `color`       | hex (`#FFFFFF`), RGB (`rgb(255, 255, 255)`), RGBA(`rgba(255, 255, 255, 1.0)`)   |
| `opacity`     | percentage (`70%`)                                                              |
| `font-size`   | integers (pt)                                                                   |
| `font-weight` | `thin`, `regular`, `bold`                                                       |
| `line-height` | integers (pt), percentage (`70%`)                                               |

It is intentionally defined to be web-like, but it should be kept in mind that they are not identical and may be used differently by different platforms.

#### Semantic Token Definitions (`$semantic`)

Similarly, the format of semantic token is `$semantic/{group}/{name}`, but the user can name the group freely.

```
$semantic/color/primary;
$semantic/color/secondary;

$semantic/typography/title;
$semantic/typography/subtitle;
```

The binding of semantic tokens is specified as a reference to other scale tokens.

```
$semantic/color/primary -> $scale/color/carrot-500;
```

#### Conditional Bindings

TBD

#### Static Token Definitions (`$static`)

Syntax for static tokens is the same as scale token, but does not allow conditional bindings.

#### Composed Bindings

TBD

#### Description Bindings

User can leave a single line of comment on a specific token using `#>` operator.

The right side of the operator should be quoted-string literal. Both single and double quotes are allowed.

```
$semantic/color/primary #> "This is primary color";
```

The description of every node is initialized to an empty string in the absence of an explicit binding.

#### Token References

TDB

#### Handling Duplicated Definitions

TBD

#### Expressions (`%`)

There are expressions (macros) that are executed only once in certain environments.

Expressions is formated as `%{expression}`, for example `%query($scale/color/*$name)`.

##### Pre-defined Expressions

Library:

- `%get({reference})`: get value of the reference.
- `%query({reference_pattern})`: get iterable for the pattern. it allows wildcard (`*`) in token name position.

For Figma frames:

- `%figma:color({reference})`: set frame color to the referencing value.
- `%figma:text({reference})`: set frame text to the referencing value.

## Questions (may unresolved)

### Does it scale?

How valid is the Scale & Semantic dichotomy? The [Adobe Spectrum](https://spectrum.adobe.com/page/design-tokens/)'s design tokens separately manages _static tokens_, and has an additional layer like _component tokens_. Can KDT adapt well to such a case in the future?

### It looks too verbose

Yes, unless the syntax provides a shorthand. That's intentional, and shouldn't be too much of an inconvenience as most of them is done via tools like Figma instead of writing by hand.
