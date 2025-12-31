import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { styles } from "../../assets/styles/login.styles";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../../redux/authSlice/index";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    setSuccess("");
    setError("");
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    setLoading(true);

    try {
      const res = await dispatch(loginUser({ email, password }));
      if (res.payload?.success) {
        setSuccess(res.payload.message);
        setLoading(false);
      } else {
        setError(res.payload?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (email === "") {
      Alert.alert("Please enter your email address");
      return;
    }
    const res = await axios.post("http://localhost:7002/reset-pass/send-code", {
      email,
    });
    if (res?.data?.success) {
      router.push({
        pathname: "/resetpass",
        params: { email },
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* BRAND SECTION  */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <FontAwesome5 name="user-secret" size={40} color="#ffffff" />
              </View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitleText}>
                Sign in to continue your journey
              </Text>
            </View>

            {/* FORM SECTION */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper]}>
                  <Feather name="mail" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper]}>
                  <Feather name="lock" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.9}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Signing in" : "Sign in"}
                </Text>
              </TouchableOpacity>

              <View style={styles.messageContainer}>
                {error ? (
                  <View style={[styles.messageBox, styles.errorBox]}>
                    <Feather name="alert-circle" size={16} color="#fff" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : success ? (
                  <View style={[styles.messageBox, styles.successBox]}>
                    <Feather name="check-circle" size={16} color="#fff" />
                    <Text style={styles.successText}>{success}</Text>
                  </View>
                ) : null}
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text
                    style={styles.signupLink}
                    onPress={() => router.push("/signup")}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default Login;
