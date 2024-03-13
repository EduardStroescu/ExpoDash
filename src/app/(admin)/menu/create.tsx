import { defaultPizzaImage } from "@/assets/data/products";
import Button from "@/src/components/Button";
import Colors from "@/src/lib/constants/Colors";
import { useEffect, useState } from "react";
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
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/src/lib/supabase";
import { decode } from "base64-arraybuffer";
import { Image } from "react-native";

//TODO: React-Hook-Form && ZOD
export default function CreateProductScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
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
              setImage(fr.result as string);
            };
          }
        } else setImage(defaultPizzaImage);

        setName(updatingProduct.name);
        setPrice(String(updatingProduct.price));
      }
    })();
  }, [updatingProduct]);

  const router = useRouter();

  const onCreate = async () => {
    const imagePath = await uploadImage();

    insertProduct(
      { name, image: imagePath, price: parseFloat(price) },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    const imagePath = await uploadImage();

    updateProduct(
      { id, name, image: imagePath, price: parseFloat(price) },
      {
        onSuccess: () => {
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

  const onSubmit = () => {
    if (isUpdate) {
      // update
      onUpdate();
    } else {
      //create
      onCreate();
    }
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
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdate ? "Update Product" : "Add New Product" }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
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
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="grey"
        style={styles.input}
      />

      <Text
        style={[
          styles.label,
          { color: Colors[colorScheme ?? "light"].subText },
        ]}
      >
        Price
      </Text>
      <TextInput
        placeholder="9.99"
        placeholderTextColor="grey"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button text={isUpdate ? "Update" : "Create"} onPress={onSubmit} />

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
});
