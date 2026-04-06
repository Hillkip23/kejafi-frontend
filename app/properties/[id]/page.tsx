import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <h1>Property: {id}</h1>
      <Link href={`/properties/${id}/checkout`}>Buy Tokens</Link>
    </div>
  );
}
