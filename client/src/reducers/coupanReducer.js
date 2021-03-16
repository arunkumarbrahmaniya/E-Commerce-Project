export const coupanReducer = (state = false, action) => {
    switch(action.type) {
        case "COUPAN_APPLIED" :
            return action.payload;
        default:
            return state;
    }
}