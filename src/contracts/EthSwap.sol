pragma solidity ^0.5.0;

import "./Token.sol";


/**
 * The
  EthSwap contract does this and that...
 */
contract EthSwap {
string public name="EthSwap Instance Exchange";
Token public token;
uint public rate = 100;

event Purchased(address account, address token, uint amount, uint rate);
event Sold(address account, address token, uint amount, uint rate);

  constructor(Token _token) public {
    token = _token;
  }
  function buytokens() public payable {
  	
  	uint tokenamount = msg.value*rate;
  	require(token.balanceOf(address(this))>=tokenamount);
  	token.transfer(msg.sender,tokenamount);
  	emit Purchased((msg.sender),address(token),tokenamount,rate);	
  }
  function selltoken (uint _amount) public payable {

  	require (_amount<=token.balanceOf(msg.sender));
  	
  	uint tokenamount= _amount/rate;
  	token.transferFrom(msg.sender,address(this),_amount);
  	msg.sender.transfer(tokenamount);
  	emit Sold((msg.sender),address(token),_amount,rate);
  }
  
  
}


