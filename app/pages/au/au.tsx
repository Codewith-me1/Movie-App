"use client";
import { useState, useEffect, useRef } from "react";
import { BiUser, BiLockAlt, BiEnvelope } from "react-icons/bi";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { saveUserData, createUserInFirestore } from "@/app/firebase/database";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import Alert from "@/app/components/popup/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Divider from "@/components/ui/divider";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    genres: [],
  });
  const [genres, setGenres] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  // Background and border colors
  const bgColor = "#1c1e31";
  const borderColor = "rgba(255, 255, 255, 0.1)";
  const shadowColor = "rgba(255, 255, 255, 0.1)";

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.log("API ERROR" + error);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreSelection = (genre: number) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const registeredUser = userCredential?.user;
      const idToken = await registeredUser?.getIdToken();

      setCookie(null, "auth-token", idToken, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleProviderLogin = async (Provider) => {
    const provider = new Provider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      setCookie(null, "auth-token", idToken, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      await createUserInFirestore(user);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const nextStep = () => step < 3 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-[#ffffff33] bg-transparent text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-[#ffffff33] bg-transparent text-white"
                  required
                />
              </div>
            </div>
            <Divider className="my-6">OR CONTINUE WITH</Divider>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/20"
                onClick={() => handleProviderLogin(GoogleAuthProvider)}
              >
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/20"
                onClick={() => handleProviderLogin(GithubAuthProvider)}
              >
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                GitHub
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <div className="flex flex-wrap gap-3">
              {genres?.map((genre) => (
                <Button
                  key={genre.id}
                  variant={
                    formData.genres.includes(genre.id) ? "default" : "outline"
                  }
                  className="transition-all"
                  onClick={() => handleGenreSelection(genre.id)}
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {formData.genres
                  .map((genreId) => genres?.find((g) => g.id === genreId)?.name)
                  .join(", ")}
              </p>
            </div>
            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-[750px] h-[450px] border-2 rounded-xl overflow-hidden`}
      style={{
        borderColor: borderColor,
        boxShadow: `0 0 25px ${shadowColor}`,
      }}
    >
      {/* Curved shapes */}
      <div
        className={`absolute right-0 top-[-5px] h-[600px] w-[850px] bg-gradient-to-br from-[#1c1e31] to-[#4b4b4b] origin-bottom-right transition-all duration-500 ${
          !isLogin ? "rotate-0 skew-y-0" : "rotate-10 skew-y-40"
        }`}
      ></div>

      {/* Login Form */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all ${
          !isLogin ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h2 className="text-3xl text-center mb-8">Login</h2>
        <form className="w-full space-y-6">
          <div className="relative">
            <Input
              type="email"
              required
              className="w-full bg-transparent border-b-2 border-white/20 text-white"
            />
            <Label className="absolute left-0 -top-5 text-white/80">
              Email
            </Label>
            <BiEnvelope className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
          <div className="relative">
            <Input
              type="password"
              required
              className="w-full bg-transparent border-b-2 border-white/20 text-white"
            />
            <Label className="absolute left-0 -top-5 text-white/80">
              Password
            </Label>
            <BiLockAlt className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
          <Button className="w-full bg-white/10 hover:bg-white/20">
            Login
          </Button>
          <p className="text-center text-sm text-white/70">
            Don't have an account? <br />
            <button
              type="button"
              className="text-white font-semibold hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      {/* Registration Steps */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all ${
          isLogin ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="space-y-8">
          <h2 className="text-3xl text-center">Create Account</h2>
          {renderStep()}
          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="ghost" onClick={prevStep}>
                Back
              </Button>
            )}
            {step < 3 && <Button onClick={nextStep}>Next</Button>}
          </div>
          {errorMessage && <Alert error={errorMessage} />}
          <p className="text-center text-sm text-white/70">
            Already have an account? <br />
            <button
              type="button"
              className="text-white font-semibold hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Info Content */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-end pr-40 pb-16 pl-36 transition-all ${
          !isLogin ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h2 className="text-4xl uppercase mb-4">Welcome Back!</h2>
        <p className="text-white/80">
          We're excited to see you again. Let's get back to creating amazing
          music!
        </p>
      </div>

      <div
        className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-end pl-10 pb-16 pr-36 transition-all ${
          isLogin ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h2 className="text-4xl uppercase mb-4">Start Creating</h2>
        <p className="text-white/80">
          Join our community of music creators and take your projects to the
          next level.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
