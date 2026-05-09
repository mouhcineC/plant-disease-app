import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const response = await register(payload);
      const token = response?.data?.auth_token || response?.data?.token;
      if (!token) {
        setIsError(true);
        setMessage("Registration succeeded but no token was returned.");
        return;
      }
      setIsError(false);
      setMessage(response?.data?.message || "Registration successful");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      navigate("/", { replace: true });
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join us and start detecting plant diseases with AI"
      footer={
        <span>
          Already have an account?{" "}
          <Link className="text-emerald-200 transition hover:text-emerald-100" to="/login">
            Login
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Full name"
          autoComplete="name"
          icon={<UserIcon className="h-4 w-4" />}
        />
        <AuthInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
          icon={<MailIcon className="h-4 w-4" />}
        />
        <AuthInput
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
          icon={<LockIcon className="h-4 w-4" />}
          rightElement={
            <ToggleButton
              isVisible={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
              label="Toggle password visibility"
            />
          }
        />
        <AuthInput
          type={showConfirm ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          autoComplete="new-password"
          icon={<LockIcon className="h-4 w-4" />}
          rightElement={
            <ToggleButton
              isVisible={showConfirm}
              onClick={() => setShowConfirm((prev) => !prev)}
              label="Toggle confirm password visibility"
            />
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${isError ? "text-red-300" : "text-emerald-200"}`}>
          {message}
        </p>
      )}
    </AuthLayout>
  );
}

function ToggleButton({ isVisible, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-emerald-200/70 transition hover:text-emerald-200"
    >
      {isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
    </button>
  );
}

function UserIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20c2.5-3 5.3-4.5 8-4.5s5.5 1.5 8 4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m22 8-9.5 6.5a2 2 0 0 1-2 0L2 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M3 3l18 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3 6.5C3.4 8 2 12 2 12s4 6 10 6c2.1 0 3.9-.6 5.4-1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Register;
