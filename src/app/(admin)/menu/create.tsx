import { defaultPizzaImage } from "@assets/data/products";
import Button from "@/components/Button";
import Colors from "@/lib/constants/Colors";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "../../api/products";
import { supabase } from "@/lib/supabase";
import { Image } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadProductImage } from "@/lib/helpers/uploadProductImage";

const FormSchema = z.object({
  name: z
    .string({ required_error: "A product name is required" })
    .min(3, { message: "Name must contain at least three characters." }),
  image: z.string().nullable(),
  price: z
    .string({ required_error: "A product price is required" })
    .min(1, { message: "Price must contain at least one character." }),
});

export default function CreateProductScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
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
    defaultValues: { name: "", image: "", price: "" },
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = ({
    name,
    image,
    price,
  }) => {
    if (isUpdate) {
      onUpdate(name, image, price);
    } else {
      onCreate(name, image, price);
    }
  };

  const onCreate = async (
    name: string,
    image: string | null,
    price: string
  ) => {
    const imagePath = await uploadProductImage(image);

    insertProduct(
      { name, image: imagePath, price: parseFloat(price) },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      }
    );
  };

  const onUpdate = async (
    name: string,
    image: string | null,
    price: string
  ) => {
    const imagePath = await uploadProductImage(image);

    updateProduct(
      { id, name, image: imagePath, price: parseFloat(price) },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      }
    );
  };

  const onDelete = () => {
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
              router.replace("/(admin)");
            },
          });
        },
      },
    ]);
  };

  const pickImage = async () => {
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
  };

  useEffect(() => {
    (async () => {
      if (updatingProduct) {
        if (updatingProduct.image) {
          const { data: productImage } = await supabase.storage
            .from("product-images")
            .download(updatingProduct.image);
          if (productImage) {
            const fr = new FileReader();
            fr.readAsDataURL(productImage);
            fr.onload = () => {
              setValue("image", fr.result as string, {
                shouldValidate: true,
                shouldDirty: true,
              });
            };
          }
        } else
          setValue("image", defaultPizzaImage, {
            shouldValidate: true,
            shouldDirty: true,
          });

        setValue("name", updatingProduct.name, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("price", String(updatingProduct.price), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    })();
  }, [updatingProduct]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdate ? "Update Product" : "Add New Product" }}
      />

      <Image
        source={{ uri: getValues("image") || defaultPizzaImage }}
        style={styles.image}
      />
      <Text
        style={[
          styles.textButton,
          { color: Colors[colorScheme ?? "light"].tint },
        ]}
        onPress={pickImage}
      >
        Select Image
      </Text>

      <Text
        style={[
          styles.label,
          { color: Colors[colorScheme ?? "light"].subText },
        ]}
      >
        Name
      </Text>
      <Controller
        control={control}
        rules={{
          required: "Name is required",
        }}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Name"
            placeholderTextColor="grey"
            style={styles.input}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorMessage}>{errors.name.message}</Text>
      )}

      <Text
        style={[
          styles.label,
          { color: Colors[colorScheme ?? "light"].subText },
        ]}
      >
        Price
      </Text>
      <Controller
        control={control}
        rules={{
          required: "Price is required",
        }}
        name="price"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            placeholder="9.99"
            placeholderTextColor="grey"
            style={styles.input}
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.price && (
        <Text style={styles.errorMessage}>{errors.price.message}</Text>
      )}

      <Button
        text={isUpdate ? "Update" : "Create"}
        onPress={handleSubmit(onSubmit)}
      />

      {isUpdate && <Button text="Delete Product" onPress={onDelete} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 10 },
  image: { width: "50%", aspectRatio: 1, alignSelf: "center" },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
  label: { fontSize: 16 },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
  },
});
