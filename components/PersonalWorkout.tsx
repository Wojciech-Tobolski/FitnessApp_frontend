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
import { Link } from "expo-router";

const PersonalWorkouts = () => {
  const [personalWorkouts, setPersonalWorkouts] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPersonalWorkouts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.32:8000/api/personalworkout/');
        const data = await response.json();
        setPersonalWorkouts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching personal workouts:", error);
        setLoading(false);
      }
    };

    fetchPersonalWorkouts();
  }, []);

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
        <Link href={`/personalworkout/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            <Image source={require('../assets/images/workout.jpg')} style={styles.image} />
            <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemPriceTxt}>{item.workout_date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View>
    <Text style={styles.title}>Your personal workouts</Text>
      <FlatList
        data={loading ? [] : personalWorkouts}
        renderItem={renderItems}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PersonalWorkouts;

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.black,
      },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    width: 220,
    marginBottom: 20,
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
