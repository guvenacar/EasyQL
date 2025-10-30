# MLP HPL v3 - Complete Documentation
## Multi-Language Programming - Human Pattern Language

**Version:** 3.0  
**Author:** Human Pattern Language Initiative  
**Last Updated:** 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Language Philosophy](#language-philosophy)
3. [Core Concepts](#core-concepts)
4. [Syntax Reference](#syntax-reference)
5. [Character Classes](#character-classes)
6. [Quantifiers](#quantifiers)
7. [Character Ranges](#character-ranges)
8. [Literals](#literals)
9. [Alternation](#alternation)
10. [Anchors](#anchors)
11. [Scope Modifiers](#scope-modifiers)
12. [Pattern Examples](#pattern-examples)
13. [Implementation Details](#implementation-details)
14. [Best Practices](#best-practices)
15. [Comparison with Regular Expressions](#comparison-with-regular-expressions)

---

## Introduction

MLP HPL v3 (Multi-Language Programming - Human Pattern Language) is a pattern matching language designed to be more intuitive and human-readable than traditional regular expressions. It emphasizes clarity, simplicity, and cross-linguistic compatibility.

### Key Features

- **Human-Readable Syntax**: Uses intuitive single-character codes instead of cryptic regex symbols
- **Multilingual Support**: Handles Turkish characters (ğ, ş, ı, etc.) and other Unicode characters
- **Flexible Quantifiers**: Multiple ways to specify repetition with natural syntax
- **Range Support**: Easy character range definitions
- **Anchoring System**: Intuitive position-based matching

---

## Language Philosophy

### Design Principles

1. **Readability First**: Every pattern should be immediately understandable
2. **Consistent Syntax**: Similar operations use similar syntax
3. **Error Prevention**: The language guides users toward correct patterns
4. **Minimal Memorization**: Small set of rules covers most use cases
5. **Progressive Disclosure**: Simple patterns are simple; complex patterns remain possible

### Why Not Regex?

Traditional regular expressions, while powerful, suffer from:
- Cryptic syntax (`\w+`, `[a-zA-Z]{3,5}`, `(?:...)`)
- Escape character overload
- Different flavors across languages
- Difficult to read and maintain

HPL addresses these issues with a cleaner, more intuitive approach.

---

## Core Concepts

### Pattern Structure

A pattern in HPL consists of:
1. **Elements**: Character classes, literals, or groups
2. **Quantifiers**: Specify how many times an element repeats
3. **Modifiers**: Anchors, scopes, and alternations

### Basic Pattern Format

```
[anchor] element[quantifier] [element[quantifier]]... [anchor]
```

**Example:**
```
l3r2    → 3 lowercase letters followed by 2 digits
<<l3    → 3 lowercase letters at the start
l(2-4)  → 2 to 4 lowercase letters
```

---

## Syntax Reference

### Complete Symbol Table

| Symbol | Name | Description | Example |
|--------|------|-------------|---------|
| `l` | lowercase | Any lowercase letter | `l3` = abc |
| `L` | UPPERCASE | Any uppercase letter | `L2` = AB |
| `r` | digit | Any digit (0-9) | `r4` = 1234 |
| `h` | letter | Any letter (upper or lower) | `h5` = AbCdE |
| `v` | vowel | Any vowel | `v2` = ae |
| `s` | consonant | Any consonant | `s3` = bcd |
| `x` | symbol | Any symbol/punctuation | `x2` = !@ |
| `?` | wildcard | Any character | `?5` = ab12! |
| `a` | unlimited | Any amount of any char | `a` = anything |
| `b` | single | Exactly one of any char | `b` = x |
| `'...'` | literal | Exact text | `'hello'` |
| `( )` | group | Grouping for alternation/ranges | `(cat\|dog)` |
| `\|` | alternation | OR operator | `(yes\|no)` |
| `<<` | start anchor | Must start at beginning | `<<l3` |
| `>>` | end anchor | Must end at text end | `r2>>` |
| `>>...<<` | middle anchor | Must be in middle (not edges) | `>>l3<<` |
| `(x-y)` | range | Character range | `(a-z)`, `(0-9)` |
| `w:` | word scope | Within word boundary | `w:l3` |
| `l:` | line scope | Within line | `l:pattern` |
| `d:` | document scope | Full document | `d:pattern` |
| `b:` | block scope | Within block | `b:pattern` |

---

## Character Classes

Character classes match specific types of characters.

### Lowercase: `l`

Matches any lowercase letter, including Turkish characters.

**Matches:**
- a-z (English lowercase)
- ç, ğ, ı, ö, ş, ü (Turkish lowercase)

**Examples:**
```
l      → a, b, c, ş, ğ
l3     → abc, xyz, şğü
l5     → hello, dünya
```

### Uppercase: `L`

Matches any uppercase letter, including Turkish characters.

**Matches:**
- A-Z (English uppercase)
- Ç, Ğ, İ, Ö, Ş, Ü (Turkish uppercase)

**Examples:**
```
L      → A, B, C, Ş, Ğ
L3     → ABC, XYZ, ŞĞÜ
L5     → HELLO, DÜNYA
```

### Digit: `r`

Matches any numeric digit.

**Matches:** 0-9

**Examples:**
```
r      → 5
r3     → 123, 789
r4     → 2025
```

**Note:** The symbol `r` was chosen because `d` is reserved for "document scope."

### Letter: `h`

Matches any letter (uppercase or lowercase).

**Matches:**
- All lowercase letters (l)
- All uppercase letters (L)

**Examples:**
```
h      → a, B, ş, Ğ
h3     → aBc, XyZ, Şğü
h5     → HeLLo, DüNyA
```

### Vowel: `v`

Matches any vowel in English or Turkish.

**Matches:**
- English: a, e, i, o, u, A, E, I, O, U
- Turkish: ö, ü, Ö, Ü

**Examples:**
```
v      → a, e, ö
v3     → aei, oöü
v2     → ae, öü
```

### Consonant: `s`

Matches any consonant in English or Turkish.

**Matches:**
- English: b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z
- Turkish: ç, ğ, ş, Ç, Ğ, Ş

**Examples:**
```
s      → b, k, ş
s3     → str, çğş
s5     → crypt
```

### Symbol: `x`

Matches any punctuation or special character.

**Matches:**
```
! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : " \ | , . < > / ?
```

**Examples:**
```
x      → @, #, !
x3     → @#$, !?!
x2     → .:
```

### Wildcard: `?`

Matches any single character (including spaces, symbols, letters, digits).

**Examples:**
```
?      → a, 5, @, (space)
?3     → a5@, xyz,   3
?5     → hello, 12!ab
```

### Unlimited: `a`

Matches any number of any characters (including zero characters). Similar to `.*` in regex.

**Examples:**
```
a      → (empty), hello, 123!@#
'start'a'end'  → start...anything...end
```

### Single: `b`

Matches exactly one character of any type (like `?` but emphasizes "single").

**Examples:**
```
b      → x, 5, @
b3     → abc, 1@x
```

---

## Quantifiers

Quantifiers specify how many times a character class should repeat.

### Exact Count: `class + number`

Match exactly N occurrences.

**Syntax:** `l3`, `r5`, `h10`

**Examples:**
```
l3     → abc, xyz (exactly 3 lowercase)
r2     → 12, 99 (exactly 2 digits)
L4     → ABCD (exactly 4 uppercase)
```

### Range: `class(min-max)`

Match between min and max occurrences (inclusive).

**Syntax:** `l(2-4)`, `r(1-3)`

**Examples:**
```
l(2-4)    → ab, abc, abcd (2 to 4 lowercase)
r(1-3)    → 1, 12, 123 (1 to 3 digits)
h(5-10)   → hello, JavaScript (5 to 10 letters)
```

### Greater Than: `class(>N)`

Match MORE than N occurrences (strictly greater).

**Syntax:** `l(>3)`, `r(>5)`

**Examples:**
```
l(>3)     → abcd, abcde, ... (4+ lowercase)
r(>2)     → 123, 1234, ... (3+ digits)
```

**Note:** `(>3)` means "more than 3", so minimum is 4.

### Less Than: `class(<N)`

Match LESS than N occurrences (strictly less).

**Syntax:** `l(<5)`, `r(<3)`

**Examples:**
```
l(<5)     → a, ab, abc, abcd (0 to 4 lowercase)
r(<3)     → 1, 12 (0 to 2 digits)
```

**Note:** `(<5)` means "less than 5", so maximum is 4.

### No Quantifier (Implicit 1)

If no quantifier is specified, exactly 1 is assumed.

**Examples:**
```
l     → a (exactly 1 lowercase)
r     → 5 (exactly 1 digit)
```

---

## Character Ranges

Character ranges allow matching specific character sets.

### Basic Range Syntax: `(start-end)`

**Examples:**
```
(a-z)     → Any lowercase letter a through z
(A-Z)     → Any uppercase letter A through Z
(0-9)     → Any digit 0 through 9
(a-f)     → Hex lowercase (a, b, c, d, e, f)
(A-F)     → Hex uppercase (A, B, C, D, E, F)
```

### Multiple Ranges: `(range1,range2,...)`

Combine multiple ranges with commas.

**Examples:**
```
(a-z,A-Z)      → Any letter (upper or lower)
(0-9,a-f)      → Hex digit (0-9 or a-f)
(a-d,g-l,x-z)  → Multiple separate ranges
```

### Ranges with Quantifiers

**Examples:**
```
(a-z)3         → Exactly 3 lowercase letters
(0-9)4         → Exactly 4 digits (like r4)
(a-f)(2-4)     → 2 to 4 hex letters
(0-9,a-f)6     → 6 hex characters
```

### Common Range Patterns

```
(a-z)          → Lowercase alphabet
(A-Z)          → Uppercase alphabet
(0-9)          → Digits (same as 'r')
(a-z,A-Z)      → All letters (same as 'h')
(0-9,a-f)      → Hexadecimal lowercase
(0-9,a-f,A-F)  → Hexadecimal any case
```

---

## Literals

Literals match exact text strings.

### Quoted Literals: `'text'`

Use single quotes for exact text matching.

**Examples:**
```
'hello'        → Matches "hello" exactly
'Hello World'  → Matches "Hello World" exactly
'123'          → Matches "123" as text (not as number)
'@#$'          → Matches "@#$" exactly
```

### Implicit Literals (Bare Text)

Inside alternations, bare text is treated as a literal.

**Examples:**
```
(cat|dog)      → Matches "cat" OR "dog"
(yes|no)       → Matches "yes" OR "no"
(red|green|blue) → Matches color names
```

### Escape Sequences in Literals

Use backslash to escape special characters inside quotes.

**Examples:**
```
'can\'t'       → Matches "can't"
'say "hello"'  → Matches 'say "hello"'
```

### Combining Literals with Classes

**Examples:**
```
'user'r3           → "user" followed by 3 digits (user123)
'id_'(a-z)2'_'r4   → "id_" + 2 letters + "_" + 4 digits (id_ab_1234)
L3'@'l3'.com'      → 3 uppercase + "@" + 3 lowercase + ".com" (ABC@xyz.com)
```

---

## Alternation

Alternation allows matching one of several alternatives.

### Basic Alternation: `(option1|option2|...)`

**Syntax:** Use parentheses and pipe `|` to separate alternatives.

**Examples:**
```
(cat|dog)          → Matches "cat" OR "dog"
(yes|no|maybe)     → Matches "yes", "no", or "maybe"
(Mr|Ms|Mrs|Dr)     → Matches titles
```

### Alternation with Character Classes

**Examples:**
```
(l3|r3)            → 3 lowercase OR 3 digits
(L2r2|r2L2)        → 2 uppercase + 2 digits OR 2 digits + 2 uppercase
('hello'|'hi')     → "hello" OR "hi"
```

### Nested Patterns in Alternation

**Examples:**
```
(l(2-4)|r(3-5))    → 2-4 lowercase OR 3-5 digits
('user'r2|'admin') → "user" + 2 digits OR "admin"
```

### Longest Match Priority

When multiple alternatives match, HPL chooses the longest match.

**Example:**
```
Pattern: (cat|catch)
Text: "catch"
Result: Matches "catch" (not "cat")
```

---

## Anchors

Anchors specify where in the text a pattern must match.

### Start Anchor: `<<pattern`

Pattern must match at the very beginning of the text.

**Examples:**
```
<<l3           → "abc" in "abcxyz" ✓ | "xabc" ✗
<<'hello'      → "hello world" ✓ | "say hello" ✗
<<L3r2         → "AB123" ✓ | "xAB123" ✗
```

### End Anchor: `pattern>>`

Pattern must match at the very end of the text.

**Examples:**
```
r2>>           → "abc12" ✓ | "12abc" ✗
'world'>>      → "hello world" ✓ | "world hello" ✗
l3r2>>         → "xabc12" ✓ | "abc12x" ✗
```

### Full Match: `<<pattern>>`

Pattern must match the entire text (both start and end).

**Examples:**
```
<<l3r2>>       → "abc12" ✓ | "xabc12" ✗ | "abc12x" ✗
<<'exact'>>    → "exact" ✓ | "exactly" ✗
<<h5>>         → "hello" ✓ | "hello!" ✗
```

### Middle Anchor: `>>pattern<<`

Pattern must match in the middle (NOT at start or end).

**Examples:**
```
>>l3<<         → "xabcy" ✓ | "abc" ✗ | "abcx" ✗ | "xabc" ✗
>>'test'<<     → "xtesty" ✓ | "test" ✗
>>r2<<         → "a12b" ✓ | "12ab" ✗ | "ab12" ✗
```

### Anchor Combinations

```
<<l3           → Must start with 3 lowercase
r2>>           → Must end with 2 digits
<<l3r2>>       → Must be exactly 3 lowercase + 2 digits
>>l3<<         → Must have 3 lowercase in middle (not at edges)
```

---

## Scope Modifiers

Scope modifiers limit pattern matching to specific boundaries.

### Word Scope: `w:pattern`

Match pattern within a word boundary (no whitespace crossing).

**Examples:**
```
w:l3           → "abc" in "abc def" ✓ | "ab cde" ✗
w:'test'       → "test" as a word | "testing" ✓
```

### Line Scope: `l:pattern`

Match pattern within a single line (no newline crossing).

**Examples:**
```
l:l5           → 5 letters on same line
l:'hello'      → "hello" within a line
```

### Document Scope: `d:pattern`

Match pattern across entire document (default behavior).

**Examples:**
```
d:l(10-100)    → 10-100 letters anywhere in document
d:'keyword'    → "keyword" anywhere
```

### Block Scope: `b:pattern`

Match pattern within a logical block (paragraph, section, etc.).

**Examples:**
```
b:l(20-50)     → 20-50 letters within a block
b:'section'    → "section" within a block
```

---

## Pattern Examples

### Common Patterns

#### Usernames
```
l(3-16)                 → 3 to 16 lowercase letters
l(1-10)r(0-3)           → Letters + optional digits
(a-z,0-9)(5-15)         → Alphanumeric, 5-15 chars
```

#### Email Addresses
```
l(3-20)'@'l(3-10)'.com'              → Simple email
(a-z,0-9)(3-20)'@'(a-z)(3-10)'.com'  → Alphanumeric email
```

#### Phone Numbers
```
r3'-'r3'-'r4            → 123-456-7890
'('r3')'r3'-'r4         → (123)456-7890
'+1'r10                 → +11234567890
```

#### Passwords
```
l(8-20)                           → 8-20 lowercase (weak)
(a-z,A-Z,0-9)(8-20)               → Alphanumeric, 8-20 chars
(a-z,A-Z,0-9)(8-20)x              → With at least 1 symbol
h(6-12)r(1-3)x                    → Letters + digits + symbol
```

#### Dates
```
r2'/'r2'/'r4            → 01/23/2025 (MM/DD/YYYY)
r4'-'r2'-'r2            → 2025-01-23 (YYYY-MM-DD)
r2'.'r2'.'r4            → 23.01.2025 (DD.MM.YYYY)
```

#### URLs
```
'http'('s'|)'://'a           → http:// or https:// + anything
'www.'l(3-20)'.com'          → www.example.com
```

#### Postal Codes
```
r5                      → US ZIP (12345)
r5'-'r4                 → US ZIP+4 (12345-6789)
l2r(2-3)                → Turkish postal (AB123)
(A-Z)r(A-Z)r(A-Z)r      → Canadian (A1B2C3)
```

#### Credit Cards
```
r4'-'r4'-'r4'-'r4       → 1234-5678-9012-3456
r16                     → 1234567890123456
```

#### IP Addresses
```
r(1-3)'.'r(1-3)'.'r(1-3)'.'r(1-3)   → IPv4
```

#### Hexadecimal
```
(0-9,a-f)6              → RGB color (#ff5733)
'0x'(0-9,a-f)(1-8)      → Hex number (0x1A2B)
```

#### File Extensions
```
l(3-20)'.'(jpg|png|gif)           → image.jpg
l(1-50)'.txt'                     → filename.txt
l(1-50)'.'(doc|docx|pdf)          → document files
```

---

## Implementation Details

### Architecture

The HPL implementation consists of three main components:

#### 1. Lexer (Tokenizer)

**File:** `lexer.js`

Converts pattern string into tokens. Handles:
- Character class recognition
- Number parsing (context-aware for ranges)
- Quoted literal strings
- Implicit bare-text literals
- Parenthesis depth tracking
- Anchor detection

**Key Functions:**
- `tokenize(pattern)` → Returns array of tokens

#### 2. Parser

**File:** `parser.js`

Builds Abstract Syntax Tree (AST) from tokens. Handles:
- Sequence parsing
- Alternation groups
- Character ranges
- Quantifier parsing
- Anchor detection
- Scope modifiers

**Key Functions:**
- `parse(tokens)` → Returns AST

**AST Node Types:**
- `SEQUENCE` - Multiple elements in order
- `CHAR_CLASS` - Character class with quantifier
- `LITERAL` - Exact text string
- `ALTERNATION` - Multiple alternatives
- `CHAR_RANGE` - Character range with quantifier
- `ANCHOR` - Anchored pattern
- `SCOPE` - Scoped pattern

#### 3. Matcher

**File:** `matcher.js`

Matches AST against input text. Handles:
- Position-based matching
- Greedy quantifier matching
- Anchor validation
- Unicode character support
- Range checking

**Key Functions:**
- `match(ast, text)` → Returns array of matches

**Match Algorithm:**
- Try matching at each position in text
- For anchored patterns, constrain search positions
- Greedy matching (longest match first)
- Return all non-overlapping matches

### Character Class Regex Mapping

```javascript
lowercase:  /[a-zçğıöşü]/
uppercase:  /[A-ZÇĞİÖŞÜ]/
digit:      /[0-9]/
letter:     /[a-zA-ZçğıöşüÇĞİÖŞÜ]/
vowel:      /[aeiouöüAEIOUÖÜ]/
consonant:  /[bcdfghjklmnpqrstvwxyzçğşBCDFGHJKLMNPQRSTVWXYZÇĞŞ]/
symbol:     /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
wildcard:   /./
```

### Quantifier Processing

```javascript
exact:     { exact: N }              // l3
range:     { min: N, max: M }        // l(2-4)
greater:   { min: N+1, max: ∞ }      // l(>3)
less:      { min: 0, max: N-1 }      // l(<5)
default:   { exact: 1 }              // l
```

---

## Best Practices

### Pattern Design

1. **Start Simple**
   ```
   ✓ l3r2              (simple and clear)
   ✗ l(3-3)r(2-2)      (unnecessarily complex)
   ```

2. **Use Appropriate Classes**
   ```
   ✓ h5                (any 5 letters)
   ✗ (a-z,A-Z)5        (unnecessarily verbose)
   ```

3. **Be Specific with Anchors**
   ```
   ✓ <<l3r2>>          (exact match)
   ✗ l3r2              (matches substring)
   ```

4. **Choose Readable Alternatives**
   ```
   ✓ (yes|no)          (clear options)
   ✗ (y|n)('es'|'o')   (confusing)
   ```

### Performance Tips

1. **Avoid Unlimited in Large Texts**
   ```
   ⚠ 'start'a'end'     (can be slow on large texts)
   ✓ 'start'?(1-100)'end'  (bounded wildcard)
   ```

2. **Use Anchors When Possible**
   ```
   ✓ <<pattern         (only tries position 0)
   ⚠ pattern           (tries every position)
   ```

3. **Be Specific with Quantifiers**
   ```
   ✓ l(5-10)           (bounded range)
   ⚠ l(>0)             (unlimited upper bound)
   ```

### Common Mistakes

1. **Forgetting Quotes for Literals**
   ```
   ✗ hello             (interpreted as h + e + l + l + o classes)
   ✓ 'hello'           (correct literal)
   ```

2. **Wrong Anchor Order**
   ```
   ✗ >>pattern         (end anchor at start??)
   ✓ <<pattern>>       (start then end)
   ✓ >>pattern<<       (middle anchor)
   ```

3. **Range Syntax Errors**
   ```
   ✗ (a~z)             (wrong separator)
   ✓ (a-z)             (correct)
   
   ✗ (a-z,0-9          (missing closing paren)
   ✓ (a-z,0-9)         (correct)
   ```

4. **Quantifier Placement**
   ```
   ✗ (2-4)l            (quantifier before class)
   ✓ l(2-4)            (correct order)
   ```

---

## Comparison with Regular Expressions

### Side-by-Side Examples

| Task | HPL v3 | Regular Expression |
|------|--------|-------------------|
| 3 lowercase | `l3` | `[a-z]{3}` |
| 2-4 digits | `r(2-4)` | `\d{2,4}` |
| Start with letter | `<<h` | `^[a-zA-Z]` |
| End with digit | `r>>` | `\d$` |
| Exact match | `<<l3r2>>` | `^[a-z]{3}\d{2}$` |
| Email | `l(3-20)'@'l(3-10)'.com'` | `[a-z]{3,20}@[a-z]{3,10}\.com` |
| Hex color | `(0-9,a-f)6` | `[0-9a-f]{6}` |
| Yes or No | `(yes|no)` | `(?:yes|no)` |
| Phone | `r3'-'r3'-'r4` | `\d{3}-\d{3}-\d{4}` |
| Any 5 chars | `?5` | `.{5}` |
| Username | `(a-z,0-9)(5-15)` | `[a-z0-9]{5,15}` |

### Advantages of HPL

1. **Readability**: `l3r2` vs `[a-z]{3}\d{2}`
2. **No Escaping**: `'@'` vs `\@`
3. **Clear Anchors**: `<<` vs `^`
4. **Intuitive Ranges**: `(2-4)` vs `{2,4}`
5. **Multilingual**: Built-in Turkish support
6. **Consistent**: Same syntax across implementations

### When to Use Regex vs HPL

**Use HPL when:**
- Pattern needs to be human-readable
- Working with non-technical users
- Patterns are simple to moderate complexity
- Multilingual text support needed
- Pattern will be maintained by others

**Use Regex when:**
- Extremely complex patterns (lookaheads, backreferences)
- Performance is absolutely critical
- Integration with existing regex-based systems
- Advanced features like lazy quantifiers needed

---

## Advanced Topics

### Pattern Composition

Build complex patterns from simpler ones:

```javascript
// Define reusable components
const EMAIL_LOCAL = "l(3-20)";
const EMAIL_DOMAIN = "l(3-10)";
const EMAIL_TLD = "('com'|'org'|'net')";

// Compose full pattern
const EMAIL_PATTERN = `${EMAIL_LOCAL}'@'${EMAIL_DOMAIN}'.'${EMAIL_TLD}`;
// Result: l(3-20)'@'l(3-10)'.('com'|'org'|'net')
```

### Validation Patterns

```javascript
// Strong password: 8+ chars, letter + digit + symbol
h(7-20)r(1-5)x

// URL with optional subdomain
('www.'|)l(3-20)'.'('com'|'org')

// Credit card (Visa: starts with 4)
'4'r15

// SSN format
r3'-'r2'-'r4
```

### Extraction Patterns

```javascript
// Extract date components
Pattern: r4'-'r2'-'r2
Text: "Date: 2025-01-23"
Extract: year=2025, month=01, day=23

// Extract username from email
Pattern: l(3-20)'@'
Text: "user@example.com"
Extract: username=user
```

---

## Troubleshooting

### Pattern Not Matching

**Problem:** Pattern doesn't match expected text

**Solutions:**
1. Check quantifiers (exact vs range)
2. Verify anchor placement
3. Test character classes (l vs h vs (a-z))
4. Validate literal quoting
5. Check for typos in alternation

### Unexpected Matches

**Problem:** Pattern matches more than expected

**Solutions:**
1. Add anchors (`<<` or `>>`)
2. Make quantifiers more specific
3. Use word scope (`w:`)
4. Replace `a` (unlimited) with bounded quantifier

### Performance Issues

**Problem:** Pattern matching is slow

**Solutions:**
1. Add start anchor `<<` if possible
2. Reduce use of unlimited `a`
3. Use more specific character classes
4. Bound quantifiers (`l(1-50)` instead of `l(>0)`)

---

## Future Enhancements (Roadmap)

### Planned Features

1. **Lazy Quantifiers**: `l3?` (non-greedy)
2. **Backreferences**: Capture and reuse matched text
3. **Lookahead/Lookbehind**: Context-sensitive matching
4. **Named Groups**: `(name:pattern)` for extraction
5. **Unicode Categories**: `\p{Letter}` style classes
6. **Custom Classes**: User-defined character sets
7. **Inline Modifiers**: Case-insensitive flags
8. **Pattern Variables**: Named pattern components

---

## Contributing

### Reporting Issues

When reporting bugs, include:
1. Pattern used
2. Input text
3. Expected result
4. Actual result
5. Browser/environment

### Suggesting Features

Feature requests should include:
1. Use case description
2. Proposed syntax
3. Example patterns
4. Comparison with alternatives

---

## License & Credits

**License:** MIT License

**Contributors:**
- HPL Language Design Team
- Community Contributors

**Acknowledgments:**
- Inspired by human-readable pattern languages
- Built for multilingual text processing
- Designed for developer productivity

---

## Appendix

### Complete Grammar (EBNF)

```ebnf
pattern     ::= anchor? sequence anchor?
anchor      ::= '<<' | '>>' | '>>...<<'
sequence    ::= element+
element     ::= scope | alternation | charclass | literal | range
scope       ::= ('w' | 'l' | 'd' | 'b') ':' element
alternation ::= '(' alternative ('|' alternative)+ ')'
alternative ::= element+
charclass   ::= ('l'|'L'|'r'|'h'|'v'|'s'|'x'|'?'|'a'|'b') quantifier?
range       ::= '(' rangeitem (',' rangeitem)* ')' quantifier?
rangeitem   ::= char '-' char
literal     ::= "'" text "'" | baretext
quantifier  ::= number | '(' number '-' number ')' | '(' '>' number ')' | '(' '<' number ')'
```

### ASCII Quick Reference

```
Character Classes:
l = lowercase    L = UPPERCASE    r = digit       h = letter
v = vowel        s = consonant    x = symbol      ? = wildcard
a = unlimited    b = single

Quantifiers:
N              = exactly N
(N-M)          = between N and M
(>N)           = more than N
(<N)           = less than N

Anchors:
<<             = start of text
>>             = end of text
<<...>>        = exact match (full text)
>>...<<        = middle (not at edges)

Grouping:
(...)          = alternation group
(X-Y)          = character range
'...'          = literal text
X|Y            = alternation (X or Y)

Scopes:
w:             = word scope
l:             = line scope
d:             = document scope
b:             = block scope
```

### Testing Checklist

When testing HPL patterns:

- [ ] Simple character class (l, r, etc.)
- [ ] Quantifiers (exact, range, >, <)
- [ ] Character ranges (a-z, 0-9)
- [ ] Literals (quoted and bare)
- [ ] Alternation (|)
- [ ] Start anchor (<<)
- [ ] End anchor (>>)
- [ ] Full match (<<...>>)
- [ ] Middle anchor (>>...<<)
- [ ] Scopes (w:, l:, etc.)
- [ ] Unicode/Turkish characters
- [ ] Edge cases (empty, single char)

---

## Quick Start Guide

### Installation

```html
<!-- Include HPL scripts -->
<script src="lexer.js"></script>
<script src="parser.js"></script>
<script src="matcher.js"></script>
```

### Basic Usage

```javascript
// 1. Define pattern
const pattern = "l3r2";

// 2. Tokenize
const tokens = tokenize(pattern);

// 3. Parse
const ast = parse(tokens);

// 4. Match against text
const text = "abc12";
const matches = match(ast, text);

// 5. Process results
console.log(matches);
// Output: [{ match: "abc12", start: 0, end: 5 }]
```

### First Patterns

```javascript
// Email validation
"l(3-20)'@'l(3-10)'.com'"

// Phone number
"r3'-'r3'-'r4"

// Simple password
"h(8-20)"

// Date format
"r2'/'r2'/'r4"
```

---

## Glossary

**Alternation**: Matching one of several alternatives using `|`

**Anchor**: Position constraint (start, end, or middle)

**AST**: Abstract Syntax Tree - internal representation of pattern

**Character Class**: Type of character to match (l, r, h, etc.)

**Greedy**: Matching as much as possible (default behavior)

**HPL**: Human Pattern Language - this language

**Lexer**: Component that breaks pattern into tokens

**Literal**: Exact text string to match

**Matcher**: Component that performs the actual matching

**Parser**: Component that builds AST from tokens

**Quantifier**: Specifies how many times to match

**Range**: Set of characters defined by start-end

**Scope**: Boundary within which to match

**Token**: Smallest unit of pattern syntax

---

**End of Documentation**

For more information, visit: [HPL Documentation](https://github.com/mlp-hpl)  
Version: 3.0 | Last Updated: 2025-10-30