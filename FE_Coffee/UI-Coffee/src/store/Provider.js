import {useReducer} from 'react'
import * as Context from './Context'

const Provider = ({children}) => {
    const [state, dispatch] = useReducer();
}
 export default Provider