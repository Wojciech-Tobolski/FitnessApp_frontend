import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ExerciseTemplate = ({
  imageUri,
  htmlContent,
  onBack,
  onBookmark,
  onPrev,
  onNext,
}) => {
  return (
    <>
      <View style={styles.container}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
          <View style={styles.contentWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              style={styles.webView}
            />
          </View>
        </Animated.ScrollView>
        <View style={styles.navigationArrows}>
          <TouchableOpacity onPress={onPrev} style={styles.arrowButton}>
            <Ionicons name="arrow-back" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.arrowButton}>
            <Ionicons name="arrow-forward" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity onPress={onPrev} style={[styles.footerBtn, styles.footerPrevBtn]}>
          <Text style={styles.footerBtnTxt}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={[styles.footerBtn, styles.footerNextBtn]}>
          <Text style={styles.footerBtnTxt}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default ExerciseTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  webView: {
    height: 800, // Adjust the height based on your needs
    marginTop: 20,
  },
  arrowButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationArrows: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
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
  footerPrevBtn: {
    backgroundColor: Colors.gray,
    marginRight: 10,
  },
  footerNextBtn: {
    backgroundColor: Colors.primaryColor,
    marginLeft: 10,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
