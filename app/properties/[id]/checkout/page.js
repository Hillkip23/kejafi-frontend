"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSwap = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    alert(`Swapped ${amount} tokens!`);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h1>Swap FINE5 ↔ FINE6</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{ width: "100%", padding: 8, margin: "10px 0" }}
      />
      <button onClick={handleSwap} disabled={loading}>
        {loading ? "Processing..." : "Swap"}
      </button>
    </div>
  );
}
