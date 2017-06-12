let nextTodoId = 0;

const mkAction = (name) => (param) => {
    return {
        type: name,
        param: param
    }
};
export const entropyEntryFinished = mkAction("GOT_ENTROPY");
export const walletCreated = mkAction("WALLET_CREATED");