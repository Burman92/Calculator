import "./styles.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const Actions = {
  add_digit: "add-digit",
  choose_operation: "choose-operation",
  clear: "clear",
  delete_digit: "delete-digit",
  evaluate: "evaluate"
}

function reducer(state, {type, payload}){
  switch(type){
    case Actions.add_digit:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0"){
        return state
      } 
      if(payload.digit === "." && state.currentOperand.includes(".")){
        return state
      } 
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case Actions.clear:
        return {}
      case Actions.choose_operation:
        if(state.currentOperand == null && state.previousOperand ==null){
          return null
        }
        if(state.currentOperand == null){
          return{
            ...state,
            operation: payload.operation
          }
        }
        if(state.previousOperand == null){
          return{
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
        return{
          ...state,
          previousOperand: evaluate(state),
          currentOperand: null,
          operation: payload.operation
        }
      case Actions.evaluate:
          if(state.operation == null || state.currentOperand ==null || state.previousOperand == null){
            return state
          }
          return{
            ...state,
            previousOperand: null,
            currentOperand: evaluate(state),
            operation: null,
            overwrite: true
          }
      case Actions.delete_digit:
        if(state.overwrite){
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null){
          return state
        }
        if(state.currentOperand.length = 1){
          return{
            ...state,
            currentOperand: null
          }
        }
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)
        }
      }
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN (current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break 
      case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}
const intFormat = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})

function formatOperation(operand){
  if(operand == null) return
  const[interger, decimal] = operand.split('.')
  if(decimal == null) return intFormat.format(interger)
  return `${intFormat.format(interger)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="Calculator-grid">
      <div className="Output">
        <div className="Previous-operand">{formatOperation(previousOperand)} {operation}</div>
        <div className="Current-operand">{formatOperation(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: Actions.clear})}>AC</button>
      <button onClick={() => dispatch({ type: Actions.delete_digit})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two"onClick={() => dispatch({ type: Actions.evaluate})}>=</button>
    </div>
  )
}

export default App;
