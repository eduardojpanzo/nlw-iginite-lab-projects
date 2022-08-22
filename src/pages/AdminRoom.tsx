import {useNavigate, useParams} from 'react-router-dom'

import { RoomCode } from '../components/RoomCode';

import { database } from '../services/firebase';
import {ref, remove, update} from 'firebase/database';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

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
    const hadleCheckQuestionAsAnswered = async (questionId:string)=>{
        await update(ref(database,`rooms/${roomID}/questions/${questionId}`),{
            isAnswared:true
        })
    }

    const hadleHighLihgtQuestion = async (questionId:string)=>{
        await update(ref(database,`rooms/${roomID}/questions/${questionId}`),{
            isHighlighted:true
        })
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
                            isAnswared={question.isAnswared}
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswared &&(
                            <>
                                <button
                                    type="button"
                                    onClick={()=>hadleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="check pergunta como respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={()=>hadleHighLihgtQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="answer pergunta" />
                                </button>
                            </>
                            )}
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