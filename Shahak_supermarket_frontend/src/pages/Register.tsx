import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type RegisterFormData = {
  email: string;
  password: string;
};

function Register() {
  const { register, handleSubmit, reset } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axios.post(`${API_URL}/register`, data);
      reset();
      navigate("/login");
    } catch (err: any) {
        toast.error(err.response?.data?.msg || "Register failed");
      
      // alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

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
            autoComplete="new-password"
            className="w-full border px-3 py-2 rounded"
            {...register("password", { required: true })}
          />

          <button className="w-full bg-green-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
