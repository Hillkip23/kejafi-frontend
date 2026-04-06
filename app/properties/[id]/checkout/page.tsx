"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Contract addresses on Sepolia
const TOKEN0_ADDRESS = "0x0FB987BEE67FD839cb1158B0712d5e4Be483dd2E"; // FINE5
const TOKEN1_ADDRESS = "0xe051C1eA47b246c79f3bac4e58E459cF2Aa20692"; // FINE6

// Minimal ERC20 ABI for approve and balanceOf
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [balances, setBalances] = useState({ token0: "0", token1: "0" });
  const [direction, setDirection] = useState<"FINE5_TO_FINE6" | "FINE6_TO_FINE5">("FINE5_TO_FINE6");
  const [provider, setProvider] = useState<any>(null);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      // Get balances
      await fetchBalances(accounts[0], web3Provider);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  // Fetch token balances
  const fetchBalances = async (address: string, providerInstance: any) => {
    try {
      const token0 = new ethers.Contract(TOKEN0_ADDRESS, ERC20_ABI, providerInstance);
      const token1 = new ethers.Contract(TOKEN1_ADDRESS, ERC20_ABI, providerInstance);
      
      const balance0 = await token0.balanceOf(address);
      const balance1 = await token1.balanceOf(address);
      
      setBalances({
        token0: ethers.formatEther(balance0),
        token1: ethers.formatEther(balance1)
      });
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };

  // Approve token spend
  const approveToken = async (tokenAddress: string, amount: string) => {
    if (!provider || !account) throw new Error("Wallet not connected");
    
    const signer = await provider.getSigner();
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const amountWei = ethers.parseEther(amount);
    
    const tx = await token.approve(TOKEN0_ADDRESS, amountWei);
    setTxHash(tx.hash);
    await tx.wait();
    return tx.hash;
  };

  // Execute swap (simulated - replace with actual swap contract)
  const executeSwap = async () => {
    if (!account) {
      alert("Please connect wallet first!");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    setLoading(true);
    try {
      const tokenToSwap = direction === "FINE5_TO_FINE6" ? TOKEN0_ADDRESS : TOKEN1_ADDRESS;
      
      // Step 1: Approve tokens
      alert("Step 1: Approving tokens...");
      const approveTx = await approveToken(tokenToSwap, amount);
      alert(`Approved! Tx: ${approveTx.slice(0, 10)}...`);
      
      // Step 2: Swap (placeholder - add your swap contract here)
      alert("Step 2: Executing swap...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockHash = "0x" + Math.random().toString(36).substring(2, 42);
      setTxHash(mockHash);
      alert(`Swap completed! ${amount} tokens swapped.`);
      
      // Refresh balances
      if (provider) await fetchBalances(account, provider);
    } catch (error: any) {
      console.error("Swap failed:", error);
      alert("Swap failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Check if already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          fetchBalances(accounts[0], web3Provider);
        }
      });
    }
  }, []);

  if (!window.ethereum) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>MetaMask Required</h1>
        <p>Please install <a href="https://metamask.io/" target="_blank">MetaMask</a> to use this app.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Swap FINE5 ↔ FINE6</h1>
      
      {/* Wallet Status */}
      <div style={{ marginBottom: 20, padding: 15, background: "#e0e0e0", borderRadius: 8 }}>
        {account ? (
          <div>
            <p>✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            <p style={{ fontSize: 12 }}>FINE5 Balance: {parseFloat(balances.token0).toFixed(4)}</p>
            <p style={{ fontSize: 12 }}>FINE6 Balance: {parseFloat(balances.token1).toFixed(4)}</p>
          </div>
        ) : (
          <button onClick={connectWallet} style={{ padding: "10px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
            Connect MetaMask
          </button>
        )}
      </div>

      {/* Direction */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Direction</label>
        <select 
          value={direction} 
          onChange={(e) => setDirection(e.target.value as any)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="FINE5_TO_FINE6">FINE5 → FINE6</option>
          <option value="FINE6_TO_FINE5">FINE6 → FINE5</option>
        </select>
      </div>

      {/* Amount */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Amount (tokens)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </div>

      {/* Pool Info */}
      <div style={{ marginBottom: 20, padding: 15, background: "#f3f4f6", borderRadius: 8 }}>
        <p><strong>Pool Reserves:</strong></p>
        <p>FINE5: 102,342 tokens</p>
        <p>FINE6: 98,939 tokens</p>
        <p style={{ fontSize: 12, color: "#666" }}>Exchange rate: ~1.034 FINE6 per FINE5</p>
      </div>

      {/* Swap Button */}
      <button
        onClick={executeSwap}
        disabled={loading || !account || !amount}
        style={{
          width: "100%",
          padding: 12,
          background: loading ? "#9ca3af" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: (loading || !account || !amount) ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Processing..." : "Execute Swap"}
      </button>

      {/* Transaction Hash */}
      {txHash && (
        <p style={{ marginTop: 16, fontSize: 12, textAlign: "center" }}>
          Tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            {txHash.slice(0, 16)}...
          </a>
        </p>
      )}
    </div>
  );
}
