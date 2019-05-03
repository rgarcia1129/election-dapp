pragma solidity 0.5.0;

contract Election {

  //Model candidate
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  //store voters
  mapping(address => bool) public voters;
  //store candidate
  mapping(uint => Candidate) public candidates;

  uint public candidatesCount;

  constructor() public {
    candidatesCount = 0;
    addCandidate("Joe Biden");
    addCandidate("Beto ORourke");
    addCandidate("Bernie Sanders");
    addCandidate("Pete Buttigieg");
    addCandidate("Cory Booker");
    addCandidate("Kirsten Gillibrand");
    addCandidate("Kamala Harris");
  }

  function addCandidate(string memory _name) private {
    candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    candidatesCount++;
  }

  function vote(uint _candidateId) public {
    voters[msg.sender] = true;

    candidates[_candidateId].voteCount++;
  }
}
