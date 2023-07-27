import {Actions} from "./App"

export default function OperationButton({dispatch, operation}){
    return <button onClick={()=> dispatch({type: Actions.choose_operation, payload: {operation}})}>
        {operation}
        </button>
}