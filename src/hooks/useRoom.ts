import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, {
    author:{
        name:string;
        avatar:string;
    }
    content:string;
    isHighlighted:boolean;
    isAnswared:boolean;
    likes:Record<string,{
        authorId:string
    }>
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
    likeCount:number;
    likeId:string | undefined;

}

export function useRoom(roomID:string) {
    const {user} = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

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
                    likeCount:Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes?? {}).find(([key,like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

    },[roomID, user?.id]);
    
    return{questions,title}
}