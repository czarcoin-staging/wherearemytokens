

# Where Are My Tokens?

by Faris Huskovic

Scripts designed to automate the investigation of failed token conversions. The scripts are written
in the Googlescript language. A Javascript variation used to interact with Google drive services.

# Prerequisites

In order to run the scripts, 

-You must be included as a member of the wherermytokens@storj.io inbox(not misspelled).

-You must get access to the "Where are my tokens" spreadsheet.

# How to run

Go to Tools/script-editor/{select correct script}

In the event the scripts have been removed from the spread sheet itself, copy and paste the source code 
from this repo to a new Code.gs file for the appropriate tab.

Press the "Play" Button and missing values will begin populating in the scripts corresponding sheet.

# Description of Scripts 

## 2.A.Contains both eth_tx_hash and conversion time

### Whats wrong: 

These are conversions logged as successful. They need to be double-checked as sometimes the converter can log failed transactions as successful.

### How does it solve this problem: 

It calls Ethplorers /getTXInfo/{TX hash} method and writes the success status
into 2A col L and if its failed and needs to be paid manually it will write "Y" or "N" values accordingly in
col M.

## 2.B.Missing eth_tx_hash

### Whats wrong: 

The eth addresses in this sheet either had STORJ sent to them successfully or unsuccessfully
and perhaps were never even sent any STORJ at all. We don't know because their is no ETH TX.

### How does it solve this problem: 

It calls Ethplorer's /getAddressHistory/{eth addh} method and filters the
results by the following criteria:

-Must be a STORJ token transaction(0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC)

-Must be an "inbound" transaction as we are only interested if they have "received" from us.

-Transaction must match the amount in the sheet that the converter recognized was deposited.

Once all of the above criteria is met, the following information is written to the following columns.

-Eth TX in Column J

-TX status in Column L

-"Y" or "N" in Column M depending on the TX status

## 2.C.No transactions associated with addresses

### Whats wrong: 

We only have a converter wallet addy and eth address to work with. No TX's were ever logged for 
any of these and therefore do not know which addresses successfully received SJCX. Because the converter
failed to recognize receiving any SJCX and logging the btc TX hash, it never sent out any STORJ to the 
corresponding Eth addy. Which is why an Eth TX was never logged.

### How does it solve this problem: 

Xchain's /getBalances/{addy} is called for each address and if a balance is 
present then calls Xchain's getSends/{addy} for the rest of values needed The following values are written to 
the following columns from the response.

-Wallet balance in column H

-TX hash for the deposit in column I

-Source address in column J

-"Y" or "N" in column K


## 1.New Inquiries

### Whats wrong: 

Columns A-D are populated from Typeform submission. They include the following data:

-Email

-Amount

-btc TX proving they deposited their SJCX successfully 

-Eth addy to send STORJ to if their inquiry proves valid.

These users claim they have not received their converted tokens yet.

### How does it solve this problem: 

The script searches all three data dump tabs simultaneously by row. When a match is
found, the following data is written to the following columns.

-"Y" or "N" in column E to specify whether the inquiry was found in any of the data dump tabs

-The tab in which the inquiry was found in column F

-Row number in column G

-Eth addy that payment was sent to in column H

-Eth tx status of that payment in column I

-"Y" if the addy we sent to matches the address they wanted their STORJ sent to or, it writes the address we
actually sent to if it does not match.

This is all the information we need to answer their request almost as soon as it comes in and the script is run.
The tab does not have to be full for the script to run. It can be run every time a new inquiry is added.

## License

This repository is licensed under an [AGPLv3](LICENSE) license. If you would like to submit PRs, we request that all of our contributors sign our [Contributor License Agreement (CLA)](https://docs.google.com/forms/d/e/1FAIpQLSdVzD5W8rx-J_jLaPuG31nbOzS8yhNIIu4yHvzonji6NeZ4ig/viewform) so that we can relicense the code under Apache v2, or other licenses in the future.

