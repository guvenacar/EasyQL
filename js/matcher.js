// MLP HPL v3 - Matcher
// Matches patterns against text

class Matcher {
    constructor(ast, text) {
        this.ast = ast;
        this.text = text;
    }
    
    match() {
        const results = [];
        
        // Special handling for anchored patterns
        if (this.ast.type === ASTNodeType.ANCHOR) {
            // Start anchor: only try matching from position 0
            if (this.ast.startAnchor) {
                const result = this.matchAt(this.ast, 0);
                if (result) {
                    results.push({
                        match: result.text,
                        start: result.start,
                        end: result.end
                    });
                }
                return results;
            }
            
            // Middle anchor: skip position 0 and last position
            if (this.ast.middleAnchor) {
                for (let i = 1; i < this.text.length - 1; i++) {
                    const result = this.matchAt(this.ast, i);
                    if (result) {
                        results.push({
                            match: result.text,
                            start: result.start,
                            end: result.end
                        });
                    }
                }
                return results;
            }
        }
        
        // Normal matching: try at each position
        for (let i = 0; i < this.text.length; i++) {
            const result = this.matchAt(this.ast, i);
            if (result) {
                results.push({
                    match: result.text,
                    start: result.start,
                    end: result.end
                });
            }
        }
        
        return results;
    }
    
