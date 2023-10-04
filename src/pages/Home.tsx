import { useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { get, ref } from 'firebase/database'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'

export function Home(){
    const navigate = useNavigate();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    const handleCreateRoom = async () => {
        if(!user){
            await signInWithGoogle();
        }
        
        navigate('/rooms/new');
    }

    const handleJoinRoom = async (event:FormEvent)=>{
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await get(ref(database,`rooms/${roomCode}`));

        if(!roomRef.exists()){
            alert('Room does not exists');;
            return;
        }

        if (roomRef.val().closedAt) {
            alert('Rom already closed');
            return;
        }

        navigate(`/rooms/${roomCode}`);

    }
    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração simboliando perguntas e respostas" />
                <strong>Crie salas de Q&amp; A ao-vivo </strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="LetmeAsk" />
                    
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="logo do Google" />
                        Crie a sua sala com o Google
                    </button>

                    <div className='separator'>ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={e=>setRoomCode(e.target.value)}
                            value={roomCode}
                        />

                        <Button type='submit'>
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}