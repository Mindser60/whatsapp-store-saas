"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div style={{padding:40}}>
      <h1>Plan Premium</h1>

      <p>Débloquez toutes les fonctionnalités de votre boutique WhatsApp.</p>

      <h2>Prix : 49$ paiement unique</h2>

      <button
        style={{
          padding:15,
          background:"green",
          color:"white",
          border:"none",
          borderRadius:8,
          cursor:"pointer"
        }}
        onClick={()=>{
          localStorage.setItem("premium","true");
          window.location.href="/dashboard/premium";
        }}
      >
        Activer Premium
      </button>

      <br/><br/>

      <Link href="/dashboard">
        Retour dashboard
      </Link>
    </div>
  );
}