import { FormEvent, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';
import { onValue, push, ref} from 'firebase/database';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { json } from 'stream/consumers';

type FirebaseQuestions = Record<string, {
    author:{
        name:string;
        avatar:string;
    }
    content:string;
    isHighlighted:boolean;
    isAnswared:boolean;
}>

type QuestionType ={
    id:string;
    author:{
        name:string;
        avatar:string;
    }
    content:string;
    isHighlighted:boolean;
    isAnswared:boolean;
}

type RoomParams = {
    id:string;
}

export function Room(){
    const {user} = useAuth();
    const params = useParams<RoomParams>();

    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    const roomID = params.id!;

    useEffect(()=>{
        const roomRef = ref(database,`rooms/${roomID}`);
        
        onValue(roomRef,(room)=>{
            const databaseRoom = room.val();
            const firebaseQuestions:FirebaseQuestions = databaseRoom.questions ?? {};
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value])=>{
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswared: value.isAnswared,
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    },[roomID]);

    const handleSendQuestions = async (event:FormEvent)=>{
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error("You must be logged in");
        }

        const question = {
            content: newQuestion,
            author:{
               name: user.name,
               avatar: user.avatar,
            },
            isHighlighted:false,
            isAnswared:false
        };

        await push(ref(database,`rooms/${roomID}/questions`),question)

        setNewQuestion('')
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code={roomID}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length>0 &&
                    <span>{questions.length} pergunta (s)</span>}
                </div>

                <form onSubmit={handleSendQuestions}>
                    <textarea
                        placeholder='O que você quer perguntar?'
                        onChange={e=>setNewQuestion(e.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user?(
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ):(
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )}
                        <Button disabled={!user} type='submit'>Enviar Pergunta</Button>
                    </div>
                </form>
                
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}