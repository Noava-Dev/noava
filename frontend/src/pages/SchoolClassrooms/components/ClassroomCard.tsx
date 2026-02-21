import {
    LuBookOpen as Book,
    LuUsers as Users
} from "react-icons/lu";

type ClassroomCardProps = {
    id: number;
    name: string;
    description: string;
    deckCount: number;
    studentCount: number;
};

export default function ClassroomCard({ id, name, description, deckCount, studentCount }: ClassroomCardProps){
    return(
        <div className="whitebox">
            {/* classroom details */}
            <div className="classroomnamedescicon">
                <div className="icon">
                    <Book size={24} /> 
                </div>
                <div className="titleDesc">
                    <div className="Title">{name}</div>
                    <div className="description">{description}</div>
                </div>
            </div>

            {/* linked stats */}
            <div className="decksStudents">
                <div className="flex">
                    <Book /> 
                    <span>{deckCount} decks</span>
                </div>
                <div className="flex">
                    <Users /> 
                    <span>{studentCount} students</span>
                </div>
            </div>
        </div>
    )
}