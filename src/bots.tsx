import React, {useState} from 'react'

import { Chess, Move, Square, DEFAULT_POSITION, PieceSymbol } from 'chess.js';
import Chessground from "@react-chess/chessground";

type BotProps = {
    moveFunction: (board: Chess) => string,
}

export function AlphabeticalBot() {
    function move(board: Chess): string {
        let moves: Move[] = board.moves({verbose: true});
        moves.sort(((a: Move, b: Move) => (a.san < b.san ? -1 : 1)));
        const move: Move = moves[0];
        
        return move.san;    
    }
    
    return (
        <GenericBot moveFunction={move} />
    );
}

export function ReverseAlphabeticalBot() {
    function move(board: Chess): string {
        let moves: Move[] = board.moves({verbose: true});
        moves.sort(((a: Move, b: Move) => (a.san > b.san ? -1 : 1)));
        const move: Move = moves[0];
        
        return move.san;
    }
    
    return (
        <GenericBot moveFunction={move} />
    );
}

export function GreedyBot(): JSX.Element {
    function move(board: Chess): string {
        let moves: Move[] = board.moves({verbose: true});
        var candidates: Move[] = captures(moves);
        if(candidates.length == 0) return moves[Math.floor(Math.random() * moves.length)].san; // if there exist no captures, random
    
        return candidates[0].san; 
    }

    return (
        <GenericBot moveFunction={move} />
    );
}

export function PrinciplesBot(): JSX.Element {
    function move(board: Chess): string {
        let moves: Move[] = board.moves({verbose: true});
        let chess: Chess;
        //deliver checkmate
        for(let index in moves ){
            chess = new Chess(moves[index].after);
            if( chess.isCheckmate() ) return moves[index].san;
        }
        //get out of check
        if(board.isCheck()){
            return moves[0].san;
        }
        const caps = captures(moves);
        //take [free] pieces
        for( let index in caps ){
            let capturedValue = PIECE_VALUE.get(caps[index].captured as PieceSymbol) ?? 1;
            let capturingValue = PIECE_VALUE.get(caps[index].piece) ?? 1;
            if(capturedValue >= capturingValue || !board.isAttacked(caps[index].to, 'w')) return caps[index].san;
        }
        //control the center
        if( !board.isAttacked('e5','w')  && !board.get('e5') && board.get('e7').color == 'b' && board.get('e7').type == 'p' ) return 'e5';
        else if( !board.isAttacked('d5','w') && !board.get('d5') && board.get('d7').color == 'b' && board.get('d7').type == 'p') return 'd5';
        //develop your pieces, knights before bishops
        if( board.get('g8').type == 'n' && board.get('g8').color == 'b' ){
            if( !board.isAttacked('f6','w') && !board.get('f6')) return 'Nf6';
        }
        if( board.get('b8').type == 'n' && board.get('b8').color == 'b' ){
            if( !board.isAttacked('c6','w') && !board.get('c6')) return 'Nc6';
        }
        if( board.get('f8').type == 'b' && board.get('f8').color == 'b' ){
            if( !board.get('e7') ){
                if( !board.get('d6') ){
                    if (!board.get('c5')){
                        if( !board.isAttacked('c5','w') ) return 'Bc5';
                    }
                    else if( !board.isAttacked('d6','w') ) return 'Bd6';
                }
                else if( !board.isAttacked('e7','w') ) return 'Be7';
            }
        }
        if( board.get('c8').type == 'b' && board.get('c8').color == 'b' ){
            if( !board.get('d7') ){
                if( !board.get('e6') ){
                    if (!board.get('f5')){
                        if( !board.isAttacked('f5','w') ) return 'Bf5';
                    }
                    else if( !board.isAttacked('e6','w') ) return 'Be6';
                }
                else if( !board.isAttacked('d7','w') ) return 'Bd7';
            }
        }
        //castle to safety
        let castlingRights = board.getCastlingRights('b');
        if( castlingRights.k && !board.get('f8') && !board.get('g8') && !board.isAttacked('f8', 'w') && !board.isAttacked('g8', 'w') && !board.isCheck()){
            return "O-O";
        }
        else if( castlingRights.q && !board.get('d8') && !board.get('c8') && !board.get('b8') && !board.isAttacked('d8', 'w') && !board.isAttacked('c8', 'w') && !board.isCheck()){
            return "O-O-O";
        }
        //don't hang your pieces
        let candidates: Move[] = [];
        for( let index in moves ){
            if(!board.isAttacked(moves[index].to, 'w')) candidates.push(moves[index]);
        }
        if(candidates.length == 0) return moves[Math.floor(Math.random() * moves.length)].san;
        return candidates[Math.floor(Math.random() * candidates.length)].san;
    }

    return (
        <GenericBot moveFunction={move} />
    );
}

