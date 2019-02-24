const datbase = require('./datbase')
const loadAllItems = datbase.loadAllItems
const loadPromotions = datbase.loadPromotions

function printInventory(inputs) {
    let items = loadAllItems();
    let promoitons = loadPromotions();
    let formatedInputs = formateInputs(inputs);
    let originalBill = buildOriginalBill(formatedInputs,items);
    let promotionInfo = usePromotions(originalBill,promoitons);
    let finalBill = buildFinalBill(originalBill,promotionInfo);
    printBill(finalBill);
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

function usePromotions(originalBill,promotions){
    let promotionInfo = {};
    promotionInfo.isabled = false;
    promotionInfo.description = '';
    promotionInfo.itemDetails = [];
    for(let promotion of promotions){
        if(promotion.type == 'BUY_TWO_GET_ONE_FREE'){
            promotionInfo.isabled = true;
            promotionInfo.description = '挥泪赠送商品';
            let promotionInfoItemDetails = new Array();
            let discountedPrice = 0.0;
            for(let itemDetail of originalBill.itemDetails){
                for(let barcode of promotion.barcodes){
                  if(itemDetail.barcode == barcode){
                    // name,unit,quantity
                    let promotionInfoItemDetail = {}; 
                    promotionInfoItemDetail.barcode = itemDetail.barcode;
                    promotionInfoItemDetail.name = itemDetail.name;
                    promotionInfoItemDetail.unit = itemDetail.unit;
                    promotionInfoItemDetail.quantity = 1;
                    promotionInfoItemDetails.push(promotionInfoItemDetail);
                    discountedPrice += itemDetail.price * promotionInfoItemDetail.quantity;
                  }
                }
            }
            promotionInfo.itemDetails=promotionInfoItemDetails;
            promotionInfo.discountedPrice = discountedPrice;
          }
    }
    return promotionInfo
}

function buildFinalBill(originalBill,promotionInfo){
    let finalBill = {};
    finalBill.itemDetails = originalBill.itemDetails;
    finalBill.discountedPrice = 0.0;
    if(promotionInfo.isabled==true){
        finalPromotionInfo = {};
        finalPromotionInfo.itemDetails = promotionInfo.itemDetails;
        finalPromotionInfo.description = promotionInfo.description;
        finalBill.promotionInfo = finalPromotionInfo;
        finalBill.discountedPrice = promotionInfo.discountedPrice;
        finalBill.totalPrice = originalBill.totalPrice - promotionInfo.discountedPrice;
        for(let itemDetail of finalBill.itemDetails){
            for(let discountedItemDetail of promotionInfo.itemDetails){
                if(itemDetail.barcode == discountedItemDetail.barcode){
                    itemDetail.subtotalPrice = itemDetail.price * (itemDetail.quantity-discountedItemDetail.quantity);
                }
            }
        }    
    }
    return finalBill;
  }

  function printBill(finalBill){
      let outputString = '***<没钱赚商店>购物清单***\n';
    for(let itemDetail of finalBill.itemDetails){
      outputString += '名称：' 
      + itemDetail.name + '，数量：'
      + itemDetail.quantity 
      + itemDetail.unit + '，单价：'
      + itemDetail.price.toFixed(2) +'(元)，小计：'
      + itemDetail.subtotalPrice.toFixed(2)+'(元)\n';
    }
    outputString += '----------------------\n';
    if(finalBill.promotionInfo){
        outputString += finalBill.promotionInfo.description+'：\n';
        for(let promotionInfoItemDetail of finalBill.promotionInfo.itemDetails){
            outputString += '名称：' 
            + promotionInfoItemDetail.name + '，数量：'
            + promotionInfoItemDetail.quantity 
            + promotionInfoItemDetail.unit + '\n';
        }
        outputString += '----------------------\n';
    }
    outputString += '总计：'+finalBill.totalPrice.toFixed(2)+'(元)\n';
    outputString += '节省：'+finalBill.discountedPrice.toFixed(2)+'(元)\n';
    outputString += '**********************';
    console.log(outputString)
  }
module.exports = {printInventory,formateInputs,buildOriginalBill,usePromotions,buildFinalBill,printBill};
