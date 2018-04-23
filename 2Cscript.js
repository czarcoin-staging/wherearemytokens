/*****************************************Script by Faris Huskovic**************************************************

The purpose of this script is to check converter wallet balances to see if they received any SJCX. If
they did we need to know how much and the source addy they came from.

Because the converter failed to log the TX successfully and recognize that it did
receive a deposit, it never "received the signal" to send the equivalent STORJ amount
to the logged Eth addy.

In the case a depost was received, we have to send it to its corresponding Eth addy.

********************************************************************************************************************/

function investigate2C() {
  
    var app= SpreadsheetApp;
    var whereAreMyTokens = app.getActiveSpreadsheet();
    var tab = whereAreMyTokens.getSheetByName('2.C.No transactions associated with addresses');
    var row =2;
    var i=0;
    
    //loop through 2C and pass each index of converter wallet addys to xchains get balances call
    for(i;i<tab.getLastRow()+1;i++){
    
    var converterAddy = tab.getRange(2+i,7).getValue();
    var getBalancesUrl='https://www.xchain.io/api/balances/'+converterAddy;
    var getBalances= UrlFetchApp.fetch(getBalancesUrl);
    var content = getBalances.getContentText();
    var obj = JSON.parse(content);
    var balInfo= obj.data;
    var walletBalanceCol=tab.getRange(row+i,8);
    var inboundTxCol=tab.getRange(row+i, 9);
    var sourceCol=tab.getRange(row+i,10);
    var payoutEligibilityCol=tab.getRange(row+i,11);
     
    /*
    If the tokens are not there, we never received them.
    */
      if(balInfo.length ==0 ){
        
      walletBalanceCol.setValue("No SJCX received");
      inboundTxCol.setValue("No transaction found");
      sourceCol.setValue("No source");
      payoutEligibilityCol.setValue("N");
        
              }else{
    //if there is a balance we record how much, where it came from, and the TX hash proving the deposit
         var sjcxReceived = balInfo[0].quantity;
         Logger.log("\n"+converterAddy+ ':' +sjcxReceived);
         var getSendsUrl='https://www.xchain.io/api/sends/'+converterAddy;
         var getSends= UrlFetchApp.fetch(getSendsUrl);
         var data = getSends.getContentText();
         var resp= JSON.parse(data)
         var from = resp.data[0].source;
         var txHash= resp.data[0].tx_hash; 
          
         walletBalanceCol.setValue(sjcxReceived);
         inboundTxCol.setValue(txHash);
         sourceCol.setValue(from);
         payoutEligibilityCol.setValue("Y");
                
    }
      Utilities.sleep(250);
  }
  }