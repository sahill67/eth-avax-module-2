import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [pin, setPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [correctPin, setCorrectPin] = useState("1234"); 
  const [accountHolderName, setAccountHolderName] = useState("Mohammed Saheel");
  const [age, setAge] = useState(20);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts[0]);

    // once the wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(10); // Deposit 10 ETH
      await tx.wait();
      getBalance();
      showAlert("Transaction successful! Deposited 10 ETH.");
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(10); // Withdraw 10 ETH
      await tx.wait();
      getBalance();
      showAlert("Transaction successful! Withdrawn 10 ETH.");
    }
  };

  const showAlert = (message) => {
    alert(message);
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handleOldPinChange = (e) => {
    setOldPin(e.target.value);
  };

  const handleNewPinChange = (e) => {
    setNewPin(e.target.value);
  };

  const validatePin = () => {
    return pin === correctPin;
  };

  const changePin = async () => {
    if (oldPin === correctPin) {
      // Update the PIN
      await atm.changePin(newPin);
      setCorrectPin(newPin);
      showAlert("PIN changed successfully!");
      setOldPin("");
      setNewPin("");
    } else {
      showAlert("Incorrect old PIN. PIN change failed.");
    }
  };

  const performTransaction = async (transactionFunction, successMessage) => {
    if (validatePin()) {
      await transactionFunction();
      showAlert(successMessage);
    } else {
      showAlert("Incorrect PIN. Transaction failed.");
    }
  };

  const initUser = () => {
    // Check to see if the user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Account Holder: {accountHolderName}</p>
        <p>Age: {age}</p>
        <p>Your Balance: {balance}</p>
        <input type="password" placeholder="Enter PIN" value={pin} onChange={handlePinChange} />
        <button onClick={() => performTransaction(deposit, "Transaction successful! Deposited 10 ETH.")}>
          Deposit 10 ETH
        </button>
        <button onClick={() => performTransaction(withdraw, "Transaction successful! Withdrawn 10 ETH.")}>
          Withdraw 10 ETH
        </button>
      </div>
    );
  };

  const changePinSection = () => {
    return (
      <div>
        <h2>Change PIN</h2>
        <input type="password" placeholder="Enter Old PIN" value={oldPin} onChange={handleOldPinChange} />
        <input type="password" placeholder="Enter New PIN" value={newPin} onChange={handleNewPinChange} />
        <button onClick={changePin}>Change PIN</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <div className="content">
        {initUser()}
        {changePinSection()}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          background-color: red;
          color: white;
        }

        .content {
          display: flex;
          justify-content: space-between;
          padding: 20px;
        }
      `}</style>
    </main>
  );
}