    matchAt(node, startPos) {
        switch(node.type) {
            case ASTNodeType.SEQUENCE:
                return this.matchSequence(node, startPos);
            case ASTNodeType.CHAR_CLASS:
                return this.matchCharClass(node, startPos);
            case ASTNodeType.LITERAL:
                return this.matchLiteral(node, startPos);
            case ASTNodeType.ALTERNATION:
                return this.matchAlternation(node, startPos);
            case ASTNodeType.SCOPE:
                return this.matchScope(node, startPos);
            case ASTNodeType.ANCHOR:
                return this.matchAnchor(node, startPos);
            case ASTNodeType.CHAR_RANGE:
                return this.matchCharRange(node, startPos);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    
    matchSequence(node, startPos) {
        let pos = startPos;
        let matchedText = '';
        
        for (const element of node.elements) {
            const result = this.matchAt(element, pos);
            if (!result) {
                return null;
            }
            matchedText += result.text;
            pos = result.end;
        }
        
        return {
            text: matchedText,
            start: startPos,
            end: pos
        };
    }
    
    matchCharClass(node, startPos) {
        // Determine count range
        let minCount, maxCount;
        
        if (node.count.exact !== undefined) {
            // Exact: l3
            minCount = maxCount = node.count.exact;
        } else {
            // Range: l(2-4), l(>3), l(<5)
            minCount = node.count.min !== undefined ? node.count.min : 0;
            maxCount = node.count.max !== undefined ? node.count.max : Infinity;
        }
        
        let matched = '';
        let pos = startPos;
        let count = 0;
        
        // Try to match as many as possible (greedy)
        while (pos < this.text.length && count < maxCount) {
            const char = this.text[pos];
            
            if (!this.isCharMatch(char, node.class)) {
                break;
            }
            
            matched += char;
            pos++;
            count++;
        }
        
        // Check if we matched enough
        if (count < minCount) {
            return null;
        }
        
        // Special case: if min is 0 and we're at start, allow empty match
        if (minCount === 0 && count === 0 && startPos === 0) {
            return {
                text: '',
                start: startPos,
                end: startPos
            };
        }
        
        return {
            text: matched,
            start: startPos,
            end: pos
        };
    }
    
    isCharMatch(char, charClass) {
        switch(charClass) {
            case 'lowercase':
                return /[a-zçğıöşü]/.test(char);
            case 'uppercase':
                return /[A-ZÇĞİÖŞÜ]/.test(char);
            case 'digit':
                return /[0-9]/.test(char);
            case 'letter':
                return /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(char);
            case 'vowel':
                return /[aeiouöüAEIOUÖÜ]/.test(char);
            case 'consonant':
                return /[bcdfghjklmnpqrstvwxyzçğşBCDFGHJKLMNPQRSTVWXYZÇĞŞ]/.test(char);
            case 'symbol':
                return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char);
            case 'wildcard':
                return true;
            case 'single':
                return true;
            default:
                return false;
        }
    }
    
    matchLiteral(node, startPos) {
        const literal = node.value;
        const endPos = startPos + literal.length;
        
        if (endPos > this.text.length) {
            return null;
        }
        
        const substring = this.text.substring(startPos, endPos);
        
        if (substring === literal) {
            return {
                text: substring,
                start: startPos,
                end: endPos
            };
        }
        
        return null;
    }
    
    matchAlternation(node, startPos) {
        // Try each alternative (longest match first)
        let longestMatch = null;
        
        for (const alt of node.alternatives) {
            const result = this.matchAt(alt, startPos);
            if (result) {
                if (!longestMatch || result.text.length > longestMatch.text.length) {
                    longestMatch = result;
                }
            }
        }
        
        return longestMatch;
    }
    
    matchScope(node, startPos) {
        // For now, only word scope implemented
        if (node.scope === 'w') {
            // Find word boundary
            let wordEnd = startPos;
            while (wordEnd < this.text.length && !/\s/.test(this.text[wordEnd])) {
                wordEnd++;
            }
            
            // Try to match within word boundary
            const result = this.matchAt(node.pattern, startPos);
            if (result && result.end <= wordEnd) {
                return result;
            }
        }
        
        return null;
    }
    
    matchAnchor(node, startPos) {
        // Try to match the inner pattern
        const result = this.matchAt(node.pattern, startPos);
        
        if (!result) {
            return null;
        }
        
        // Middle anchor: >>pattern<< (must be in the middle, not at edges)
        if (node.middleAnchor) {
            if (result.start === 0 || result.end === this.text.length) {
                return null;  // Must NOT be at start or end
            }
            return result;
        }
        
        // Check start anchor: <<pattern
        if (node.startAnchor && result.start !== 0) {
            return null;  // Must start at beginning
        }
        
        // Check end anchor: pattern>>
        if (node.endAnchor && result.end !== this.text.length) {
            return null;  // Must end at text end
        }
        
        return result;
    }
    
    matchCharRange(node, startPos) {
        // Determine count range
        let minCount, maxCount;
        
        if (node.count.exact !== undefined) {
            minCount = maxCount = node.count.exact;
        } else {
            minCount = node.count.min !== undefined ? node.count.min : 0;
            maxCount = node.count.max !== undefined ? node.count.max : Infinity;
        }
        
        let matched = '';
        let pos = startPos;
        let count = 0;
        
        // Try to match as many as possible (greedy)
        while (pos < this.text.length && count < maxCount) {
            const char = this.text[pos];
            
            if (!this.isCharInRanges(char, node.ranges)) {
                break;
            }
            
            matched += char;
            pos++;
            count++;
        }
        
        // Check if we matched enough
        if (count < minCount) {
            return null;
        }
        
        // Special case: if min is 0 and we're at start, allow empty match
        if (minCount === 0 && count === 0 && startPos === 0) {
            return {
                text: '',
                start: startPos,
                end: startPos
            };
        }
        
        return {
            text: matched,
            start: startPos,
            end: pos
        };
    }
    
    isCharInRanges(char, ranges) {
        // Check if char is in any of the ranges
        for (const range of ranges) {
            const startCode = range.start.charCodeAt(0);
            const endCode = range.end.charCodeAt(0);
            const charCode = char.charCodeAt(0);
            
            if (charCode >= startCode && charCode <= endCode) {
                return true;
            }
        }
        return false;
    }
}

function match(ast, text) {
    const matcher = new Matcher(ast, text);
    return matcher.match();
}