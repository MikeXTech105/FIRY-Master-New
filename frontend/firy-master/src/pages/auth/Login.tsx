import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";

type LoginForm = {
  email: string;
  password: string;
};

const onSubmit = async (data: LoginForm) => {
  try {
    const res = await loginUser(data);

    if (res.statusCode === 1) {
      alert("Login Successful");

      window.location.href = "/dashboard";
    } else {
      alert("Invalid Login");
    }

  } catch (error) {
    console.error(error);
  }
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">

        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            FiryMaster 🚀
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

      </div>

    </div>
  );
}