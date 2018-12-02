pragma solidity ^0.5.1;

contract Trucking {
    
    // Trucking Imformation
    struct Delivery {
        address company_wallet;
        uint256 driver_wallet;
        
        uint256 coost;
        
        uint256 deadline;
        
        uint256 auth_number;
        
        uint256 status;
    }
    
    mapping (uint256 => Delivery) deliverys;
    
    struct Driver {
        uint256 Deposit;
    }
    
    mapping (address => Driver) drivers;
    
    function newDelivery(uint256 DeliveryId, address _Company_Wallet, uint256 _Deposit, uint256 _Driver_Wallet, uint256 _Deadline) returns (uint256 m) {
        deliverys[DeliveryId] = Delivery(_Company_Wallet, _Deposit, _Driver_Wallet, _Deadline, 0, 0);
        m = DeliveryId;
    }
    
    function Delivery_Status(uint256 DeliveryId) returns (address _Company_Wallet, uint256 _Deposit, uint256 _Driver_Wallet, uint256 _Deadline, uint256 _Result) {
        Delivery d = deliverys[DeliveryId];
        
        _Company_Wallet = d.Company_Wallet
        _Deposit = d.Deposit
        _Driver_Wallet = d.Driver_Wallet
        _Deadline = d.Deadline
        _Result = d.Result
    }
    
    function Delivery_Choice(uint256 DeliveryId) returns (address _Company_Wallet, uint256 _Deposit, uint256 _Driver_Wallet, uint256 _Deadline, uint256 _Result) {
        Delivery d = deliverys[DeliveryId];
        drivers[msg.sender] = Driver(d.Company_Wallet, d.Deposit, 1);
    }
    
    
    function withdraw(uint256 DeliveryId) onlyOwner public {
        Delivery d = deliverys[DeliveryId];
        
        require(now >= Deadline);
        require(d.Company_Wallet == msg.sender);
        msg.sender.transfer(this.balance);
        Withdrew(msg.sender, this.balance);
        
        d.Result = 2;
    }