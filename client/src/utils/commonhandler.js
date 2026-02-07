export const CommonStateHandler = (name, value, setStateFunction) => {

    setStateFunction((currentState) => {
        const newState = { ...currentState };

        const keys = name.split(".");

        let temp = newState;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            if (!temp[key]) {
                temp[key] = isNaN(keys[i + 1]) ? {} : [];
            }

            temp = temp[key];
        }

        temp[keys[keys.length - 1]] = value;

        return newState;
    });
};
