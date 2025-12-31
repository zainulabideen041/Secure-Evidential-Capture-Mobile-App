import { View, Text, Image, TouchableOpacity } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/theme";
import { useRouter } from "expo-router";

const Auth = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* BRAND SECTION  */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="user-secret" size={80} color={COLORS.white} />
        </View>

        <MaskedView
          maskElement={
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 45,
                  fontWeight: "700",
                  fontFamily: "JetBrainsMono-Medium",
                  color: "black",
                  letterSpacing: 0.5,
                  textAlign: "center",
                }}
              >
                Evidential
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={["#9842f5ff", "#e5cdf3ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: 250,
              height: 55,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </MaskedView>

        <Text style={styles.tagline}>Capture it Secretly</Text>
      </View>

      {/* ILLUSTRATION SECTION  */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/login.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* LOGIN SECTION  */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.9}
          onPress={() => router.push("/login")}
        >
          <View style={styles.googleIconContainer}>
            <Fontisto name="email" size={20} color={COLORS.white} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Email</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default Auth;
