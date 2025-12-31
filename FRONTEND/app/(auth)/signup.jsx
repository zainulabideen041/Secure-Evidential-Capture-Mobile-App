import { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/signup.styles";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/authSlice/index";

const identityOptions = [
  { label: "Select Identity", value: "" },
  { label: "Individual", value: "individual" },
  { label: "Business Owner", value: "business_owner" },
  { label: "Legal Professional", value: "legal_professional" },
  { label: "Security Professional", value: "security_professional" },
  { label: "Other", value: "other" },
];

const jobTitleOptions = [
  { label: "Select Job Title", value: "" },
  { label: "Software Developer", value: "software_developer" },
  { label: "Product Manager", value: "product_manager" },
  { label: "Designer", value: "designer" },
  { label: "Marketing Manager", value: "marketing_manager" },
  { label: "Sales Representative", value: "sales_representative" },
  { label: "Consultant", value: "consultant" },
  { label: "Lawyer", value: "lawyer" },
  { label: "Security Analyst", value: "security_analyst" },
  { label: "Investigator", value: "investigator" },
  { label: "Student", value: "student" },
  { label: "Other", value: "other" },
];

const initialFormState = {
  name: "",
  email: "",
  password: "",
  identity: "",
  jobTitle: "",
  usagePurpose: "",
};

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, password, identity, jobTitle, usagePurpose } =
      formData;
    const errors = [];

    if (!name.trim()) errors.push("Please enter your full name");

    if (!email.trim()) {
      errors.push("Please enter your email address");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address");
    }

    if (!password.trim()) {
      errors.push("Please enter a password");
    } else if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!identity) errors.push("Please select your identity");
    if (!jobTitle) errors.push("Please select your job title");
    if (!usagePurpose.trim()) errors.push("Please describe your usage purpose");

    if (errors.length > 0) {
      Alert.alert("Validation Error", errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setSuccess("");
    setError("");
    setIsLoading(true);

    try {
      const res = await dispatch(registerUser(formData));

      if (res.payload?.success) {
        setSuccess(res.payload.message);
        setTimeout(() => {
          router.push({
            pathname: "/verifymail",
            params: { email: formData.email },
          });
        }, 1500);
      } else {
        setError(res.payload?.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Registration Failed",
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => router.push("/login");
  const handleBack = () => router.back();

  const renderInputField = ({
    field,
    label,
    iconName,
    placeholder,
    secureTextEntry = false,
    multiline = false,
    keyboardType = "default",
    autoCapitalize = "none",
    autoComplete = "off",
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper]}>
        <Feather name={iconName} size={20} style={styles.inputIcon} />
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {field === "password" && (
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
        )}
      </View>
    </View>
  );

  const renderPickerField = ({ field, label, iconName, options }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper]}>
        <Feather name={iconName} size={20} style={styles.inputIcon} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData[field]}
            style={styles.picker}
            onValueChange={(value) => handleInputChange(field, value)}
          >
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

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
          onPress={handleBack}
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
            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <FontAwesome5 name="user-secret" size={32} color="#ffffff" />
              </View>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitleText}>
                Join us to start capturing evidence
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {renderInputField({
                field: "name",
                label: "Full Name",
                iconName: "user",
                placeholder: "Enter your full name",
                autoCapitalize: "words",
                autoComplete: "name",
              })}

              {renderInputField({
                field: "email",
                label: "Email Address",
                iconName: "mail",
                placeholder: "Enter your email",
                keyboardType: "email-address",
                autoComplete: "email",
              })}

              {renderInputField({
                field: "password",
                label: "Password",
                iconName: "lock",
                placeholder: "Create password",
                secureTextEntry: true,
                autoComplete: "password-new",
              })}

              {renderPickerField({
                field: "identity",
                label: "Identity",
                iconName: "users",
                options: identityOptions,
              })}

              {renderPickerField({
                field: "jobTitle",
                label: "Job Title",
                iconName: "briefcase",
                options: jobTitleOptions,
              })}

              {renderInputField({
                field: "usagePurpose",
                label: "Usage Purpose",
                iconName: "target",
                placeholder: "Describe how you plan to use this app",
                multiline: true,
                autoCapitalize: "sentences",
              })}

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.signupButton, isLoading && { opacity: 0.7 }]}
                onPress={handleSignup}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default Signup;
