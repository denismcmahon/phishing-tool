export default function Phished() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800'>
      <h1 className='text-3xl font-bold mb-4'>⚠️ Phishing Simulation</h1>
      <p className='max-w-lg text-center'>
        You clicked on a simulated phishing link. In a real-world scenario, this
        could have exposed your personal or company data.
      </p>
      <p className='mt-4 font-medium'>
        Remember: Always verify the sender and links before clicking.
      </p>
    </div>
  );
}
