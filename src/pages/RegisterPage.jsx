import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import api from "../api/client";
import AuthShell from "../components/AuthShell";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Track every rupee with a secure and beautiful workflow.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Full name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Harish Babu"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="8+ chars, uppercase, number, special"
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="btn-primary" disabled={loading}>
          <UserPlus size={18} />
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
