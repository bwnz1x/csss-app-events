type CheckInPageProps = {
  computingId: string;
};

export default function CheckInPage({ computingId }: CheckInPageProps) {
  return (
    <>
      <h1>CSSS Events</h1>
      <p>Signed in as {computingId}</p>
      <h2>Forwarding to event check-in page</h2>
    </>
  );
}
