import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import config from "@/config";

type Props = {
  onCategoryChanged: (category: string) => void;
};

type Category = {
  id: number;
  type_name: string;
};

const CategoryButtons = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/exercise-types/`);
        const data: Category[] = await response.json();
        setCategories([{ id: 0, type_name: "Wszystkie" }, ...data]);  // Dodaj kategorię "Wszystkie"
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);

    selected?.measureLayout(
      scrollRef.current?.getScrollableNode(),
      (x, y, width, height) => {
        scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
      },
      () => console.log("Error measuring layout")
    );

    onCategoryChanged(categories[index].id === 0 ? "All" : categories[index].id.toString());
  };

  return (
    <View>
      <Text style={styles.title}>Exercise</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={
              activeIndex === index
                ? styles.categoryBtnActive
                : styles.categoryBtn
            }
          >
            <Text
              style={
                activeIndex === index
                  ? styles.categoryBtnTxtActive
                  : styles.categoryBtnTxt
              }
            >
              {item.type_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryButtons;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.black,
    
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryBtnTxt: {
    marginLeft: 5,
    color: Colors.black,
  },
  categoryBtnTxtActive: {
    marginLeft: 5,
    color: Colors.white,
  },
});
