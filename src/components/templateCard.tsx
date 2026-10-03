import { Link } from "react-router";
import './templateCard.css'

type TemplateCardProps = {
    id: string;
    title: string;
    imageUrl: string;
}

function templateCard(props: TemplateCardProps) {
    return (
        <>
            <Link to={`/templates/${props.id}`}>
                <article className="template-card">
                    <header className="--title">{props.title}</header>
                    <div className="--image-container">
                        <img src={props.imageUrl} alt="Template Image" />
                    </div>
                </article>
            </Link>
        </>
    );
}

export default templateCard;
