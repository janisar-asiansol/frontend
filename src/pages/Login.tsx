import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [step, setStep] = useState<"credentials" | "otp" | "forgotPassword" | "verifyResetOtp" | "resetPassword">("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // Separate state for login and password reset
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    otp: ""
  });

  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
    isOtpVerified: false
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
  };

  // Login flow handlers
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/auth/login/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          token: loginData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      login(data);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in",
      });

      navigate(data.user?.role === "admin" ? "/admin" : "/dashboard");

    } catch (err: any) {
      console.error("OTP verification error:", err);
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Password reset flow handlers
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });

      setStep("verifyResetOtp");

    } catch (err: any) {
      console.error("Forgot password error:", err);
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          token: resetData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setResetData(prev => ({
        ...prev,
        isOtpVerified: true
      }));

      toast({
        title: "OTP Verified",
        description: "You can now reset your password",
      });

      setStep("resetPassword");

    } catch (err: any) {
      console.error("OTP verification error:", err);
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!resetData.isOtpVerified) {
        throw new Error("OTP verification required");
      }

      if (resetData.newPassword !== resetData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword,
          confirmPassword: resetData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast({
        title: "Password Reset",
        description: "Your password has been updated successfully",
      });

      // Reset states and return to login
      setResetData({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
        isOtpVerified: false
      });
      setStep("credentials");

    } catch (err: any) {
      console.error("Password reset error:", err);
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // setLoading(true);
    // setMessage("");

    // try {
    //   const mockGoogleResponse = {
    //     user: {
    //       user_id: "google-user-id",
    //       email: loginData.email || "user@gmail.com",
    //       firstname: "Google",
    //       lastname: "User",
    //       phone: "",
    //       user_verified: true,
    //       referral_code: "GOOGLE123",
    //       role: "user"
    //     },
    //     session: {
    //       access_token: "google-auth-token"
    //     }
    //   };

    //   login(mockGoogleResponse);

    //   toast({
    //     title: "Google Login Successful",
    //     description: "You have successfully logged in with Google",
    //   });

    //   navigate("/dashboard");
    // } catch (error) {
    //   console.error("Google login error:", error);
    //   setMessage("Failed to login with Google");
    //   toast({
    //     title: "Google Login Error",
    //     description: "Failed to login with Google",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="glass border-border">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center"
            >
              <Lock className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {step === "credentials" && "Welcome Back"}
              {step === "otp" && "Verify Your Identity"}
              {step === "forgotPassword" && "Reset Your Password"}
              {step === "verifyResetOtp" && "Verify Reset OTP"}
              {step === "resetPassword" && "Set New Password"}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === "credentials" && "Sign in to your crypto investment account"}
              {step === "otp" && `Enter the verification code sent to ${loginData.email}`}
              {step === "forgotPassword" && "Enter your email to receive a reset link"}
              {step === "verifyResetOtp" && `Enter the verification code sent to ${resetData.email}`}
              {step === "resetPassword" && "Enter your new password"}
            </p>
          </CardHeader>

          <CardContent>
            {/* Login with Google (only on credentials step) */}
            {step === "credentials" && (
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-12 gap-3 text-foreground border-border hover:bg-muted/50 mb-6"
                disabled={loading}
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </Button>
            )}

            {/* Main Form Area */}
            {step === "credentials" ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10 glass border-border bg-background/50"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="pl-10 pr-10 glass border-border bg-background/50"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      disabled={loading}
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("forgotPassword")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full button-gradient text-lg py-6"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Continue with OTP"}
                </Button>
              </form>
            ) : step === "otp" ? (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Enter the 6-digit code sent to {loginData.email}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric" // Better mobile keyboard
                      maxLength={1}
                      value={loginData.otp[i] || ""}
                      onChange={(e) => {
                        const newOtp = loginData.otp.split('');
                        newOtp[i] = e.target.value.replace(/\D/g, ''); // Allow only digits
                        setLoginData({
                          ...loginData,
                          otp: newOtp.join('')
                        });

                        // Auto-focus next input if a digit was entered
                        if (e.target.value && i < 5) {
                          document.getElementById(`otp-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Backspace: Move to previous input if current is empty
                        if (e.key === 'Backspace' && !e.target.value && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, ''); // Get digits only
                        if (pastedData.length === 6) {
                          setLoginData({
                            ...loginData,
                            otp: pastedData
                          });
                          document.getElementById(`otp-5`)?.focus(); // Focus last input
                        }
                      }}
                      className="w-12 h-14 text-center text-2xl font-medium"
                      required
                      disabled={loading}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full button-gradient text-lg py-6"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("credentials")}
                  disabled={loading}
                >
                  Back
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-primary hover:underline"
                    disabled={loading}
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </div>
              </form>
            ) : step === "forgotPassword" ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="resetEmail"
                      name="email"
                      type="email"
                      value={resetData.email}
                      onChange={handleResetChange}
                      className="pl-10 glass border-border bg-background/50"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full button-gradient text-lg py-6"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send Reset OTP"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("credentials")}
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </form>
            ) : step === "verifyResetOtp" ? (
              <form onSubmit={handleVerifyResetOTP} className="space-y-6">
  <div className="text-center">
    <p className="text-muted-foreground mb-4">
      Enter the 6-digit code sent to {resetData.email}
    </p>
  </div>

  <div className="flex justify-center gap-2 mb-6">
    {[...Array(6)].map((_, i) => (
      <Input
        key={i}
        id={`reset-otp-${i}`}
        type="text"
        inputMode="numeric" // Shows numeric keyboard on mobile
        maxLength={1}
        value={resetData.otp[i] || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
          const newOtp = resetData.otp.split('');
          newOtp[i] = value;
          setResetData({
            ...resetData,
            otp: newOtp.join('')
          });
          
          // Auto-focus next input when digit is entered
          if (value && i < 5) {
            document.getElementById(`reset-otp-${i + 1}`)?.focus();
          }
        }}
        onKeyDown={(e) => {
          // Handle backspace to move to previous input
          if (e.key === 'Backspace' && !resetData.otp[i] && i > 0) {
            document.getElementById(`reset-otp-${i - 1}`)?.focus();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pastedData = e.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // Extract only digits
          
          // Auto-fill if 6 digits are pasted
          if (pastedData.length === 6) {
            setResetData({
              ...resetData,
              otp: pastedData
            });
            document.getElementById(`reset-otp-5`)?.focus(); // Focus last input
          }
        }}
        className="w-12 h-14 text-center text-2xl font-medium"
        required
        disabled={loading}
      />
    ))}
  </div>

  <Button
    type="submit"
    className="w-full button-gradient text-lg py-6"
    disabled={loading}
  >
    {loading ? "Verifying..." : "Verify OTP"}
  </Button>

  <Button
    variant="outline"
    className="w-full"
    onClick={() => setStep("forgotPassword")}
    disabled={loading}
  >
    Back
  </Button>

  <div className="text-center">
    <button
      type="button"
      onClick={handleForgotPassword}
      className="text-sm text-primary hover:underline"
      disabled={loading}
    >
      Didn't receive code? Resend OTP
    </button>
  </div>
</form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={resetData.newPassword}
                      onChange={handleResetChange}
                      className="pl-10 pr-10 glass border-border bg-background/50"
                      placeholder="Enter new password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={resetData.confirmPassword}
                      onChange={handleResetChange}
                      className="pl-10 pr-10 glass border-border bg-background/50"
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full button-gradient text-lg py-6"
                  disabled={loading || !resetData.isOtpVerified}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("credentials")}
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </form>
            )}

            {message && (
              <p className="text-sm text-center text-red-500 mt-4">{message}</p>
            )}

            {step === "credentials" && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-semibold">
                    Sign up here
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-8"
        >
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            ← Back to Homepage
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;