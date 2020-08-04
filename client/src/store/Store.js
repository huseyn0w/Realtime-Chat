import React, {createContext, useReducer} from "react";
import Reducer from '../reducers/Reducer';


const currentUser = {
    _id:'-',
    fullName: '-',
    email: '-'
};

const initialState = {
    leftSidebar:true,
    rightSidebar:true,
    logged:false,
    activeUsers: [],
    rooms: [],
    currentRoom: null,
    currentUser,
    roomUsers: [],
    messages: [],
    error: null
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;