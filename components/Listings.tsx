import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ListingType } from "@/types/listingType";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {
  category: string;
};

const Listings = ({ category }: Props) => {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.59:8000/api/exercises/');
        const data = await response.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const filtered = category === "All"
      ? listings
      : listings.filter((item) => item.type.toString() === category);

    setFilteredItems(filtered);
  }, [category, listings]);

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemPriceTxt}>{item.short_description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View>
      <FlatList
        data={loading ? [] : filteredItems}
        renderItem={renderItems}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    width: 220,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  bookmark: {
    position: "absolute",
    top: 185,
    right: 30,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
});
