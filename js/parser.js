// MLP HPL v3 - Parser
// Builds Abstract Syntax Tree (AST)

const ASTNodeType = {
    SEQUENCE: 'SEQUENCE',
    CHAR_CLASS: 'CHAR_CLASS',
    LITERAL: 'LITERAL',
    QUANTIFIER: 'QUANTIFIER',
    ALTERNATION: 'ALTERNATION',
    SCOPE: 'SCOPE',
    ANCHOR: 'ANCHOR',
    CHAR_RANGE: 'CHAR_RANGE'
};

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }
    
    peek() {
        return this.tokens[this.current];
    }
    
    advance() {
        return this.tokens[this.current++];
    }
    
    expect(type) {
        const token = this.peek();
        if (token.type !== type) {
            throw new Error(`Expected ${type} but got ${token.type} at position ${token.position}`);
        }
        return this.advance();
    }
    
    parse() {
        // Check for anchors
        let startAnchor = false;
        let endAnchor = false;
        let middleAnchor = false;
        
        // Check for middle anchor start: >>
        if (this.peek().type === TokenType.END_ANCHOR) {
            middleAnchor = true;
            this.advance();
        }
        // Check for start anchor: <<
        else if (this.peek().type === TokenType.START_ANCHOR) {
            startAnchor = true;
            this.advance();
        }
        
        // Parse the main pattern
        const pattern = this.parseSequence();
        
        // Check for end anchor or middle anchor end
        if (this.peek().type === TokenType.END_ANCHOR) {
            endAnchor = true;
            this.advance();
        } else if (this.peek().type === TokenType.START_ANCHOR) {
            // This is the closing << for middle anchor >>pattern<<
            if (middleAnchor) {
                this.advance();
            } else {
                throw new Error('Unexpected << at end of pattern');
            }
        }
        
        // Validate middle anchor
        if (middleAnchor && (!this.tokens[this.current - 1] || 
            this.tokens[this.current - 1].type !== TokenType.START_ANCHOR)) {
            throw new Error('Middle anchor >>pattern<< requires closing <<');
        }
        
        // If no anchors, return pattern as-is
        if (!startAnchor && !endAnchor && !middleAnchor) {
            return pattern;
        }
        
        // Wrap pattern with anchor info
        return {
            type: ASTNodeType.ANCHOR,
            startAnchor: startAnchor,
            endAnchor: endAnchor,
            middleAnchor: middleAnchor,
            pattern: pattern
        };
    }
    
    parseSequence() {
        const elements = [];
        
        while (this.peek().type !== TokenType.EOF && 
               this.peek().type !== TokenType.RPAREN) {
            elements.push(this.parseElement());
        }
        
        if (elements.length === 1) {
            return elements[0];
        }
        
        return {
            type: ASTNodeType.SEQUENCE,
            elements: elements
        };
    }
    
    parseElement() {
        const token = this.peek();
        
        // Scope
        if (token.type === TokenType.SCOPE) {
            return this.parseScope();
        }
        
        // Alternation (parentheses)
        if (token.type === TokenType.LPAREN) {
            return this.parseAlternation();
        }
        
        // Literal
        if (token.type === TokenType.LITERAL) {
            this.advance();
            return {
                type: ASTNodeType.LITERAL,
                value: token.value
            };
        }
        
        // Character class with quantifier
        return this.parseCharClass();
    }
    
    parseScope() {
        const scopeToken = this.advance();
        const pattern = this.parseElement();
        
        return {
            type: ASTNodeType.SCOPE,
            scope: scopeToken.value,
            pattern: pattern
        };
    }
    
    parseAlternation() {
        this.expect(TokenType.LPAREN);
        
        // Check if this is a character range: (a-z) or (a-d,g-l)
        const isCharRange = this.isCharacterRange();
        
        if (isCharRange) {
            return this.parseCharacterRange();
        }
        
        // Normal alternation: (cat|dog)
        const alternatives = [];
        
        // Parse first alternative
        alternatives.push(this.parseAlternativeItem());
        
        // Parse remaining alternatives
        while (this.peek().type === TokenType.PIPE) {
            this.advance(); // consume |
            alternatives.push(this.parseAlternativeItem());
        }
        
        this.expect(TokenType.RPAREN);
        
        if (alternatives.length === 1) {
            return alternatives[0];
        }
        
        return {
            type: ASTNodeType.ALTERNATION,
            alternatives: alternatives
        };
    }
    
    isCharacterRange() {
        // LPAREN already consumed, we're at first token inside parens
        // Look ahead to detect pattern: (literal|number)-(literal|number)
        // e.g., a-z or 0-9 or a-d,g-l
        const saved = this.current;
        
        try {
            const first = this.peek();
            
            // Check for LITERAL (letters) or NUMBER (digits converted to string)
            if (first.type === TokenType.LITERAL || first.type === TokenType.NUMBER) {
                // For LITERAL: check length === 1
                // For NUMBER: any single digit or convert to string
                const firstValue = first.type === TokenType.LITERAL ? 
                    first.value : 
                    String(first.value);
                
                if (firstValue.length === 1) {
                    this.advance();
                    if (this.peek().type === TokenType.DASH) {
                        this.current = saved; // Reset
                        return true;
                    }
                }
            }
        } catch (e) {
            // Parsing error, not a range
        }
        
        this.current = saved; // Reset
        return false;
    }
    
    parseCharacterRange() {
        // LPAREN already consumed by parseAlternation
        const ranges = [];
        
        // Parse first range: a-z
        ranges.push(this.parseSingleRange());
        
        // Parse additional ranges: ,g-l
        while (this.peek().type === TokenType.COMMA) {
            this.advance(); // consume ,
            ranges.push(this.parseSingleRange());
        }
        
        this.expect(TokenType.RPAREN);
        
        // Check for quantifier
        const quantifier = this.parseQuantifier();
        
        return {
            type: ASTNodeType.CHAR_RANGE,
            ranges: ranges,
            count: quantifier
        };
    }
    
    parseSingleRange() {
        // Parse: a-z or 0-9
        const start = this.peek();
        
        // Accept LITERAL or NUMBER
        if (start.type !== TokenType.LITERAL && start.type !== TokenType.NUMBER) {
            throw new Error(`Range start must be a literal or number, got: ${start.type}`);
        }
        
        this.advance();
        
        // Convert to string for processing
        const startValue = start.type === TokenType.LITERAL ? 
            start.value : 
            String(start.value);
        
        if (startValue.length !== 1) {
            throw new Error(`Range start must be single character, got: ${startValue}`);
        }
        
        this.expect(TokenType.DASH);
        
        const end = this.peek();
        
        if (end.type !== TokenType.LITERAL && end.type !== TokenType.NUMBER) {
            throw new Error(`Range end must be a literal or number, got: ${end.type}`);
        }
        
        this.advance();
        
        // Convert to string for processing
        const endValue = end.type === TokenType.LITERAL ? 
            end.value : 
            String(end.value);
        
        if (endValue.length !== 1) {
            throw new Error(`Range end must be single character, got: ${endValue}`);
        }
        
        return {
            start: startValue,
            end: endValue
        };
    }
    
    parseAlternativeItem() {
        // Parse elements until we hit | or )
        const elements = [];
        
        while (this.peek().type !== TokenType.PIPE && 
               this.peek().type !== TokenType.RPAREN &&
               this.peek().type !== TokenType.EOF) {
            
            const token = this.peek();
            
            // Literal
            if (token.type === TokenType.LITERAL) {
                this.advance();
                elements.push({
                    type: ASTNodeType.LITERAL,
                    value: token.value
                });
            }
            // Character class
            else {
                elements.push(this.parseCharClass());
            }
        }
        
        if (elements.length === 0) {
            throw new Error('Empty alternative in alternation');
        }
        
        if (elements.length === 1) {
            return elements[0];
        }
        
        return {
            type: ASTNodeType.SEQUENCE,
            elements: elements
        };
    }
    
    parseCharClass() {
        const token = this.advance();
        
        let charClass = null;
        
        switch(token.type) {
            case TokenType.LOWERCASE:
                charClass = 'lowercase';
                break;
            case TokenType.UPPERCASE:
                charClass = 'uppercase';
                break;
            case TokenType.DIGIT:
                charClass = 'digit';
                break;
            case TokenType.LETTER:
                charClass = 'letter';
                break;
            case TokenType.VOWEL:
                charClass = 'vowel';
                break;
            case TokenType.CONSONANT:
                charClass = 'consonant';
                break;
            case TokenType.SYMBOL:
                charClass = 'symbol';
                break;
            case TokenType.WILDCARD:
                charClass = 'wildcard';
                break;
            case TokenType.UNLIMITED:
                charClass = 'unlimited';
                break;
            case TokenType.SINGLE:
                charClass = 'single';
                break;
            default:
                throw new Error(`Expected character class but got ${token.type}`);
        }
        
        // Check for quantifier
        const quantifier = this.parseQuantifier();
        
        return {
            type: ASTNodeType.CHAR_CLASS,
            class: charClass,
            count: quantifier
        };
    }
    
    parseQuantifier() {
        const token = this.peek();
        
        // Range with parentheses: l(2-4), l(>3), l(<5)
        if (token.type === TokenType.LPAREN) {
            this.advance(); // consume (
            
            const nextToken = this.peek();
            
            // Greater than: l(>3) means MORE than 3 (strictly greater)
            if (nextToken.type === TokenType.GT) {
                this.advance(); // consume >
                const min = this.expect(TokenType.NUMBER).value;
                this.expect(TokenType.RPAREN);
                return { min: min + 1, max: Infinity }; // +1 for strict greater than
            }
            
            // Less than: l(<5) means LESS than 5 (strictly less)
            if (nextToken.type === TokenType.LT) {
                this.advance(); // consume <
                const max = this.expect(TokenType.NUMBER).value;
                this.expect(TokenType.RPAREN);
                return { min: 0, max: max - 1 }; // -1 for strict less than
            }
            
            // Range: l(2-4)
            // NOTE: Inside parens, numbers can be LITERAL tokens due to context-aware lexing
            if (nextToken.type === TokenType.NUMBER || 
                (nextToken.type === TokenType.LITERAL && /^\d+$/.test(nextToken.value))) {
                const start = this.advance();
                const startValue = typeof start.value === 'number' ? start.value : parseInt(start.value);
                
                // Check for dash (range)
                if (this.peek().type === TokenType.DASH) {
                    this.advance(); // consume -
                    const end = this.peek();
                    
                    if (end.type !== TokenType.NUMBER && 
                        !(end.type === TokenType.LITERAL && /^\d+$/.test(end.value))) {
                        throw new Error(`Expected number in range quantifier, got: ${end.type}`);
                    }
                    
                    this.advance();
                    const endValue = typeof end.value === 'number' ? end.value : parseInt(end.value);
                    this.expect(TokenType.RPAREN);
                    return { min: startValue, max: endValue };
                }
                
                // Just a number in parens: l(3) = exactly 3
                this.expect(TokenType.RPAREN);
                return { exact: startValue };
            }
            
            throw new Error(`Unexpected token in quantifier: ${nextToken.type}`);
        }
        
        // Exact count: l3
        if (token.type === TokenType.NUMBER) {
            const num = this.advance();
            return { exact: num.value };
        }
        
        // No quantifier = 1
        return { exact: 1 };
    }
}

function parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parse();
}