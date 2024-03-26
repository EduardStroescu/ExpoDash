import { View } from "react-native";
import { forwardRef } from "react";
import { Button as Pressable } from "tamagui";

export type ButtonProps = {
  text?: string;
  style?: {};
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
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
        {text}
      </Pressable>
    );
  },
);

export default Button;
