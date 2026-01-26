import { useEffect, useState } from "react";
// import { schoolService } from "../../services/SchoolService"
import { LuBuilding2,
    LuTrash2,
    LuPencil,
    LuPlus,
    LuX,
    LuSearch,
    LuUsers
 } from "react-icons/lu";

function SchoolsPage(){
    const [schools, setSchools] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // const { getAll } = schoolService();

    // useEffect(() => {
    //     const fetchSchools = async () => {
    //         try{
    //             setLoading(true);
    //             const data = await getAll();
    //             setSchools(data);
                
    //         }catch(err) {

    //         }finally {
    //             setLoading(false);
    //         }
    //     }
    // })

}