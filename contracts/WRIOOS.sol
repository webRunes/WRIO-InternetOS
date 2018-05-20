pragma solidity ^0.4.23;

contract WRIOOS {
    mapping (address => string) public profile_url;
    mapping (address => uint) public crd;

    function send_crd(address receiver, uint amount) public {
        crd[receiver] += amount;
    }

    function set_profile_url(address receiver, string url) public {
        profile_url[receiver] = url;
    }

    function get_profile_url(address receiver) public view returns (string url) {
        return profile_url[receiver];
    }

    function balance_crd(address user) public view returns (uint balance) {
        return crd[user];
    }
}
