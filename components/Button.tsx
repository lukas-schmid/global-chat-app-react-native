import { Colors } from "@/constants/Colors";
import { PropsWithChildren } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

type Size = "md" | "lg";
type Variant = "primary" | "secondary";

type ButtonStyleSize = "buttonMd" | "buttonLg";
const buttonSizeMap: Record<Size, ButtonStyleSize> = {
  md: "buttonMd",
  lg: "buttonLg",
};

type TextStyleSize = "textMd" | "textLg";
const textSizeMap: Record<Size, TextStyleSize> = {
  md: "textMd",
  lg: "textLg",
};

interface ButtonProps {
  size?: Size;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle | TextStyle;
  onPress(): void;
}

export const Button = ({
  size = "md",
  variant = "primary",
  disabled = false,
  style,
  onPress,
  children,
}: PropsWithChildren<ButtonProps>) => {
  const styles = getStyles(variant, size, disabled);

  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const getStyles = (variant: Variant, size: Size, disabled: boolean) => {
  const buttonCommon =
    variant === "primary"
      ? primaryStyles.buttonCommon
      : secondaryStyles.buttonCommon;
  const buttonSize =
    variant === "primary"
      ? primaryStyles[buttonSizeMap[size]]
      : secondaryStyles[buttonSizeMap[size]];
  const textCommon =
    variant === "primary"
      ? primaryStyles.textCommon
      : secondaryStyles.textCommon;
  const textSize =
    variant === "primary"
      ? primaryStyles[textSizeMap[size]]
      : secondaryStyles[textSizeMap[size]];

  const disabledStyle = disabled ? { opacity: 0.5 } : {};

  return {
    button: [buttonCommon, buttonSize, disabledStyle],
    text: [textCommon, textSize],
  };
};

const primaryStyles = StyleSheet.create({
  buttonCommon: {
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  buttonMd: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonLg: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  textCommon: {
    fontWeight: "bold",
    color: Colors.white,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 21,
  },
});

const secondaryStyles = StyleSheet.create({
  buttonCommon: {
    backgroundColor: "transparent",
  },
  buttonMd: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonLg: {
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  textCommon: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 21,
  },
});
