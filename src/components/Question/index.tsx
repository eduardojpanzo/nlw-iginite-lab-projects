import { ReactNode } from 'react';
import './styles.scss';

type QuestionProp = {
    content:string;
    author:{
        name:string;
        avatar:string;
    };
    children?:ReactNode;
    isAnswared?:boolean;
    isHighlighted?:boolean;
}

export function Question({
    content,
    author,
    isAnswared=false,
    isHighlighted= false, 
    children,
}:QuestionProp){
    return(
        <div className={`question ${isAnswared?'answered':''} ${isHighlighted && !isAnswared?'highlighted':''}`}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}