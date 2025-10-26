let simulationInterval = null;
let simulationStopped = false;

// Recursive Language Example: Equal 0s and 1s
document.getElementById('test-recursive').addEventListener('click', () => {
    const input = document.getElementById('recursive-input').value;
    const resultDiv = document.getElementById('recursive-result');
    const simDiv = document.getElementById('recursive-sim');
    
    if (!/^[01]*$/.test(input)) {
        alert('Please enter a valid binary string (0s and 1s only)');
        return;
    }
    
    resultDiv.classList.add('show');
    simDiv.classList.add('show');
    simDiv.innerHTML = '';
    
    // Simulate TM
    addSimulationStep(simDiv, 'Starting Turing Machine for L...');
    addSimulationStep(simDiv, `Input: "${input}"`);
    
    setTimeout(() => {
        const zeros = (input.match(/0/g) || []).length;
        const ones = (input.match(/1/g) || []).length;
        
        addSimulationStep(simDiv, `Counting 0s: ${zeros}`);
        addSimulationStep(simDiv, `Counting 1s: ${ones}`);
        
        const inL = zeros === ones;
        const inLBar = !inL;
        
        setTimeout(() => {
            if (inL) {
                addSimulationStep(simDiv, 'Result: 0s == 1s → ACCEPT (in L)', 'accept');
                resultDiv.className = 'result-area show accept';
                resultDiv.innerHTML = `
                    <strong>String "${input}" ∈ L</strong><br>
                    TM for L: ✅ ACCEPTS<br>
                    TM for L̄: ❌ REJECTS<br><br>
                    Both machines halt! L̄ is decidable.
                `;
            } else {
                addSimulationStep(simDiv, 'Result: 0s ≠ 1s → REJECT (not in L)', 'reject');
                resultDiv.className = 'result-area show reject';
                resultDiv.innerHTML = `
                    <strong>String "${input}" ∉ L</strong><br>
                    TM for L: ❌ REJECTS<br>
                    TM for L̄: ✅ ACCEPTS<br><br>
                    Both machines halt! L̄ is decidable.
                `;
            }
        }, 800);
    }, 500);
});

// RE Language Simulation
document.getElementById('test-re').addEventListener('click', () => {
    const input = document.getElementById('re-input').value;
    const behavior = document.getElementById('tm-behavior').value;
    const resultDiv = document.getElementById('re-result');
    const simDiv = document.getElementById('re-sim');
    const testBtn = document.getElementById('test-re');
    const stopBtn = document.getElementById('stop-simulation');
    
    if (!/^[01]*$/.test(input)) {
        alert('Please enter a valid binary string (0s and 1s only)');
        return;
    }
    
    simulationStopped = false;
    testBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    resultDiv.classList.add('show');
    simDiv.classList.add('show');
    simDiv.innerHTML = '';
    
    addSimulationStep(simDiv, 'Starting Turing Machine simulation...');
    addSimulationStep(simDiv, `Input: "${input}"`);
    addSimulationStep(simDiv, `Behavior: ${behavior}`);
    
    let shouldAccept = false;
    let shouldLoop = false;
    
    // Determine behavior
    switch(behavior) {
        case 'accept-even':
            shouldAccept = input.length % 2 === 0;
            break;
        case 'accept-0':
            shouldAccept = input.startsWith('0');
            break;
        case 'loop-1':
            shouldLoop = input.startsWith('1');
            shouldAccept = false;
            break;
        case 'reject-empty':
            shouldAccept = input.length > 0;
            break;
    }
    
    setTimeout(() => {
        if (shouldLoop) {
            resultDiv.className = 'result-area show looping';
            resultDiv.innerHTML = `
                <strong>⚠️ TM is LOOPING (infinite computation)</strong><br>
                String "${input}" causes infinite loop<br><br>
                Problem: We cannot decide if string is in L̄!<br>
                Cannot distinguish "reject" from "loop forever"<br>
                This is why RE languages are NOT closed under complement!
            `;
            
            let step = 1;
            simulationInterval = setInterval(() => {
                if (simulationStopped) {
                    clearInterval(simulationInterval);
                    addSimulationStep(simDiv, '⏹️ Simulation stopped by user', 'reject');
                    testBtn.style.display = 'inline-block';
                    stopBtn.style.display = 'none';
                    return;
                }
                addSimulationStep(simDiv, `Step ${step}: Reading tape, moving head... (looping forever)`);
                step++;
                if (step > 15) {
                    simDiv.innerHTML += '<div class="simulation-step">... (continues forever) ...</div>';
                    clearInterval(simulationInterval);
                    testBtn.style.display = 'inline-block';
                    stopBtn.style.display = 'none';
                }
            }, 400);
        } else if (shouldAccept) {
            addSimulationStep(simDiv, 'Processing...', 'accept');
            setTimeout(() => {
                addSimulationStep(simDiv, '✅ TM ACCEPTS - string is in L', 'accept');
                resultDiv.className = 'result-area show accept';
                resultDiv.innerHTML = `
                    <strong>String "${input}" ∈ L</strong><br>
                    TM for L: ✅ ACCEPTS (halts)<br>
                    TM for L̄: Would need to recognize this is NOT in L̄<br><br>
                    For complement: If L̄ were RE, we'd need a TM that accepts strings NOT in L.
                `;
                testBtn.style.display = 'inline-block';
                stopBtn.style.display = 'none';
            }, 800);
        } else {
            addSimulationStep(simDiv, 'Processing...', 'reject');
            setTimeout(() => {
                addSimulationStep(simDiv, '❌ TM REJECTS - string is not in L', 'reject');
                resultDiv.className = 'result-area show reject';
                resultDiv.innerHTML = `
                    <strong>String "${input}" ∉ L</strong><br>
                    TM for L: ❌ REJECTS (or loops)<br>
                    TM for L̄: Would need to ACCEPT this<br><br>
                    Problem: How can L̄'s TM know to accept?<br>
                    It cannot distinguish definite rejection from infinite loop!
                `;
                testBtn.style.display = 'inline-block';
                stopBtn.style.display = 'none';
            }, 800);
        }
    }, 500);
});

document.getElementById('stop-simulation').addEventListener('click', () => {
    simulationStopped = true;
});

function addSimulationStep(container, text, type = '') {
    const step = document.createElement('div');
    step.className = 'simulation-step';
    if (type === 'accept') {
        step.style.borderLeftColor = '#28a745';
    } else if (type === 'reject') {
        step.style.borderLeftColor = '#dc3545';
    }
    step.textContent = text;
    container.appendChild(step);
    container.scrollTop = container.scrollHeight;
}