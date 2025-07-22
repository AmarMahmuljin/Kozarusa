import { StatusMessage } from "@types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserService from "@services/UserService";
import { UserType } from "@types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<UserType>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [showPassword, setShowPassword] = useState(false);
  // const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  // const clearErrors = () => {
  //   setErrors({});
  //   setStatusMessages([]);
  // };

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim() || formData.password.trim().length < 6) newErrors.password = "Password must be atleast 6 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the form errors and try again.");
      return;
    }

    const result = await UserService.postRegisterData(formData, router);

    if (result.status === 200) {
      toast.success("Registration successfull! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    } else {
      toast.error("Something went wrong during registration.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-start justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 pt-12">
      <div className="w-full max-w-md sm:max-w-lg">
        <Card className="shadow-xl border-none">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-800">Register</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Join our community and start exploring Kozarusa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-gray-800"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                Sign Up
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-sky-600 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default RegisterForm;