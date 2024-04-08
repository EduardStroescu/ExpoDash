import { useEffect } from "react";
import {
  Alert,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase/supabase";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, Text, Theme, View, YStack, GetProps } from "tamagui";
import {
  uploadProductImageMobile,
  uploadProductImageWeb,
} from "@/lib/helpers/uploadImage";

import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "../../api/products";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/webOnlyComponents/Header";
import RemoteImage from "@/components/RemoteImage";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";
import { ProductSize, Tables } from "@/lib/types";

const sizes: ProductSize[] = ["S", "M", "L", "XL"];

const FormSchema = z.object({
  name: z
    .string({ required_error: "A product name is required" })
    .min(3, { message: "Name must contain at least three characters." }),
  image: z.string().nullable(),
  description: z
    .string({ required_error: "A product description is required" })
    .min(1, {
      message: "Product description must contain at least one character.",
    }),
  s_price: z
    .string({ required_error: "A small variant price is required" })
    .min(1, { message: "Price must contain at least one character." }),
  m_price: z
    .string({ required_error: "A medium variant price is required" })
    .min(1, { message: "Price must contain at least one character." }),
  l_price: z
    .string({ required_error: "A large variant product price is required" })
    .min(1, { message: "Price must contain at least one character." }),
  xl_price: z
    .string({ required_error: "An XL variant product price is required" })
    .min(1, { message: "Price must contain at least one character." }),
});

export default function CreateProductScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const isUpdate = !!idString;

  const { data: updatingProduct } = useProduct(id);
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
      description: "",
      s_price: "",
      m_price: "",
      l_price: "",
      xl_price: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = ({
    name,
    image,
    description,
    s_price,
    m_price,
    l_price,
    xl_price,
  }) => {
    if (isUpdate) {
      onUpdate(name, image, description, s_price, m_price, l_price, xl_price);
    } else {
      onCreate(name, image, description, s_price, m_price, l_price, xl_price);
    }
  };

  const onCreate = async (
    name: string,
    image: string | null,
    description: string,
    s_price: string,
    m_price: string,
    l_price: string,
    xl_price: string,
  ) => {
    const imagePath =
      Platform.OS !== "web"
        ? await uploadProductImageMobile(image)
        : await uploadProductImageWeb(image);

    insertProduct(
      {
        name,
        image: imagePath,
        description,
        s_price: parseFloat(s_price),
        m_price: parseFloat(m_price),
        l_price: parseFloat(l_price),
        xl_price: parseFloat(xl_price),
      },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      },
    );
  };

  const onUpdate = async (
    name: string,
    image: string | null,
    description: string,
    s_price: string,
    m_price: string,
    l_price: string,
    xl_price: string,
  ) => {
    const imagePath =
      Platform.OS !== "web"
        ? await uploadProductImageMobile(image)
        : await uploadProductImageWeb(image);

    updateProduct(
      {
        id,
        name,
        image: imagePath,
        description,
        s_price: parseFloat(s_price),
        m_price: parseFloat(m_price),
        l_price: parseFloat(l_price),
        xl_price: parseFloat(xl_price),
      },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      },
    );
  };

  const onDelete = () => {
    if (Platform.OS !== "web") {
      Alert.alert("Confirm", "Are you sure you want to delete this product?", [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(id, {
              onSuccess: () => {
                router.replace("/admin/menu/");
              },
            });
          },
        },
      ]);
    } else {
      deleteProduct(id, {
        onSuccess: () => {
          router.replace("/admin/menu/");
        },
      });
    }
  };

  const pickImage = async (
    event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent,
  ) => {
    if (Platform.OS !== "web") {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setValue("image", result.assets[0].uri, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else {
      const e = event as React.ChangeEvent<HTMLInputElement>;
      if (!e.target.files?.length) return;
      const fileReader = new FileReader();
      const file = e.target.files[0];
      fileReader.readAsDataURL(file);

      fileReader.onloadend = () => {
        const content = fileReader.result;
        if (content && typeof content === "string") {
          setValue("image", content, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
    }
  };

  useEffect(() => {
    (() => {
      if (updatingProduct) {
        if (updatingProduct.image) {
          const { data: productImage } = supabase.storage
            .from("product-images")
            .getPublicUrl(updatingProduct.image);
          if (productImage) {
            setValue("image", productImage.publicUrl, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }
        setValue("image", imagePlaceholder, {
          shouldValidate: true,
          shouldDirty: true,
        });

        setValue("name", updatingProduct.name, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("description", updatingProduct.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("s_price", String(updatingProduct.s_price), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("m_price", String(updatingProduct.m_price), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("l_price", String(updatingProduct.l_price), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("xl_price", String(updatingProduct.xl_price), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    })();
  }, [updatingProduct]);

  return (
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{ title: isUpdate ? "Update Product" : "Add New Product" }}
      />
      {Platform.OS === "web" && <Header />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={65}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView width="100%" height="100%" backgroundColor="$background">
          <YStack {...styles.container}>
            <View>
              <RemoteImage
                {...styles.image}
                source={getValues("image")}
                fallback={imagePlaceholder}
                width="100%"
                aspectRatio={1}
                alignSelf="center"
                resizeMode="cover"
                placeholderStyle={{
                  width: 500,
                  height: 500,
                  aspectRatio: 1,
                  alignSelf: "center",
                }}
                $gtXs={{ width: "100%", height: "auto" }}
                $gtLg={{ width: "50%", height: "auto" }}
              />
            </View>
            {Platform.OS === "web" ? (
              <Text {...styles.textButton} position="relative">
                Select Image
                <input type="file" onChange={pickImage} />
              </Text>
            ) : (
              <Text {...styles.textButton} onPress={pickImage}>
                Select Image
              </Text>
            )}

            <Text {...styles.label}>Name</Text>
            <Controller
              control={control}
              rules={{
                required: "Name is required",
              }}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  {...styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Name"
                  placeholderTextColor="grey"
                />
              )}
            />
            {errors.name && (
              <Text {...styles.errorMessage}>{errors.name?.message}</Text>
            )}

            <Text {...styles.label}>Description</Text>
            <Controller
              control={control}
              rules={{
                required: "A description is required",
              }}
              name="description"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  {...styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Description"
                  placeholderTextColor="grey"
                />
              )}
            />
            {errors.name && (
              <Text {...styles.errorMessage}>
                {errors.description?.message}
              </Text>
            )}

            <Text {...styles.label}>Prices</Text>
            <View
              flexDirection="row"
              gap="$3"
              justifyContent="center"
              width="100%"
            >
              {sizes.map((size) => {
                const inputName = `${size.toLowerCase()}_price` as keyof Pick<
                  Tables<"products">,
                  "s_price" | "m_price" | "l_price" | "xl_price"
                >;
                return (
                  <View alignItems="center" key={size}>
                    <Text {...styles.label}>{size}</Text>
                    <Controller
                      control={control}
                      rules={{
                        required: `${size} Price is required`,
                      }}
                      name={inputName}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                          {...styles.input}
                          width={50}
                          padding={0}
                          textAlign="center"
                          placeholder="9.99"
                          placeholderTextColor="grey"
                          keyboardType="numeric"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      )}
                    />
                  </View>
                );
              })}
            </View>
            {errors.s_price && (
              <Text {...styles.errorMessage}>{errors.s_price?.message}</Text>
            )}
            {errors.m_price && (
              <Text {...styles.errorMessage}>{errors.m_price?.message}</Text>
            )}
            {errors.l_price && (
              <Text {...styles.errorMessage}>{errors.l_price?.message}</Text>
            )}
            {errors.xl_price && (
              <Text {...styles.errorMessage}>{errors.xl_price?.message}</Text>
            )}

            <Button
              text={isUpdate ? "Update" : "Create"}
              onPress={handleSubmit(onSubmit)}
            />

            {isUpdate && (
              <Button
                backgroundColor="$red7"
                text="Delete Product"
                onPress={onDelete}
              />
            )}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Theme>
  );
}

interface StyleProps {
  container: GetProps<typeof YStack>;
  image: GetProps<typeof RemoteImage>;
  textButton: GetProps<typeof Text>;
  label: GetProps<typeof Text>;
  input: GetProps<typeof Input>;
  errorMessage: GetProps<typeof Text>;
}

const styles: StyleProps = {
  container: {
    width: "100%",
    $gtMd: { width: "50%" },
    height: "100%",
    alignSelf: "center",
    backgroundColor: "$background",
    padding: 10,
    gap: "$3",
  },
  image: {
    width: 400,
    height: 400,
    aspectRatio: 1,
    alignSelf: "center",
    objectFit: "cover",
    algnSelf: "center",
  },
  textButton: {
    color: "$blue10",
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
    cursor: "pointer",
  },
  label: { fontSize: 16, color: "$color10" },
  input: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 14,
    color: "red",
  },
};
