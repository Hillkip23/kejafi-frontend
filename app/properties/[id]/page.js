import Link from "next/link";

export default async function PropertyPage({ params }) {
  const { id } = await params;
  return (
    <div style={{ padding: 20 }}>
      <h1>Property: {id}</h1>
      <Link href={`/properties/${id}/checkout`}>Buy Tokens</Link>
    </div>
  );
}
