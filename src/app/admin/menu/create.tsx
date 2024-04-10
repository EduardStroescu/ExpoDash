import { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ScrollView,
  Text,
  Theme,
  View,
  YStack,
  GetProps,
  Image,
} from "tamagui";
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
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";
import { ProductData, ProductSize, Tables } from "@/lib/types";
import { FormSchema } from "@/lib/formSchemas/createOrUpdateSchema";
import z from "zod";
import { toast } from "@backpackapp-io/react-native-toast";
import { ToastOptions } from "@/lib/constants/ToastOptions";

const sizes: ProductSize[] = ["S", "M", "L", "XL"];

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changedProductImage, setChangedProductImage] =
    useState<boolean>(false);

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
      s_price: "" as unknown as number,
      m_price: "" as unknown as number,
      l_price: "" as unknown as number,
      xl_price: "" as unknown as number,
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
    s_price: number,
    m_price: number,
    l_price: number,
    xl_price: number,
  ) => {
    setIsLoading(true);
    const imagePath =
      Platform.OS !== "web"
        ? await uploadProductImageMobile(image)
        : await uploadProductImageWeb(image);

    insertProduct(
      {
        name,
        image: imagePath,
        description,
        s_price: s_price,
        m_price: m_price,
        l_price: l_price,
        xl_price: xl_price,
      },
      {
        onSuccess: () => {
          reset();
          router.back();
          toast(
            "Product created successfully",
            ToastOptions({ iconName: "check" }),
          );
          setIsLoading(false);
        },
      },
    );
  };

  const onUpdate = async (
    name: string,
    image: string | null,
    description: string,
    s_price: number,
    m_price: number,
    l_price: number,
    xl_price: number,
  ) => {
    setIsLoading(true);
    let imagePath = null;
    if (changedProductImage && image) {
      imagePath =
        Platform.OS !== "web"
          ? await uploadProductImageMobile(image)
          : await uploadProductImageWeb(image);
    }

    const productData: ProductData = {
      id,
      name,
      description,
      s_price,
      m_price,
      l_price,
      xl_price,
    };

    if (changedProductImage && imagePath) {
      productData.image = imagePath;
    }

    updateProduct(productData, {
      onSuccess: () => {
        setChangedProductImage(false);
        router.back();
        toast(
          "Product updated successfully",
          ToastOptions({ iconName: "check" }),
        );
        setIsLoading(false);
      },
    });
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
                toast(
                  "Product deleted successfully",
                  ToastOptions({ iconName: "check" }),
                );
              },
            });
          },
        },
      ]);
    } else {
      deleteProduct(id, {
        onSuccess: () => {
          router.replace("/admin/menu/");
          toast(
            "Product deleted successfully",
            ToastOptions({ iconName: "check" }),
          );
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
        setChangedProductImage(true);
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
          setChangedProductImage(true);
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

        setValue("name", updatingProduct.name, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("description", updatingProduct.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("s_price", updatingProduct.s_price, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("m_price", updatingProduct.m_price, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("l_price", updatingProduct.l_price, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("xl_price", updatingProduct.xl_price, {
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={65}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView width="100%" height="100%" backgroundColor="$background">
          <YStack {...styles.container}>
            <View>
              <Image
                {...styles.image}
                source={{
                  uri: getValues("image") || imagePlaceholder,
                  width: 400,
                  height: 400,
                }}
                width="100%"
                aspectRatio={1}
                alignSelf="center"
                resizeMode="cover"
                $gtXs={{ width: "60%", height: "auto" }}
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
                  multiline
                  numberOfLines={5}
                />
              )}
            />
            {errors.description && (
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
                          value={String(value)}
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
              text={
                !isLoading ? (isUpdate ? "Update" : "Create") : "Submitting..."
              }
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            />

            {isUpdate && (
              <Button
                backgroundColor="$red7"
                text="Delete Product"
                onPress={onDelete}
                disabled={isLoading}
              />
            )}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Theme>
  );
}

interface StyleTypes {
  container: GetProps<typeof YStack>;
  image: GetProps<typeof Image>;
  textButton: GetProps<typeof Text>;
  label: GetProps<typeof Text>;
  input: GetProps<typeof Input>;
  errorMessage: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    width: "100%",
    $gtMd: { width: "50%", paddingBottom: "$10" },
    height: "100%",
    alignSelf: "center",
    backgroundColor: "$background",
    padding: 10,
    $gtXs: { paddingHorizontal: 40 },
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
