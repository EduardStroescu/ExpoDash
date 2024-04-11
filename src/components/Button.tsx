import { forwardRef } from "react";
import { View } from "react-native";
import { GetProps, Button as Pressable } from "tamagui";

export type ButtonProps = {
  text?: string;
  style?: {};
} & GetProps<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, children, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        borderRadius={100}
        backgroundColor={
          pressableProps.backgroundColor
            ? pressableProps.backgroundColor
            : "$color2"
        }
        borderColor={
          pressableProps.borderColor ? pressableProps.borderColor : "$purple10"
        }
        hoverStyle={
          pressableProps.hoverStyle
            ? pressableProps.hoverStyle
            : { borderColor: "$purple10", backgroundColor: "$purple8" }
        }
        pressStyle={
          pressableProps.pressStyle
            ? pressableProps.pressStyle
            : { borderColor: "$purple10", backgroundColor: "$purple8" }
        }
        style={pressableProps.style && pressableProps.style}
      >
        {text ? text : children}
      </Pressable>
    );
  },
);

export default Button;
