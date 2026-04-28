      class TicTacToe {
         constructor() {
              this.board = ['', '', '', '', '', '', '', '', ''];
              this.currentPlayer = 'X';
              this.gameActive = true;
              this.gameMode = 'pvp'; // 'pvp' or 'pvc'
              this.scores = { X: 0, O: 0, draw: 0 };
              
             this.winningConditions = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8],
                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                    [0, 4, 8], [2, 4, 6]
                ];

                this.initializeGame();
            }

            initializeGame() {
                this.bindEvents();
                this.updateDisplay();
                this.loadScores();
            }

            bindEvents() {
                // Cell clicks
                document.querySelectorAll('.cell').forEach((cell, index) => {
                    cell.addEventListener('click', () => this.handleCellClick(index));
                });

                // Reset button
                document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());

                // Score reser button
                document.getElementById('scoreResetBtn').addEventListener('click', () => this.resetScores());
                
                // Mode buttons
                document.getElementById('pvpMode').addEventListener('click', () => this.setGameMode('pvp'));
                document.getElementById('pvcMode').addEventListener('click', () => this.setGameMode('pvc'));

                // Theme toggle
                document.getElementById('switch').addEventListener('change', this.toggleTheme);
            }
         
                
            handleCellClick(index) {
                if (this.board[index] !== '' || !this.gameActive) return;

                this.makeMove(index, this.currentPlayer);

                if (this.gameMode === 'pvc' && this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => this.computerMove(), 500);
                }
            }

            makeMove(index, player) {
                this.board[index] = player;
                this.updateCell(index, player);
                
                if (this.checkWinner()) {
                    this.handleGameEnd(player);
                } else if (this.checkDraw()) {
                    this.handleGameEnd('draw');
                } else {
                    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                    this.updateDisplay();
                }
            }

            computerMove() {
                const availableMoves = this.board
                    .map((cell, index) => cell === '' ? index : null)
                    .filter(val => val !== null);

                if (availableMoves.length === 0) return;

                // Try to win
                let move = this.findBestMove('O');
                if (move === -1) {
                    // Try to block player from winning
                    move = this.findBestMove('X');
                }
                if (move === -1) {
                    // Take center if available
                    if (availableMoves.includes(4)) {
                        move = 4;
                    } else {
                        // Random move
                        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    }
                }

                this.makeMove(move, 'O');
            }

            findBestMove(player) {
                for (let condition of this.winningConditions) {
                    const [a, b, c] = condition;
                    const cells = [this.board[a], this.board[b], this.board[c]];
                    
                    if (cells.filter(cell => cell === player).length === 2 &&
                        cells.filter(cell => cell === '').length === 1) {
                        return condition[cells.indexOf('')];
                    }
                }
                return -1;
            }

            checkWinner() {
                for (let condition of this.winningConditions) {
                    const [a, b, c] = condition;
                    if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                        this.highlightWinningCells(condition);
                        return this.board[a];
                    }
                }
                return null;
            }

            checkDraw() {
                return this.board.every(cell => cell !== '');
            }

            highlightWinningCells(condition) {
                condition.forEach(index => {
                    document.querySelector(`[data-index="${index}"]`).classList.add('winning');
                });
            }

            handleGameEnd(result) {
                this.gameActive = false;
                let message = '';

                if (result === 'draw') {
                    message = "It's a Draw!";
                    this.scores.draw++;
                } else {
                    message = `Player ${result} Wins!`;
                    this.scores[result]++;
                    this.createConfetti();
                }

                this.showWinnerMessage(message);
                this.updateScores();
                this.saveScores();
            }

            showWinnerMessage(message) {
                const winnerDiv = document.getElementById('game-winner');
                winnerDiv.textContent = message;
                winnerDiv.style.display = 'inline-block';
            }

            createConfetti() {
                const colors = ['#FF0080', '#00FF80', '#8000FF', '#FF4000', '#00BFFF', '#FFD700', '#FF1493', '#00FF00', '#FF6347', '#1E90FF'];
                
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        const confetti = document.createElement('div');
                        confetti.classList.add('confetti');
                        confetti.style.left = Math.random() * window.innerWidth + 'px';
                        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                        
                        document.body.appendChild(confetti);
                        
                        setTimeout(() => {
                            confetti.remove();
                        }, 4000);
                    }, i * 20);
                }
            }


            updateCell(index, player) {
                const cell = document.querySelector(`[data-index="${index}"]`);
                cell.textContent = player;
                cell.classList.add(player.toLowerCase(), 'filled');
            }

            updateDisplay() {
                const status = document.getElementById('gamestatus');
                if (this.gameActive) {
                    if (this.gameMode === 'pvc' && this.currentPlayer === 'O') {
                        status.textContent = 'Computer is thinking...';
                    } else {
                        status.textContent = `Player ${this.currentPlayer}'s turn`;
                    }
                }
            }

            updateScores() {
                document.getElementById('scoreX').textContent = this.scores.X;
                document.getElementById('scoreO').textContent = this.scores.O;
                document.getElementById('scoredraw').textContent = this.scores.draw;
            }

            resetGame() {
                this.board = ['', '', '', '', '', '', '', '', ''];
                this.currentPlayer = 'X';
                this.gameActive = true;

                document.querySelectorAll('.cell').forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winning', 'filled');
                });

                document.getElementById('game-winner').style.display = 'none';
                this.updateDisplay();
            }

            setGameMode(mode) {
                this.gameMode = mode;
                this.resetGame();

                document.querySelectorAll('.mode1, .mode2').forEach(btn => btn.classList.remove('active'));
                
                if (mode === 'pvp') {
                    document.getElementById('pvpMode').classList.add('active');
                } else {
                    document.getElementById('pvcMode').classList.add('active');
                }
            }

            toggleTheme() {
                document.body.classList.toggle('light-mode');
                localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
            }
                    
            resetScores() {
                this.scores = { X: 0, O: 0, draw: 0 };
                this.updateScores();
                this.saveScores();
            }                   
 
            saveScores() {
                localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
            }

            loadScores() {
                const savedScores = localStorage.getItem('ticTacToeScores');
                if (savedScores) {
                    this.scores = JSON.parse(savedScores);
                    this.updateScores();
                }

                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                    document.body.classList.add('light-mode');
                    document.getElementById('switch').checked = true;
                }
            }
        }

        // Initialize the game when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new TicTacToe();
        });
