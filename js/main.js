// UI Controller
document.addEventListener('DOMContentLoaded', () => {
    const patternInput = document.getElementById('pattern');
    const testTextArea = document.getElementById('testText');
    const matchBtn = document.getElementById('matchBtn');
    const resultsDiv = document.getElementById('results');
    const debugPre = document.getElementById('debug');
    
    // Match button click handler
    matchBtn.addEventListener('click', () => {
        const pattern = patternInput.value;
        const text = testTextArea.value;
        
        try {
            // Step 1: Tokenize
            const tokens = tokenize(pattern);
            
            // Step 2: Parse
            const ast = parse(tokens);
            
            // Step 3: Match
            const matches = match(ast, text);
            
            // Debug output
            debugPre.textContent = JSON.stringify(ast, null, 2);
            
            // Results
            if (matches.length > 0) {
                let resultHTML = '';
                matches.forEach((m, idx) => {
                    resultHTML += `
                        <div class="match">
                            Match ${idx + 1}: "${m.match}" 
                            (pos: ${m.start}-${m.end})
                        </div>
                    `;
                });
                
                resultsDiv.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <span class="match">Pattern: ${pattern}</span>
                        <span class="match">Text: ${text}</span>
                    </div>
                    <p style="color: green; font-weight: bold;">✅ ${matches.length} match(es) found!</p>
                    ${resultHTML}
                `;
            } else {
                resultsDiv.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <span class="match">Pattern: ${pattern}</span>
                        <span class="match">Text: ${text}</span>
                    </div>
                    <p style="color: red; font-weight: bold;">❌ No matches found</p>
                `;
            }
            
        } catch (error) {
            resultsDiv.innerHTML = `
                <div class="no-match">❌ Error: ${error.message}</div>
            `;
            debugPre.textContent = error.stack;
        }
    });
    
    // INSERT BUTTON: Pattern ekleme
    document.querySelectorAll('.insert-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pattern = btn.dataset.pattern;
            patternInput.value += pattern;
            patternInput.focus();
        });
    });
    
    // EXAMPLE BUTTON: Örnek pattern ve text yükleme
    document.querySelectorAll('.pattern-example').forEach(btn => {
        btn.addEventListener('click', () => {
            patternInput.value = btn.dataset.pattern;
            testTextArea.value = btn.dataset.text;
            matchBtn.click(); // Otomatik eşleştir
        });
    });
});
