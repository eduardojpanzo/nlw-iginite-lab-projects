import {useParams} from 'react-router-dom'
import { Button } from '../components/Button';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';

type RoomParms = {
    id:string;
}

export function Room(){
    const parms = useParams<RoomParms>();
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code={parms.id!}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form >
                    <textarea
                        placeholder='O que você quer perguntar?'
                    />

                    <div className="form-footer">
                        <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        <Button type='submit'>Enviar Pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}