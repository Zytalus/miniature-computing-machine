import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculatePosition(i){
    const col = (i % 3) + 1;
    const row = parseInt((i / 3) + 1);
    const pos = [col, row];
    return pos;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let divBoard = [];
        for(let i = 0; i < 3; i++){
            let divBoardRow = [];
            for(let j = 0; j < 3; j++){
                divBoardRow.push(<>{this.renderSquare(j+(i*3))}</>)
            }
            divBoard.push(<div className='board-row'>{divBoardRow}</div>)
        }
        return (
            <>
            {divBoard}
            </>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: null
            }],
            xIsNext: true,
            sortIsAssending: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    handleToggle() {
        this.setState({
            sortIsAssending: !this.state.sortIsAssending,
        });

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let moves = history.map((step, move) => {            
            const position = calculatePosition(history[move].position);
            const description = move ? 
                (move % 2 === 1) ? 
                    'X at [' + position + ']' : 
                    'O at [' + position + ']' :
                    'Game Start';
            if (move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <strong>{description}</strong>
                    </li>
                );
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        let sortStatus = this.state.sortIsAssending ? '\u2191' : '\u2193';
        moves = (this.state.sortIsAssending) ? moves : moves.reverse();

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleToggle()}>{sortStatus}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
