import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faSearch} from "@fortawesome/free-solid-svg-icons";

function Search() {
     return (
         <div className="hidden md:flex items-center w-[45%]">
             <div className="flex items-center w-full bg-white border border-[#D8C8B4]
                                    rounded-full overflow-hidden shadow-sm">
                 <input
                     type="text"
                     placeholder="Tìm kiếm món, nhân viên, bàn phục vụ..."
                     className="flex-1 px-4 py-2 outline-none text-[#4B2E19] text-sm"
                 />
                 <button className="px-4 py-2 bg-[#4B2E19] text-white hover:bg-[#5c3a23] transition">
                     <FontAwesomeIcon icon={faSearch} />
                 </button>
             </div>
         </div>
     )
}
export default Search;