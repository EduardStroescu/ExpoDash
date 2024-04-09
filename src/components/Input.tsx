import { Input as InputField } from "tamagui";

export type InputProps = {
  style?: {};
} & React.ComponentPropsWithoutRef<typeof InputField>;

const Input = ({ ...inputProps }: InputProps) => {
  return (
    <InputField
      {...inputProps}
      borderColor="$color10"
      focusStyle={{ outlineColor: "$purple10" }}
      hoverStyle={{ borderColor: "$purple10" }}
      pressStyle={{ borderColor: "$purple10" }}
      placeholderTextColor="$color10"
      style={inputProps.style && inputProps.style}
    />
  );
};

export default Input;
