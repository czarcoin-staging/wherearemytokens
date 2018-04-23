/*****************************************Script by Faris Huskovic**************************************************

The purpose of this script is to check if we sent STORJ to each of the addys because the converter failed
to log an Eth TX for them.

First the script will return the transaction history for each addy by the following criteria
-Must be a STORJ transaction
-The address must be "receiving" the STORJ as opposed to "sending".
-The amount of the STORJ transferred must be equal to the amount we're looking for.

The TX that meets all the above criteria is recorded as well as its transactions success status.

********************************************************************************************************************/

function investigate2B(){
  
    var app= SpreadsheetApp;
    var whereAreMyTokens = app.getActiveSpreadsheet();
    var twoBTab = whereAreMyTokens.getSheetByName('2.B.Missing eth_tx_hash');
  
    //relevant rows start at "2" but "i" is the counter variable for the main loop
    var row =2;
    var i=0;
     /*
     each hold the cell value of their named columns and are able to be 
    incremented by to go through each row.
    */
    var addy = twoBTab.getRange(2+i,8).getValue();
    var amount = twoBTab.getRange(2+i,11).getValue();
    /*
    Used to move the decimal place to the end. Ethplorer returns amounts with no decimals
    so in doing this, we can better compare for equality.
    */
    var decimalMover=100000000;
    var successStatus = "Successful";
    var failStatus = "Bad Jump Destination Error";
    //Storj contract address is necesssary to only return STORJ transactions for each Eth Addy
    const tokenType='0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC';
  
    //loop through each row in the 2Bsheet.
    
    for(i; i<twoBTab.getLastRow();i++){
      
      var addy = twoBTab.getRange(2+i,8).getValue();
      var amount = twoBTab.getRange(2+i,11).getValue();
      
      //ethplorer returns letters as lowercase so to match from the sheet we call the lowercase function.
      var ethAddyToPass= addy.toLowerCase();
      /*
      Decimal is moved back and we remove the last two digits to get rid of rounded numbers that could
      throw the script off when it attempts to compare for equality.
        */
      var amountToPass= (amount*decimalMover).toFixed(0).slice(0,6);
      //Stop looping when an empty row is reached.
      if(ethAddyToPass==""){
        break;
      }
    //call ethplorer and pass the eth addy and Storj token contract addy
      var getAddressHistoryURL = 'https://api.ethplorer.io/getAddressHistory/'+ethAddyToPass+'?apiKey=freekey&token='+ tokenType +'&type=transfer';
      var getAddressHistory= UrlFetchApp.fetch(getAddressHistoryURL);
      var content= getAddressHistory.getContentText();
      var obj =JSON.parse(content);
   
      
      /*for each response capture the missing information from 2B
      (destination,TX,value,and status key/value pairs)
      and write the results to their correct columns accordingly;
      */
      for(var n=0; n<obj.operations.length; n++){
        
      var destination=obj.operations[n].to.toLowerCase();
      var txToPass= obj.operations[n].transactionHash;
      var transAmount = (obj.operations[n].value).slice(0,6);
      var getTransStatus = 'https://api.ethplorer.io/getTxInfo/'+txToPass+'?apiKey=freekey'; 
      var ethTxCol= twoBTab.getRange(row+i,10);
      var statusCol= twoBTab.getRange(row+i,12);
      var sendStorjManuallyCol= twoBTab.getRange(row+i,13);
      
        /* 
        Only return Transactions that went TO the users eth addy and ONLY IF the amount
        for that transaction is equal to what we have in the sheet.
        */
        if(destination==ethAddyToPass && amountToPass==transAmount){
          
      var getTransStatusURL='https://api.ethplorer.io/getTxInfo/'+txToPass+'?apiKey=freekey';
      var getTransStatus= UrlFetchApp.fetch(getTransStatusURL);
      var res= JSON.parse(getTransStatus.getContentText());
      var stat=res.success;
      var successStatus = "Successful";
      var failStatus="Bad Jump Destination Error";
      //if the amount and address match, check the TX status and record it accordingly
      if(stat==true){
        Logger.log(successStatus);
        ethTxCol.setValue(txToPass);
        statusCol.setValue(successStatus);
        sendStorjManuallyCol.setValue('N');
      }else if(stat==false){
        Logger.log(failStatus);
        ethTxCol.setValue(txToPass);
        statusCol.setValue(failStatus);
        sendStorjManuallyCol.setValue('Y');
      }  
          break;
          /*
          If you get to the end of the object array in each call than it means that we 
          never sent them any STORJ for the amount specified.
          */
        }else if(n==obj.operations.length-1){
          ethTxCol.setValue('No TX of that amount exists in addy history');
          statusCol.setValue('We never sent tokens');
          sendStorjManuallyCol.setValue('Y');
        }
        }
      //rate-throttling set at 4 requests/s
      Utilities.sleep(250);
  }
  }