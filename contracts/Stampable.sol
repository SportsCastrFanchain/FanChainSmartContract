pragma solidity ^0.4.21;

import "./ERC20.sol";
import "./SafeMath.sol";

contract Stampable is ERC20 {
    using SafeMath for uint256;

    // A struct that represents a particular token balance
    struct TokenBalance {
        uint256 amount;
        uint index;
    }

    // A struct that represents a particular address balance
    struct AddressBalance {
        mapping (uint256 => TokenBalance) tokens;
        uint256[] tokenIndex;
    }

    // A mapping of address to balances
    mapping (address => AddressBalance) balances;

    // The total number of tokens owned per address
    mapping (address => uint256) ownershipCount;

    // Whitelist for addresses allowed to stamp tokens
    mapping (address => bool) public stampingWhitelist;

    /**
    * Modifier for only whitelisted addresses
    */
    modifier onlyStampingWhitelisted() {
        require(stampingWhitelist[msg.sender]);
        _;
    }

    // Event for token stamping
    event TokenStamp (address indexed from, uint256 tokenStamped, uint256 stamp, uint256 amt);

    /**
    * @dev Function to stamp a token
    * @param _owner address The owner of the tokens being stamped
    * @param _tokenToStamp uint256 The tokenId of theirs to stamp (0 for unstamped tokens)
    * @param _stamp uint256 The new stamp to apply
    * @param _amt uint256 The quantity of tokens to stamp
    */
    function stampToken (address _owner, uint256 _tokenToStamp, uint256 _stamp, uint256 _amt)
        onlyStampingWhitelisted
        public returns (bool) {
        require(_amt <= balances[_owner].tokens[_tokenToStamp].amount);

        // Subtract balance of 0th token ID _amt value.
        removeToken(_owner, _tokenToStamp, _amt);

        // "Stamp" the token
        addToken(_owner, _stamp, _amt);

        // Emit the stamping event
        emit TokenStamp(_owner, _tokenToStamp, _stamp, _amt);

        return true;
    }

    function addToken(address _owner, uint256 _token, uint256 _amount) internal {
        // If they don't yet have any, assign this token an index
        if (balances[_owner].tokens[_token].amount == 0) {
            balances[_owner].tokens[_token].index = balances[_owner].tokenIndex.push(_token) - 1;
        }
        
        // Increase their balance of said token
        balances[_owner].tokens[_token].amount = balances[_owner].tokens[_token].amount.add(_amount);
        
        // Increase their ownership count
        ownershipCount[_owner] = ownershipCount[_owner].add(_amount);
    }

    function removeToken(address _owner, uint256 _token, uint256 _amount) internal {
        // Decrease their ownership count
        ownershipCount[_owner] = ownershipCount[_owner].sub(_amount);

        // Decrease their balance of the token
        balances[_owner].tokens[_token].amount = balances[_owner].tokens[_token].amount.sub(_amount);

        // If they don't have any left, remove it
        if (balances[_owner].tokens[_token].amount == 0) {
            uint index = balances[_owner].tokens[_token].index;
            uint256 lastCoin = balances[_owner].tokenIndex[balances[_owner].tokenIndex.length - 1];
            balances[_owner].tokenIndex[index] = lastCoin;
            balances[_owner].tokens[lastCoin].index = index;
            balances[_owner].tokenIndex.length--;
            // Make sure the user's token is removed
            delete balances[_owner].tokens[_token];
        }
    }
}