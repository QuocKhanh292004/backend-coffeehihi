import { useParams } from "react-router-dom";
import Possystem from "./Possystem.jsx";

const PageCustomer = () => {
     const { branch_id, table_id } = useParams();

     return (
         <Possystem
             branch_id={branch_id}
             table_id={table_id}
         />
     );
};

export default PageCustomer;