export function RandomBot(): JSX.Element {
    function move(board: Chess): string {
        const moves: Move[] = board.moves({verbose: true});
        const move: Move = moves[Math.floor(Math.random() * moves.length)];
    
        return move.san;   
    }

    return (
        <GenericBot moveFunction={move} />
    );
}

export function GenericBot(props: BotProps): JSX.Element {
    const [fen, setFen] = useState(DEFAULT_POSITION)
    const [isCheck, setCheck] = useState<boolean | "white" | "black">(false);
    const [dests, setDests] = useState(toDests(new Chess()));

    const chessSize = Math.floor(window.innerHeight*0.7);

    function makeMove(orig: string, dest: string){
        let chess = new Chess(fen);
        if( chess.turn() === 'w' ){
            chess.move( {from: orig, to: dest} );
        }

        function checkmate(color: boolean | "white" | "black"){
            setCheck(color); // highlight king
            setFen(chess.fen()); // update board
            setDests(new Map()); // prevent new moves
            setTimeout(() => {
                setCheck(false);
                setFen(DEFAULT_POSITION);
                setDests(toDests(new Chess()));
            }, 2000); // reset board on game end
        }

        if(chess.isCheckmate()) {
            checkmate("black");
            return;
        } 
        chess.move(props.moveFunction(chess));
        if(chess.isCheckmate()){
            checkmate("white");
            return;
        } 
        if(chess.isCheck()){
            setCheck("white");
        } 
        else{
            setCheck(false);
        }
        setFen(chess.fen());
        setDests(toDests(chess));
    }

    return (
        <div>
            <Chessground
                width={chessSize}
                height={chessSize}
                config={
                    {
                        fen: fen,
                        highlight: {
                            lastMove: false,
                            check: true
                        },
                        check: isCheck,
                        events: {move: makeMove},
                        movable: {free: false, dests: dests}
                    }
                }
            />
        </div>
    )   
}

//returns all moves that are captures, sorted from most valuable to least valuable
function captures(moves: Move[]): Move[]{
        let candidates: Move[] = [];
        for(let index in moves ){
            if(moves[index].captured !== undefined){
                candidates.push(moves[index]);
            } 
        }
        candidates.sort(((a: Move, b: Move) => (PIECE_VALUE.get(a.captured as PieceSymbol) ?? 0 < (PIECE_VALUE.get(b.captured as PieceSymbol) ?? 0) ? -1 : 1)));
        console.log(candidates);
        return candidates;
}

// Returns all possible destinations for each square
function toDests(chess: Chess): Map<Square, Square[]> {
    const dests = new Map();
    SQUARES.forEach(s => {
      const ms = chess.moves({square: s, verbose: true});
      if (ms.length) dests.set(s, ms.map(m => m.to));
    });
    return dests;
  }

const PIECE_VALUE: Map<PieceSymbol, number> = new Map(
    [
        ['p', 1],
        ['b', 3],
        ['n', 3],
        ['r', 5],
        ['q', 9]
    ]
  );

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