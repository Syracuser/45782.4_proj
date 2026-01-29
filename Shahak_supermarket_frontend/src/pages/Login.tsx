import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data);
      login(res.data.token);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Login failed");
      // alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            {...register("email", { required: true })}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full border px-3 py-2 rounded"
            {...register("password", { required: true })}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
