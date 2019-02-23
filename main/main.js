function printInventory(inputs) {
    let formatedInputs = formateInputs(inputs);
    return formatedInputs;
}

function formateInputs(inputs){
    let inputsMap = {};
    for(let input of inputs){
        let inputArr = input.split('-');
        let barcode = inputArr[0];
        let quantity = 1;
        if(inputArr.length > 1){
            quantity = parseInt(inputArr[1]);
        }
        if(inputsMap[barcode]){
            inputsMap[barcode] = inputsMap[barcode]+ quantity;
        }else{
            inputsMap[barcode] = quantity;
        }
    }
    let formatedInputs = new Array();
    for(let key in inputsMap){
        let formatedInput = {};
        formatedInput.barcode = key;
        formatedInput.quantity = inputsMap[key];
        formatedInputs.push(formatedInput);
    }
    return formatedInputs;
}

module.exports = {printInventory,formateInputs};
