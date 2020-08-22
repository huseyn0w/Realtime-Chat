import {actions} from './actions';

const Reducer = (state, action) => {
    switch (action.type) {
        case actions.LOAD_ROOMS:
            return {
                ...state,
                rooms: action.payload,
            };
        case actions.LEFT_SIDEBAR:
            return {
                ...state,
                leftSidebar: action.payload,
            };
        case actions.RIGHT_SIDEBAR:
            return {
                ...state,
                rightSidebar: action.payload,
            };
        case actions.LOGIN_SUCCESS:
            return {
                ...state,
                logged: true,
            };
        case actions.LOGOUT_CHAT:
            return {
                ...state,
                logged: false,
            };
        case actions.CURRENT_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case actions.CREATE_ROOM:
            const oldRooms = [...state.rooms];
            const newRoomExist = oldRooms.findIndex(x => x._id === action.payload._id);
            if(newRoomExist === - 1){
                oldRooms.push(action.payload);
                return {
                    ...state,
                    rooms: oldRooms,
                };
            }
            return state;
            
        case actions.UPDATE_ROOM:
            const updatedRooms = [...state.rooms];
            const updateArrayIndex = updatedRooms.findIndex(x => x._id === action.payload._id);
            updatedRooms[updateArrayIndex] = action.payload;
            return {
                ...state,
                rooms:updatedRooms,
            };
        case actions.DELETE_ROOM:
            const rooms = [...state.rooms];
            const arrayIndex = rooms.findIndex(x => x._id === action.payload);
            rooms.splice(arrayIndex, 1);
            return {
                ...state,
                rooms,
            };
        case actions.UPDATE_USERS_LIST:
            return {
                ...state,
                roomUsers:action.payload
            };
        case actions.UPDATE_CURRENT_USER_IN_USERS_LIST:
            const currentUsersList = [...state.roomUsers];
            const currentUserArrayIndex = currentUsersList.findIndex(x => x._id === action.payload._id);
            currentUsersList[currentUserArrayIndex] = action.payload;
            return {
                ...state,
                roomUsers: currentUsersList
            };
        case actions.UPDATE_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        case actions.USER_LEFT:
            const usersList = [...state.roomUsers];
            const userArrayIndex = usersList.findIndex(x => x._id === action.payload);
            usersList.splice(userArrayIndex, 1);
            return {
                ...state,
                roomUsers: usersList
            };
        case actions.USER_DATA_UPDATED:
            const currentUserObj = {...state.currentUser};
            currentUserObj.email = action.payload.email;
            currentUserObj.avatar = action.payload.avatar;
            currentUserObj.fullName = action.payload.fullName;
            
            return {
                ...state,
                currentUser: currentUserObj
            };
        default:
            return state;
    }
}

export default Reducer;