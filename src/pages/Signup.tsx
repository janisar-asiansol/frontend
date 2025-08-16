import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      toast({
        title: "Validation Error",
        description: "Passwords don't match!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: phoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          referralCode: formData.referralCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Registration Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const verifyResponse = await fetch("http://localhost:3000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: formData.email, 
        token: otp 
      }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) throw new Error(verifyData.error || "OTP verification failed");

    toast({
      title: "Success",
      description: verifyData.message || "Account verified successfully. Please login now.",
    });

    // Redirect user to login page
    navigate("/login");
  } catch (err: any) {
    setError(err.message);
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleGoogleSignup = async () => {
    try {
      // Implement Google signup logic here
      // After successful signup, you would call login() with the token
      // For now, we'll simulate a successful signup
      const token = "google-auth-token"; // Replace with actual token from Google auth
      login(token);
      
      toast({
        title: "Google Signup Successful",
        description: "You have successfully signed up with Google",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Google signup error:", error);
      setError("Failed to sign up with Google");
      toast({
        title: "Google Signup Error",
        description: "Failed to sign up with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-background/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md"
            >
              <User className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {step === "details" ? "Create Account" : "Verify Your Email"}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === "details" 
                ? "Start your crypto investment journey today" 
                : `Enter the 6-digit code sent to ${formData.email}`}
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive-foreground text-sm rounded-md">
                {error}
              </div>
            )}

            {step === "details" ? (
              <>
                <Button
                  onClick={handleGoogleSignup}
                  variant="outline"
                  className="w-full h-12 gap-3 text-foreground border-border hover:bg-muted/50"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Sign up with Google</span>
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background/80 px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstname" className="text-foreground">First Name</Label>
                          <Input
                            id="firstname"
                            name="firstname"
                            type="text"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname" className="text-foreground">Last Name</Label>
                          <Input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
  <PhoneInput
    country={countryCode.toLowerCase()}
    value={phoneNumber}
    onChange={(value, data) => {
      setPhoneNumber(value);
      setCountryCode(data.countryCode?.toUpperCase() || 'US');
    }}
    inputProps={{
      name: 'phone',
      required: true,
      className: 'w-full h-10 px-3 rounded-md text-sm border border-border bg-background/50 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
    }}
    containerStyle={{ width: '100%' }}
    inputStyle={{
      width: '100%',
      height: '42px',
      borderRadius: '0.375rem',
      backgroundColor: 'transparent',
      borderColor: 'var(--border)',
      color: 'var(--foreground)',
      paddingLeft: '48px'
    }}
    buttonStyle={{
      border: 'none',
      backgroundColor: 'transparent',
      paddingLeft: '10px'
    }}
    dropdownStyle={{
      backgroundColor: '#1f1f1f',
      border: '1px solid #333',
      color: '#fff',
      zIndex: 9999,
      maxHeight: '200px',
      overflowY: 'auto'
    }}
    searchStyle={{
      backgroundColor: '#2c2c2c',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '4px'
    }}
    dropdownClass="dark-dropdown"
    enableSearch
  />
</div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 pr-10"
                            placeholder="••••••••"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10 pr-10"
                            placeholder="••••••••"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referralCode" className="text-foreground">Referral Code (Optional)</Label>
                        <Input
                          id="referralCode"
                          name="referralCode"
                          type="text"
                          value={formData.referralCode}
                          onChange={handleChange}
                          placeholder="Enter referral code"
                        />
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <input
                          type="checkbox"
                          required
                          className="mt-1 rounded border-border focus:ring-primary focus:ring-2"
                        />
                        <label className="text-sm text-muted-foreground leading-snug">
                          I agree to the{" "}
                          <Link to="/terms" className="text-primary hover:underline font-medium">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-primary hover:underline font-medium">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 text-lg shadow-md mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </div>
              </>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
  <div className="flex justify-center gap-2">
    {[...Array(6)].map((_, i) => (
      <Input
        key={i}
        id={`otp-${i}`} // Required for focus control
        type="text"
        inputMode="numeric" // Better mobile keyboard
        maxLength={1}
        value={otp[i] || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Allow only digits
          const newOtp = otp.split('');
          newOtp[i] = value;
          setOtp(newOtp.join(''));
          
          // Auto-focus next input on digit entry
          if (value && i < 5) {
            document.getElementById(`otp-${i + 1}`)?.focus();
          }
        }}
        onKeyDown={(e) => {
          // Backspace: Move to previous input if current is empty
          if (e.key === 'Backspace' && !otp[i] && i > 0) {
            document.getElementById(`otp-${i - 1}`)?.focus();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pastedData = e.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // Extract only digits
          
          // Auto-fill if pasted 6 digits
          if (pastedData.length === 6) {
            setOtp(pastedData);
            document.getElementById(`otp-5`)?.focus(); // Focus last input
          }
        }}
        className="w-12 h-14 text-center text-2xl font-medium"
        required
        disabled={isLoading}
      />
    ))}
  </div>

  <Button 
    type="submit" 
    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 text-lg shadow-md"
    disabled={isLoading}
  >
    {isLoading ? "Verifying..." : "Verify OTP"}
  </Button>

  <Button 
    variant="outline" 
    className="w-full h-12"
    onClick={() => setStep("details")}
    disabled={isLoading}
  >
    Back
  </Button>

  <div className="text-center text-sm text-muted-foreground">
    Didn't receive a code?{" "}
    <button 
      type="button" 
      className="text-primary hover:underline font-medium"
      onClick={handleSubmit}
      disabled={isLoading}
    >
      Resend
    </button>
  </div>
</form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;