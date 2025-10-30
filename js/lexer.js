// MLP HPL v3 - Lexer (Updated with implicit literals)
// Tokenizes pattern strings

const TokenType = {
    // Character classes
    LOWERCASE: 'LOWERCASE',           // l
    UPPERCASE: 'UPPERCASE',           // L
    DIGIT: 'DIGIT',                   // r
    LETTER: 'LETTER',                 // h
    VOWEL: 'VOWEL',                   // v
    CONSONANT: 'CONSONANT',           // s
    SYMBOL: 'SYMBOL',                 // x
    WILDCARD: 'WILDCARD',             // ?
    UNLIMITED: 'UNLIMITED',           // a
    SINGLE: 'SINGLE',                 // b
    
    // Literals
    LITERAL: 'LITERAL',               // 'text' or bare text
    
    // Quantifiers
    NUMBER: 'NUMBER',                 // 123
    
    // Grouping
    LPAREN: 'LPAREN',                 // (
    RPAREN: 'RPAREN',                 // )
    
    // Alternation
    PIPE: 'PIPE',                     // |
    
    // Scope
    SCOPE: 'SCOPE',                   // w:, l:, d:, b:
    COLON: 'COLON',                   // :
    
    // Delimiters
    COMMA: 'COMMA',                   // ,
    DASH: 'DASH',                     // -
    GT: 'GT',                         // >
    LT: 'LT',                         // <
    
    // Anchors
    START_ANCHOR: 'START_ANCHOR',     // <<
    END_ANCHOR: 'END_ANCHOR',         // >>
    
    // Special
    EOF: 'EOF'
};

class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}

const CHAR_CLASSES = {
    'l': TokenType.LOWERCASE,
    'L': TokenType.UPPERCASE,
    'r': TokenType.DIGIT,
    'h': TokenType.LETTER,
    'v': TokenType.VOWEL,
    's': TokenType.CONSONANT,
    'x': TokenType.SYMBOL,
    '?': TokenType.WILDCARD,
    'a': TokenType.UNLIMITED,
    'b': TokenType.SINGLE
};

function tokenize(pattern) {
    const tokens = [];
    let i = 0;
    let parenDepth = 0; // Track if we're inside parentheses
    
    while (i < pattern.length) {
        const char = pattern[i];
        const startPos = i;
        
        // Whitespace (skip)
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        
        // Literal string (quoted)
        if (char === "'") {
            i++; // Skip opening quote
            let literal = '';
            while (i < pattern.length && pattern[i] !== "'") {
                if (pattern[i] === '\\' && i + 1 < pattern.length) {
                    i++;
                    literal += pattern[i];
                } else {
                    literal += pattern[i];
                }
                i++;
            }
            if (i >= pattern.length) {
                throw new Error(`Unclosed literal at position ${startPos}`);
            }
            i++; // Skip closing quote
            tokens.push(new Token(TokenType.LITERAL, literal, startPos));
            continue;
        }
        
        // Numbers - context-aware for ranges
        if (/\d/.test(char)) {
            // Inside parens + followed by dash = treat as LITERAL for ranges like (0-9)
            if (parenDepth > 0 && pattern[i + 1] === '-') {
                tokens.push(new Token(TokenType.LITERAL, char, startPos));
                i++;
                continue;
            }
            
            // Normal number (quantifier)
            let num = '';
            while (i < pattern.length && /\d/.test(pattern[i])) {
                num += pattern[i];
                i++;
            }
            tokens.push(new Token(TokenType.NUMBER, parseInt(num), startPos));
            continue;
        }
        
        // Scope (w:, l:, d:, b:)
        if ((char === 'w' || char === 'l' || char === 'd' || char === 'b') && 
            pattern[i + 1] === ':') {
            tokens.push(new Token(TokenType.SCOPE, char, startPos));
            i += 2; // Skip char and :
            continue;
        }
        
        // Parentheses - track depth
        if (char === '(') {
            parenDepth++;
            tokens.push(new Token(TokenType.LPAREN, '(', startPos));
            i++;
            continue;
        }
        if (char === ')') {
            parenDepth--;
            tokens.push(new Token(TokenType.RPAREN, ')', startPos));
            i++;
            continue;
        }
        
        // Pipe (alternation)
        if (char === '|') {
            tokens.push(new Token(TokenType.PIPE, '|', startPos));
            i++;
            continue;
        }
        
        // Comma
        if (char === ',') {
            tokens.push(new Token(TokenType.COMMA, ',', startPos));
            i++;
            continue;
        }
        
        // Dash (for ranges)
        if (char === '-') {
            tokens.push(new Token(TokenType.DASH, '-', startPos));
            i++;
            continue;
        }
        
        // Start Anchor: <<
        if (char === '<' && pattern[i + 1] === '<') {
            tokens.push(new Token(TokenType.START_ANCHOR, '<<', startPos));
            i += 2;
            continue;
        }
        
        // End Anchor: >>
        if (char === '>' && pattern[i + 1] === '>') {
            tokens.push(new Token(TokenType.END_ANCHOR, '>>', startPos));
            i += 2;
            continue;
        }
        
        // Greater than (single >)
        if (char === '>') {
            tokens.push(new Token(TokenType.GT, '>', startPos));
            i++;
            continue;
        }
        
        // Less than (single <)
        if (char === '<') {
            tokens.push(new Token(TokenType.LT, '<', startPos));
            i++;
            continue;
        }
        
        // Check if it's a single-char class (NOT followed by alphanumeric)
        // BUT: inside parens, letters are ALWAYS literals (for ranges like (a-z))
        if (CHAR_CLASSES[char] && parenDepth === 0) {
            const nextChar = pattern[i + 1];
            // It's a char class if:
            // - followed by number (l3)
            // - followed by special char (l|)
            // - at end
            // - NOT followed by letter (would be part of word like "cat")
            if (!nextChar || /[\d()|:]/.test(nextChar) || !/[a-zA-Z]/.test(nextChar)) {
                tokens.push(new Token(CHAR_CLASSES[char], char, startPos));
                i++;
                continue;
            }
        }
        
        // Bare text (implicit literal) - for alternations like (cat|dog)
        // NOTE: Don't include dash (-) here as it's used for ranges
        if (/[a-zA-Z]/.test(char)) {
            let text = '';
            while (i < pattern.length && /[a-zA-Z0-9._]/.test(pattern[i])) {
                text += pattern[i];
                i++;
            }
            tokens.push(new Token(TokenType.LITERAL, text, startPos));
            continue;
        }
        
        // Unknown character
        throw new Error(`Unknown character '${char}' at position ${i}`);
    }
    
    tokens.push(new Token(TokenType.EOF, null, i));
    return tokens;
}