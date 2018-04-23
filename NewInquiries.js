/*****************************************Script by Faris Huskovic**************************************************

The purpose of this script is to take the Typeform collected inquiry data and find find all missing pieces of 
information needed to completely understand the status of the inquiry received.

NOTES:

"data dump tabs" will be used in comments frequently. This term refers to tabs 
-2.A Contains both eth_tx_hash and conversion time
-2.B.Missing eth_tx_hash
-2.C.No transactions associated with addresses

Columns A-D in the sheet called '1.New Inquiries' have been populated via Typeform Submission.
********************************************************************************************************************/


function categorizeNewInquiries(){
 
    var app= SpreadsheetApp;
    var whereAreMyTokens = app.getActiveSpreadsheet();
    //Hold all tabs with in a variable
    var newInquiries= whereAreMyTokens.getSheetByName('1.New Inquiries');
    var Atab = whereAreMyTokens.getSheetByName('2.A Contains both eth_tx_hash and conversion time');
    var Btab = whereAreMyTokens.getSheetByName('2.B.Missing eth_tx_hash');
    var Ctab = whereAreMyTokens.getSheetByName('2.C.No transactions associated with addresses');
    
    //find the last row that has data in the New Inquiries sheet
    
    var inquerieslastRow=newInquiries.getLastRow();
    
    //Counter variable designated for the New Inquiries Sheet
    
    var newInqRowCounter=2;
    
    //For loop to parse all sheets for data 
    //the row counter variable is siginficant only to tabs 2A,2B,and 2C
    
        for(var row=2; row<10000;row++){
     
    /*
    Get the btc TX that is supposed to prove the user deposited to the 
    converter successfully and search 2A,2B,and 2C for it.
          */
    var depositTX=newInquiries.getRange(newInqRowCounter,3).getValue();
    Logger.log('deptx'+depositTX);
  
    //BTC TXs are held in column I(9th column) in each data dump tab
    
    var txFromA=Atab.getRange(row,9).getValue();
          Logger.log('txfrom A: '+txFromA);
    var txFromB=Btab.getRange(row,9).getValue();
          Logger.log('tx from B: '+txFromB);
    var txFromC=Ctab.getRange(row,9).getValue();
          Logger.log('tx from C: '+txFromC);
    
    
           
  //Below are the variables that reference the cells in which answers will be written to 
         
    var foundInDdCol=newInquiries.getRange(newInqRowCounter,5);
    var tabFoundCol=newInquiries.getRange(newInqRowCounter,6);
    var rowCol=newInquiries.getRange(newInqRowCounter,7);
    var outBoundEthTXCol=newInquiries.getRange(newInqRowCounter,8);
    var statusCol=newInquiries.getRange(newInqRowCounter,9);
    var sentToRightAddyCol=newInquiries.getRange(newInqRowCounter,10);
    
  /*
   Each data dump tab has its own "if" statement. Each "if" statement runs through the 
   entire row the deposit Tx hash match was located in and, writes the other necessary column
   answers to their respective positions in the New Inquiries Sheet.  
  */
      if(depositTX==txFromA){
        
        foundInDdCol.setValue('Y');
        tabFoundCol.setValue('2A');
        rowCol.setValue('Row: '+ row);
        //2A tab will always have a tx hash
        var ethTXfromA=Atab.getRange(row,10).getValue();
        outBoundEthTXCol.setValue(ethTXfromA);
        var statusFromA=Atab.getRange(row,12).getValue();
        statusCol.setValue(statusFromA);
        /*Compare eth addy they wanted the tokens sent to with the one we 
        actually sent it to. The same is done for the other two "if" statements
        */
        var ethAddyFromTypeform=newInquiries.getRange(newInqRowCounter,4).getValue();
        var ethAddyFrom2A=Atab.getRange(row,8).getValue();
        if(ethAddyFromTypeform==ethAddyFrom2A){
        sentToRightAddyCol.setValue('Y');
        }else{
          sentToRightAddyCol.setValue(ethAddyFrom2A);
             }
        /*
        we increment newInqRowCounter by one whenever a match is found so we 
        can move to the next row in the New Inquiries sheet.
        Same is done for the other two data dump loops.
        */
        newInqRowCounter++;
        /*
        row is restarted back at one so we can start searching all rows in all sheets 
        again for the next inquiry. Same is done for the other two data dump loops.
        */
        row=1;
      }else if(depositTX==txFromB){
        foundInDdCol.setValue('Y');
        tabFoundCol.setValue('2B');
        rowCol.setValue('Row: '+ row);
        //2B may not always have a tx hash
        var ethTXfromB=Btab.getRange(row,10).getValue();
        outBoundEthTXCol.setValue(ethTXfromB);
        var statusFromB=Btab.getRange(row,12).getValue();
        statusCol.setValue(statusFromB);
        var ethAddyFromTypeform=newInquiries.getRange(newInqRowCounter,4).getValue();
        var ethAddyFrom2B=Btab.getRange(row,8).getValue();
        if(ethAddyFromTypeform==ethAddyFrom2B){
          sentToRightAddyCol.setValue('Y');
        }else{
          sentToRightAddyCol.setValue(ethAddyFrom2B);
             }
        newInqRowCounter++;
        row=1;
      }else if(depositTX==txFromC){
        foundInDdCol.setValue('Y');
        tabFoundCol.setValue('2C');
        rowCol.setValue('Row: '+ row);
        //Will never have a eth tx as this tab never successfully logged deposits to begin with.
        outBoundEthTXCol.setValue('Attempt to send never made');
        //"amount that needs to be sent" is based on proven balance inside the converter addy
        var successfullyDepositedConverterAmount=Ctab.getRange(row,8).getValue();
        statusCol.setValue(successfullyDepositedConverterAmount + ' needs to be sent');
        //Never sent STORJ to an eth addys for 2C so we can just log out accordingly
        sentToRightAddyCol.setValue('Never sent any tokens to them');
        newInqRowCounter++;
        row=1;
      }
          /*
          inqueriesLastRow returns last row WITH data so adding one will break the loop it at 
          the first empty row
          */
          if(newInqRowCounter==inquerieslastRow+1){
            break;
    }
   }
  }
  