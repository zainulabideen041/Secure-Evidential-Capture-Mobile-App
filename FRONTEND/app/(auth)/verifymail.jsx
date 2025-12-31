import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { styles } from "../../assets/styles/verifymail.styles";
import { useDispatch } from "react-redux";
import { verifyMail } from "../../redux/authSlice/index";
import { useLocalSearchParams } from "expo-router";

const Verifymail = () => {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();

  const { email } = useLocalSearchParams();

  useEffect(() => {
    // Initialize input refs
    inputRefs.current = inputRefs.current.slice(0, 6);

    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (value, index) => {
    // Clear any previous errors
    setError("");
    setSuccess("");

    // Only allow single digit
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Auto-verify when all 6 digits are entered
    if (value && index === 5) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handleVerify = async (verificationCode = null) => {
    const codeToVerify = verificationCode || code.join("");

    if (codeToVerify.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await dispatch(verifyMail({ code: codeToVerify, email }));
      if (res.payload?.success) {
        setSuccess(res.payload.message);
        setTimeout(() => {
          router.push("/(auth)/auth");
        }, 2000);
      } else {
        setError(res.payload.message);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Implement API call to resend code
      console.log("Resending code to:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Verification code sent successfully!");

      // Reset timer
      setTimer(60);
      setCanResend(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Resend error:", error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    // TODO: Navigate back to signup or allow email change
    router.back();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCodeComplete = code.every((digit) => digit !== "");

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
              <Text style={styles.titleText}>Verify Your Email</Text>
              <Text style={styles.subtitleText}>
                We've sent a 6-digit verification code to
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* VERIFICATION FORM */}
            <View style={styles.formContainer}>
              <Text style={styles.codeTitle}>Enter Verification Code</Text>

              {/* Code Input */}
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      activeIndex === index && styles.codeInputActive,
                      digit && styles.codeInputFilled,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(value, index)}
                    onFocus={() => setActiveIndex(index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                  />
                ))}
              </View>

              {/* Error/Success Messages */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {success ? (
                <Text style={styles.successText}>{success}</Text>
              ) : null}

              {/* Verify Button */}
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  (!isCodeComplete || isLoading) && styles.verifyButtonDisabled,
                ]}
                onPress={() => handleVerify()}
                activeOpacity={0.9}
                disabled={!isCodeComplete || isLoading}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Text>
              </TouchableOpacity>

              {/* Timer and Resend */}
              <View style={styles.timerContainer}>
                {!canResend ? (
                  <Text style={styles.timerText}>
                    Resend code in {formatTime(timer)}
                  </Text>
                ) : null}

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>
                    Didn't receive the code?
                  </Text>
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResendCode}
                    activeOpacity={0.7}
                    disabled={!canResend || isLoading}
                  >
                    <Text
                      style={[
                        styles.resendButtonText,
                        (!canResend || isLoading) &&
                          styles.resendButtonDisabled,
                      ]}
                    >
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Change Email */}
              <TouchableOpacity
                style={styles.changeEmailButton}
                onPress={handleChangeEmail}
                activeOpacity={0.8}
              >
                <Feather name="edit-2" size={16} color="#6b7280" />
                <Text style={styles.changeEmailText}>Change Email Address</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default Verifymail;
