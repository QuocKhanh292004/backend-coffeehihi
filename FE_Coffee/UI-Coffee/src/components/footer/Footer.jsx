import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
function Footer(){
     return(
         <div className="p-4 border-t border-[#E5D8C8] bg-white">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EFE7DD] cursor-pointer transition">
                 <div className="w-10 h-10 rounded-full bg-[#EFE7DD] flex items-center justify-center border border-[#E5D8C8]">
                     <FontAwesomeIcon icon={faUser} className="text-[#8C7A6F]" />
                 </div>
                 <div className="overflow-hidden">
                     <p className="text-sm font-semibold text-[#4B2E19] truncate">Khánh Admin</p>
                     <p className="text-xs text-[#8C7A6F] truncate">Quản lý cửa hàng</p>
                 </div>
             </div>
         </div>
     )
}
export default Footer;