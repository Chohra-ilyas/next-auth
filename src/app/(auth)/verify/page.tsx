interface VerifyPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

const VerifyPage = async ({ searchParams }: VerifyPageProps) => {
  const currentSearchParams = await searchParams;
  console.log(currentSearchParams);
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Your Email Has Been Verified</h1>
      <p className="mt-4">Thank you for verifying your email address.</p>
    </div>
  );
};

export default VerifyPage;
