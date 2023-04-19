import React, {useEffect, useState } from "react";
import {
	UBCTokenContract,
	connectWallet,
  // Pool
  // admin
  sendChangeRate,
  sendManuallyInvest,
  sendManuallyWithdraw,
  loadPoolBalance,
  load3rdRate,
  loadAdminInvestedAmount,

  // user
  sendRegister,
  sendUserDeposit,
  sendUserWithdraw,
  loadUserBalance,
  loadUserInterest,
  loadPoolFunds,
} from "./util/interact.js";

import "./Deposit.css";

function AccountPage({userBalance, userInterest}) {
  console.log("AccountPage: userBalance:" + userBalance + ", userInterest: " + userInterest);
  return (
    <div className="page">
      <h2>User Account</h2>
      <p>Balance: {userBalance}</p>
      <p>Intereset: {userInterest}%</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page">
      <h2>Settings</h2>
      <p>TODO</p>
    </div>
  );
}

function DepositApp() {
  const [balance, setBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState("Account");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  // from tokenTransfer.js
  const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");

  // Pool
  // admin
  const [rateByAdmin, setRateByAdmin] = useState("");
  const [adminAmount, setAdminAmount] = useState("");
  const [poolBalance, setPoolBalance] = useState("");
  const [poolFunds,   setPoolFunds]   = useState("");
  const [thirdPartyRate, set3rdRate]  = useState("");
  const [adminInvestedAmount, setAdminInvestedAmount] = useState("");

  // user
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [userInterest, setUserInterest] = useState("");
	const [userAmount, setUserAmount] = useState("");

	const [tokenName, setTokenName] = useState("No connection to the network."); //default tokenName
	const [tokenBalance, settokenBalance] = useState(
		"No connection to the network."
	);

  async function fetchUserData(walletAddress) {
    const userBalance = await loadUserBalance(walletAddress);
    const userInterest = await loadUserInterest(walletAddress);
    console.log("user balance: " + userBalance + ", user interest: " + userInterest);
    setUserBalance(userBalance);
    setUserInterest(userInterest);
  }
  const handleMenuClick = async (page) => {
    setCurrentPage(page);
  };
  const handleUserDataClick = async (page, walletAddress) => {
    await fetchUserData(walletAddress);
    setCurrentPage(page);
  };

  const handleDeposit = () => {
    const amountNum = parseInt(amount);
    if (amountNum > 0) {
      setBalance(balance + amountNum); // Add the amount to balance
      setAmount(""); // Clear the input field
      setValidationError(""); // Clear the validation error
    } else {
      setValidationError("Please enter a valid amount."); // Show the validation error
    }
  };

  const handleWithdraw = () => {
    const amountNum = parseInt(amount);
    if (amountNum > 0 && balance >= amountNum) {
      setBalance(balance - amountNum); // Subtract the amount from balance
      setAmount(""); // Clear the input field
      setValidationError(""); // Clear the validation error
    } else {
      setValidationError("Please enter a valid amount."); // Show the validation error
    }
  };

  const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

  let pageContent;
  switch (currentPage) {
    case "Account":
      pageContent = <AccountPage userBalance={userBalance} userInterest={userInterest} />;
      break;
    case "Admin":
      pageContent = <AdminPage />;
      break;
    case "Settings":
      pageContent = <SettingsPage />;
      break;
  }

  useEffect(() => {
		async function fetchNewData() {
			//if (walletAddress !== "") {
			//	//const tokenBalance = await loadTokenAccountBalance(walletAddress);
			//	const tokenBalance = await loadTicketPrice();
			//	settokenBalance(tokenBalance);
			//}
			//const tokenName = await loadTokenName();
			//setTokenName(tokenName);
			//const { address, status } = await getCurrentWalletConnected();
			//setWallet(address);
			//setStatus(status);
			//addWalletListener();
			//addSmartContractListener();
			//const newPrice = await loadTicketPrice();
			//setTicketPrice(newPrice);
      //TODO: bring back? handleTicketPriceClick("Game Data");
		}
		fetchNewData();
	//}, [ticketPrice]);
	}, [status]);

  const clickSetRate = async (rateByAdmin) => {
    const {status} = await sendChangeRate(walletAddress, rateByAdmin);
    setStatus(status);
    console.log("set interest rate by Admin status: " + status);
	};

  const clickAdminInvest = async () => {
    const {status} = await sendManuallyInvest(adminAmount);
    setStatus(status);
    console.log("Admin invest status: " + status);
	};

  const clickAdminWithdraw = async () => {
    const {status} = await sendManuallyWithdraw(adminAmount);
    setStatus(status);
    console.log("Admin withdraw status: " + status);
	};

  async function clickLoadPoolBalance() {
    const tempPoolBalance = await loadPoolBalance();
    console.log("now in clickLoadPoolBalance() function.");
    console.log("Pool balance is " + tempPoolBalance);
    setPoolBalance(tempPoolBalance);
  }

  async function clickLoadPoolFunds() {
    const tempPoolFunds = await loadPoolFunds();
    console.log("now in clickLoadPoolFunds() function.");
    console.log("Pool balance is " + tempPoolFunds);
    setPoolFunds(tempPoolFunds);
  }

  async function clickLoad3rdRate() {
    const temp3rdRate = await load3rdRate();
    console.log("now in clickLoad3rdRate() function.");
    console.log("3rd party rate is " + temp3rdRate);
    set3rdRate(temp3rdRate);
  }

  async function clickLoadAdminInvestedAmount() {
    const tempAdminInvestedAmount = await loadAdminInvestedAmount();
    setAdminInvestedAmount(tempAdminInvestedAmount);
  }

  const clickUserDeposit = async (userAmount) => {
    console.log("user input amount to deposit: " + userAmount);
    const {status} = await sendUserDeposit(walletAddress, userAmount);
    setStatus(status);
	};

  const clickUserWithdraw = async (userAmount) => {
    const {status} = await sendUserWithdraw(walletAddress, userAmount);
    setStatus(status);
	};

  const clickRegister = async (userName) => {
    const {status} = await sendRegister(walletAddress, userName);
    setStatus(status);
	};

  function AdminPage() {
    return (
      <div className="body">
				  <my_button id="publish" onClick={() => clickSetRate(rateByAdmin)}>
				  	Set Interest Rate
				  </my_button>

				  <my_button id="publish" onClick={() => clickAdminInvest()}>
				  	Admin Invest
				  </my_button>

				  <my_button id="publish" onClick={() => clickAdminWithdraw()}>
				  	Admin Withdraw
				  </my_button>

				  <my_button id="publish" onClick={() => clickLoadPoolBalance()}>
				  	Pool Balance (including interests)
				  </my_button>
				  <p id="pool balance">{poolBalance}</p>

				  <my_button id="publish" onClick={() => clickLoadPoolFunds()}>
				  	Pool Balance (without interests)
				  </my_button>
				  <p id="pool funds">{poolFunds}</p>

				  <my_button id="publish" onClick={() => clickLoad3rdRate()}>
				  	3rd Party Rate
				  </my_button>
				  <p id="3rd party rate ">{thirdPartyRate}</p>

				  <my_button id="publish" onClick={() => clickLoadAdminInvestedAmount()}>
				  	Invested Amount
				  </my_button>
				  <p id="admin invested amount">{adminInvestedAmount}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="menu">
        <h1>DepositApp</h1>

          <input
				  	type="text"
            id="interest rate id"
				  	placeholder="new interest rate:"
				  	onChange={(e) => setRateByAdmin(e.target.value)}
				  />

          <input
				  	type="text"
            id="Admin Amount"
				  	placeholder="Admin Amount to Deposit/Withdraw from third-party Pool:"
				  	onChange={(e) => setAdminAmount(e.target.value)}
				  />

        <ul>
          <li onClick={() => handleMenuClick("Admin")}>Admin</li>
          <li
            className={currentPage === "Account" ? "active" : null}
            onClick={() => handleUserDataClick("Account", walletAddress)}
          >
            User Account
          </li>
        </ul>
        <div className="form-container">
          <label htmlFor="number-input">Amount to deposit/withdraw:</label>
          <input type="text" 
                 id="number-input"
                 placeholder="the minimum amount is larger than 0:"
                 onChange={(e) => setUserAmount(e.target.value)}
          />
          <button onClick={() => clickUserDeposit(userAmount)}>User Deposit</button>
          <button onClick={() => clickUserWithdraw(userAmount)}>User Withdraw</button>

          <label htmlFor="number-input">User name to register:</label>
          <input type="text" 
                 id="number-input"
                 placeholder="register if you do not have a user name:"
                 onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={() => clickRegister(userName)}>Register</button>

			  <button id="walletButton" onClick={connectWalletPressed}>
			  	{walletAddress.length > 0 ? (
			  		"Connected: " +
			  		String(walletAddress).substring(0, 6) +
			  		"..." +
			  		String(walletAddress).substring(38)
			  	) : (
			  		<span>Connect Wallet</span>
			  	)}
			  </button>


				<p id="status">{status}</p>
        </div>
      </div>
      <div style={{ width: '80%' }}>{pageContent}</div>
    </div>
  );
}

export default DepositApp;
