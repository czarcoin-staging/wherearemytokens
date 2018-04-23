/*****************************************Script by Faris Huskovic**************************************************

The purpose of this script is to double check the TX status'es of the Eth TX's the converter
has logged as "successful". This script was necessary to create as we found EthTX's the converter 
logged as "successful" that we're not actually successful when confirming with ethplorer and etherscan.

********************************************************************************************************************/

function investigate2A() {
  

    var app= SpreadsheetApp;
    var whereAreMyTokens = app.getActiveSpreadsheet();
    var twoATab = whereAreMyTokens.getSheetByName('2.A Contains both eth_tx_hash and conversion time');
    var apiKey='HBFUTQEEDUDP2E5MMUSMIU5TY2W7Z7B2MV';
    var successStatus="Successful";
    var failStatus="Bad Jump Destination Error";
    
    //loop through each row passing the ethTX into the call
    for(var row=2; row<twoATab.getLastRow()+1; row++){
      
      var ethTX =twoATab.getRange(row,10).getValue().toString();
      var status = twoATab.getRange(row, 12);
      var sendManually = twoATab.getRange(row, 13);
      ///https://api.ethplorer.io/getTxInfo/{transaction hash}
      var url='https://api.ethplorer.io/getTxInfo/'+ethTX+'?apiKey=freekey' ;
      var getTxStatus=UrlFetchApp.fetch(url);
      var content=getTxStatus.getContentText();
      var obj=JSON.parse(content);
      var errorCode= obj.success;  
      Logger.log(obj);
      //"0" is the error code returned if the transaction was successful
      //"1" is the error code returned if a "bad jump destination error" is detected
       if(errorCode == true){
              status.setValue(successStatus);
              sendManually.setValue('N');
      }else if(errorCode == false){
              status.setValue(failStatus);
              sendManually.setValue('Y');
      }else{
              status.setValue('undefined');
              sendManually.setValue('undefined');
      }
    
      Utilities.sleep(250); 
        }
        }
   