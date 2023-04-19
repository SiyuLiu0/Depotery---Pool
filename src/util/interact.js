const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const Web3 = require('web3');
//const web3 = new Web3("wss://polygon-mumbai.g.alchemy.com/v2/"+alchemyKey);
const web3 = new Web3("wss://polygon-mumbai.g.alchemy.com/v2/api-key");
//const contractABI = require("../UBCToken-abi.json");
const contractABI = require("../abi/MyToken.json")
//const contractAddress = "0xc30835bbb6EAA1bc90F2e12bd227fBA2B9d95635";
//const contractAddress = "0xB83798E0359EfaAfDabDBe46E2BC09Eab1d6147d";
//const contractAddress = "0xb72C6d9524C21AFdE652093AA4C46C1CBCdC7e29"
//const contractAddress = "0x69c1E8bCdc474D01FDDd5A9c333244A54fD24dF9" // correct one. TODO: bring back.
//const contractAddress = "0x4f4b3b6Ca225F5636E53C530ac7A43BEfC1795A2" // default percentage 90%.
//const contractAddress = "0x7738D97BB396D958919D85ec23F2addcf028f9e8" // bug fix for cancelling tickets after draw().
const contractAddress = "0xa7678C741341D62DE4Aaec4383AF33134b966554" // for Pool
//const contractAddress = "0x37EBA5f34Eb44CfFb6a255655b70a518a55d0cb6" // without price check.
// 0x4202B4d0A767bfd8FBD779Dd41387bC5338c7169

export const UBCTokenContract = new web3.eth.Contract(
	contractABI,
	contractAddress
);

export const loadTokenName = async () => {
	//const tokenName = await UBCTokenContract.methods.name().call();
	const tokenName = "Depottery";
	return tokenName;
};

export const loadTicketPrice = async () => {
	const tokenName = await UBCTokenContract.methods.getTicketPrice().call();
	return tokenName;
};

//###################################################
//##                 Pool                          ##
//###################################################
export const loadUserBalance = async (walletAddress) => {
	const userBalance = await UBCTokenContract.methods.getBalance().call({from: walletAddress});
	console.log("userBalance: " + userBalance);
	return userBalance;
};

export const loadUserInterest = async (walletAddress) => {
	const userInterest = await UBCTokenContract.methods.getUserInterestRate(walletAddress).call({from: walletAddress});
	console.log("userInterest: " + userInterest);
	return userInterest;
};

export const sendRegister = async (fromAddress, userName) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.register(userName).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, you will be registered successfully.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

// admin
export const loadPoolBalance = async () => {
	const poolBalance = await UBCTokenContract.methods.getBalance().call();
	return poolBalance;
};

// admin
export const loadPoolFunds = async () => {
	const poolBalance = await UBCTokenContract.methods.getFunds().call();
	return poolBalance;
};

// admin
export const load3rdRate = async () => {
	const thirdPartyRate = await UBCTokenContract.methods.getInterestRate().call();
	return thirdPartyRate;
};

// admin
export const loadAdminInvestedAmount = async () => {
	const adminInvestedAmount = await UBCTokenContract.methods.getInvestedAmount().call();
	return adminInvestedAmount;
};

export const sendChangeRate = async (fromAddress, rateByAdmin) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		//data: UBCTokenContract.methods.transfer(toAddress, value).encodeABI(),
		data: UBCTokenContract.methods.changeRate(rateByAdmin).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, the interest rate
					will be updated automatically.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendManuallyInvest = async (fromAddress, adminAmount) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		//data: UBCTokenContract.methods.transfer(toAddress, value).encodeABI(),
		data: UBCTokenContract.methods.manuallyInvest(adminAmount).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, admin will invest successfully.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendManuallyWithdraw = async (fromAddress, adminAmount) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		//data: UBCTokenContract.methods.transfer(toAddress, value).encodeABI(),
		data: UBCTokenContract.methods.manuallyWitdraw(adminAmount).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, admin will withdraw successfully.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendUserDeposit = async (fromAddress, userAmount2Deposit) => {
	console.log("User amount to deposit: " + userAmount2Deposit);
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		value:userAmount2Deposit,
		data: UBCTokenContract.methods.deposit().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, your will deposit successfully.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendUserWithdraw = async (fromAddress, userAmount2Withdraw) => {
	console.log("User amount to deposit: " + userAmount2Withdraw);
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		//value:userAmount2Withdraw,
		data: UBCTokenContract.methods.withdraw(userAmount2Withdraw).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, your will withdraw successfully.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				//status: "👆🏽 input the transfer to addresst in the text-field above.",
				status: "Connected.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
					address: addressArray[0],
					status: "👆🏽 input the transfer to addresst in the text-field above.",
				};
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};
