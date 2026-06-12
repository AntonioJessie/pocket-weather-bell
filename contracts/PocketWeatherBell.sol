// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PocketWeatherBell {
    mapping(address => uint256) public userSunnies;
    mapping(address => uint256) public userRainies;
    mapping(address => uint256) public userWindies;

    uint256 public totalSunnies;
    uint256 public totalRainies;
    uint256 public totalWindies;

    event SunnyRung(address indexed user, uint256 userSunnies, uint256 totalSunnies);
    event RainyRung(address indexed user, uint256 userRainies, uint256 totalRainies);
    event WindyRung(address indexed user, uint256 userWindies, uint256 totalWindies);

    function ringSunny() external {
        unchecked {
            userSunnies[msg.sender] += 1;
            totalSunnies += 1;
        }
        emit SunnyRung(msg.sender, userSunnies[msg.sender], totalSunnies);
    }

    function ringRainy() external {
        unchecked {
            userRainies[msg.sender] += 1;
            totalRainies += 1;
        }
        emit RainyRung(msg.sender, userRainies[msg.sender], totalRainies);
    }

    function ringWindy() external {
        unchecked {
            userWindies[msg.sender] += 1;
            totalWindies += 1;
        }
        emit WindyRung(msg.sender, userWindies[msg.sender], totalWindies);
    }
}
