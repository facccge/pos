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

function buildOriginalBill(formatedSelectedItems,items){
    let itemDetails = new Array();
    let totalPrice = 0.00;
    for(let formatedSelectedItem of formatedSelectedItems){
      for(let item of items){
        if(formatedSelectedItem.barcode == item.barcode){
          // barcode,name,price,unit,quantity,subtotalPrice
          let itemDetail = {}; 
          itemDetail.barcode = item.barcode;
          itemDetail.name = item.name;
          itemDetail.price = item.price;
          itemDetail.unit = item.unit;
          itemDetail.quantity = formatedSelectedItem.quantity;
          itemDetail.subtotalPrice = itemDetail.price * itemDetail.quantity;
          itemDetails.push(itemDetail);
          totalPrice += itemDetail.subtotalPrice;
        }
      }
    }  
    //itemDetails,totalPrice
    let originalBill = {};
    originalBill.itemDetails = itemDetails;
    originalBill.totalPrice = totalPrice;
    return originalBill
  }

module.exports = {printInventory,formateInputs,buildOriginalBill};
