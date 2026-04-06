"use client";
import { useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CheckoutPage({ params }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Unwrap params if needed
  // const { id } = await params;
  
  const handleSwap = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    alert("Swap completed!");
    setLoading(false);
  };
  
  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h1>Swap FINE5 ↔ FINE6</h1>
      <button onClick={handleSwap} disabled={loading}>
        {loading ? "Processing..." : "Swap"}
      </button>
    </div>
  );
}
