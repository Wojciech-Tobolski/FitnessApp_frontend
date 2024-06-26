import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

type Exercise = {
  id: number;
  title: string;
  short_description: string;
  image: string;
  video_link: string;
  html_content: string;
  type: number;
  language: number;
};

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const scrollOffset = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    const fetchExercise = async () => {
      try {
        console.log("Fetching exercise with ID:", id);
        const response = await fetch(`http://192.168.1.32:8000/api/exercises/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        const styledHtmlContent = `
        <style>
          body {
            font-size: 45px; /* Zwiększ rozmiar czcionki */
            line-height: 1.6; /* Zwiększ interlinię */
          }
        </style>
        ${data.html_content}
      `;
      setListing({
        ...data,
        html_content: styledHtmlContent,
      });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Ionicons name="bookmark-outline" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={(event) => {
            scrollOffset.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={{ uri: listing.image }}
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            {/* <Text style={styles.listingName}>{listing.title}</Text>
            <Text style={styles.listingShortDescription}>{listing.short_description}</Text> 

            <View style={styles.highlightWrapper}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primaryColor} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Type</Text>
                  <Text style={styles.highlightTxtVal}>{listing.type}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <FontAwesome name="users" size={18} color={Colors.primaryColor} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Language</Text>
                  <Text style={styles.highlightTxtVal}>{listing.language}</Text>
                </View>
              </View>
            </View> */}

            <WebView
              originWhitelist={['*']}
              source={{ html: listing.html_content }}
              style={styles.webView}
            />
          </View>
        </Animated.ScrollView>
      </View>
{/* 
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.footerBtn, styles.footerBookBtn]}
        >
          <Text style={styles.footerBtnTxt}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.footerBtn}>
          <Text style={styles.footerBtnTxt}>Details</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </>
  );
};

export default ListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  listingName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  listingShortDescription: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 10,
  },
  highlightWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
  },
  webView: {
    height: 800, // Adjust the height based on your needs
    marginTop: 20,
  },
  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primaryColor,
    marginRight: 20,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
