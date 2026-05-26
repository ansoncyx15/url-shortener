import SignUpForm from "@/app/sign-up/_ui/SignUpForm";

export default function Page() {
  return (
    <div className="mx-auto min-h-full max-w-md bg-[#f5f3ec] p-4">
      <div className="space-y-4 rounded-lg bg-white p-4 drop-shadow-2xl">
        <h1 className="text-center text-3xl font-semibold">Create an account</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
