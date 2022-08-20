import {useNavigate, useParams} from 'react-router-dom'

import { RoomCode } from '../components/RoomCode';

import { database } from '../services/firebase';
import {ref, remove, update} from 'firebase/database';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';


type RoomParams = {
    id:string;
}

export function AdminRoom(){
    const navigate = useNavigate()
    const params = useParams<RoomParams>();
    const roomID = params.id!;

    const {questions,title} = useRoom(roomID);

    const hadleDeleteQuestion = async (questionId:string)=>{
        if(window.confirm("Tem certeza quevocê deseja excluir esta pergunta?")) {
            await remove(ref(database,`rooms/${roomID}/questions/${questionId}`))
        }
    }

    const handleEndRoom = async  ()=>{
        //remove(ref(database,`rooms/${roomID}/`))

        update(ref(database,`rooms/${roomID}/`),{
            closedAt: new Date(),
        })

        navigate('/');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomID}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar a Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length>0 &&
                    <span>{questions.length} pergunta (s)</span>}
                </div>
                
                <div className="question-list">
                    {questions.map(question=>
                        <Question
                            key={question.id}
                            author={question.author}
                            content={question.content}
                        >
                            <button
                                type="button"
                                onClick={()=>hadleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="remover pergunta" />
                            </button>
                        </Question>
                    )}
                </div>
            </main>
        </div>
    )
}