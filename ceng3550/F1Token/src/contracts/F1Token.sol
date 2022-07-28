pragma solidity ^0.5.0;

import "./EIP20Interface.sol"; // ERC-20 standartlarını import ettim.

contract F1Token is EIP20Interface{

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    string public name;
    uint8 public decimals;
    string public symbol;

    constructor() public {
        balances[msg.sender] = 1000000; // kontrat oluşturulduğu gibi tüm tokenları oluşturucuya yolladım.
        totalSupply = 1000000; // toplam arz
        name = "F1Token"; // Ttken ismi
        decimals = 0; // token decimalini küsuratlarla uğraşmamak için 0 yaptım.
        symbol = "F1T"; // token sembolü

    }
    // contract sahibinin adresinden belirli bir adrese token transferi
    // eğer contract sahibinin bakiyesi gerekli koşulu sağlıyorsa, onun bakiyesinden değer düşülür ve hedef adresin bakiyesi artırılır.
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // belirli bir adresten diğerine token transferi
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    // contract sahibinin hesabında bulunan token sayısı
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    // contract sahibinin 3. parti bir dağıtıcı varsa, ona onay vermesi
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    // dağıtıcının contract sahibinden izin aldığı miktar
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
