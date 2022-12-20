// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Invoices{

    struct invoice{
        uint invoice_number;                // unique inoice number for each invoice
        string buyer_pan;
        string seller_pan;
        uint amount;
        string desc;                          // other 'invoice' data
        bool status;
        bool deleted;
        address creator;
    }

    uint count = 0;                             // to assign invoice number
    invoice[] invoices;

    function create_invoice(string memory _buyer_pan, string memory _seller_pan, uint _amount, string memory _desc) external{
        invoice memory temp;
        temp.invoice_number = count;
        temp.buyer_pan = _buyer_pan;
        temp.seller_pan = _seller_pan;
        temp.amount = _amount;
        temp.desc = _desc;
        temp.status = false;
        temp.deleted = false;
        temp.creator = msg.sender;
        invoices.push(temp);
        count++;
    }

    function delete_invoice(uint _index) external{ 
        require(invoices[_index].creator == msg.sender);
        require(invoices[_index].deleted != true);
        require(invoices[_index].status != true);
        invoices[_index].deleted = true;
    }

    function settle_invoice(uint _index) external payable{
        require(msg.value>=invoices[_index].amount);  
        require(invoices[_index].deleted == false);
        require(invoices[_index].status != true);
        require(invoices[_index].creator != msg.sender);
        invoices[_index].status = true;
        payable(invoices[_index].creator).transfer(msg.value);
    }

    function getinvoices() public view returns(invoice[] memory){
        return invoices;
    }

}