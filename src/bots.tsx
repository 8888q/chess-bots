import React, {useState} from 'react'

import { Chess, Move, Square } from 'chess.js';
import Chessground from "@react-chess/chessground";

type BotProps = {
    moveFunction: (board: Chess) => Move,
    width?: number,
    height?: number
}

export function RandomBot(board: Chess) {
    const moves: Move[] = board.moves({verbose: true});
    const move: Move = moves[Math.floor(Math.random() * moves.length)];

    return move;   
}

export function AlphabeticalBot(board: Chess) {
    let moves: Move[] = board.moves({verbose: true});
    moves = moves.sort(((a: Move, b: Move) => (a.san < b.san ? -1 : 1)));
    const move: Move = moves[0];

    return move;    
}

export function GenericBot(props: BotProps): JSX.Element {
    const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    const [dests, setDests] = useState(toDests(new Chess()));

    function makeMove(orig: string, dest: string){
        let chess = new Chess(fen);
        if( chess.turn() === 'w' ){
            chess.move( {from: orig, to: dest} );
        }
        if(chess.isCheckmate()) return;
        const move: Move = props.moveFunction(chess);
        chess.move(move.san);
        if(chess.isCheckmate()) return;
        setFen(chess.fen());
        setDests(toDests(chess));
    }

    return (
        <div>
            <Chessground
                width={props.width}
                height={props.height}
                config={{fen: fen, events: {move: makeMove}, movable: {free: false, dests: dests}}}/>
        </div>
    )   
}

function toDests(chess: Chess): Map<Square, Square[]> {
    const dests = new Map();
    SQUARES.forEach(s => {
      const ms = chess.moves({square: s, verbose: true});
      if (ms.length) dests.set(s, ms.map(m => m.to));
    });
    return dests;
  }

  const SQUARES: Square[] = [
    'a8',
    'b8',
    'c8',
    'd8',
    'e8',
    'f8',
    'g8',
    'h8',
    'a7',
    'b7',
    'c7',
    'd7',
    'e7',
    'f7',
    'g7',
    'h7',
    'a6',
    'b6',
    'c6',
    'd6',
    'e6',
    'f6',
    'g6',
    'h6',
    'a5',
    'b5',
    'c5',
    'd5',
    'e5',
    'f5',
    'g5',
    'h5',
    'a4',
    'b4',
    'c4',
    'd4',
    'e4',
    'f4',
    'g4',
    'h4',
    'a3',
    'b3',
    'c3',
    'd3',
    'e3',
    'f3',
    'g3',
    'h3',
    'a2',
    'b2',
    'c2',
    'd2',
    'e2',
    'f2',
    'g2',
    'h2',
    'a1',
    'b1',
    'c1',
    'd1',
    'e1',
    'f1',
    'g1',
    'h1',
];