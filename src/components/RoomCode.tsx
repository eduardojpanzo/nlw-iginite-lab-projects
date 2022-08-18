import copyImg from '../assets/images/copy.svg';

import "../styles/roomCode.scss";

type RoomCodeProps = {
    code:string
}
export function RoomCode({code}:RoomCodeProps) {

    const copyRoomToClipboard = ()=>{
        navigator.clipboard.writeText(code);
    }
    return(
        <button className='room-code' onClick={copyRoomToClipboard}>
            <div>
                <img src={copyImg} alt="copy room code" />
            </div>
            <span>sala #{code}</span>
        </button>
    )
}