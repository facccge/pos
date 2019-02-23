function printInventory(inputs) {
    let formatedInputs = formateInputs(inputs);
    return formatedInputs;
}

function formateInputs(inputs){
    let inputsMap = {};
    for(let input of inputs){
        let inputArr = input.split('-');
        let id = inputArr[0];
        let quantity = 1;
        if(inputArr.length > 1){
            quantity = parseInt(inputArr[1]);
        }
        if(inputsMap[id]){
            inputsMap[id] = inputsMap[id]+ quantity;
        }else{
            inputsMap[id] = quantity;
        }
    }
    let formatedInputs = new Array();
    for(let key in inputsMap){
        let formatedInput = {};
        formatedInput.id = key;
        formatedInput.quantity = inputsMap[key];
        formatedInputs.push(formatedInput);
    }
    return formatedInputs;
}

module.exports = {printInventory,formateInputs};
