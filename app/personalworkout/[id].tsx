import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
const { width } = Dimensions.get("window");

type ExerciseType = {
  id: number;
  title: string;
  short_description: string;
  image: string;
};

type WorkoutType = {
  id: number;
  title: string;
  exercises: number[];
};

const WorkoutDetails = () => {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.32:8000/api/personalworkout/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const workoutData = await response.json();
        setWorkout(workoutData);

        // Fetch exercises data
        const exerciseIds = workoutData.exercises.join(',');
        const exercisesResponse = await fetch(`http://192.168.1.32:8000/api/exercises/`);
        if (!exercisesResponse.ok) {
          throw new Error(`HTTP error! status: ${exercisesResponse.status}`);
        }
        const exercisesData = await exercisesResponse.json();
        // Filter exercises to include only those in the workout
        const filteredExercises = exercisesData.filter((exercise: ExerciseType) =>
          workoutData.exercises.includes(exercise.id)
        );
        setExercises(filteredExercises);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workout or exercises:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const renderItem: ListRenderItem<ExerciseType> = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.itemDescription}>{item.short_description}</Text>
    </View>
  );

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

  if (!workout) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No workout found</Text>
      </View>
    );
  }

  return (
  <>
    <View style={styles.container}>
      <Text style={styles.title}>{workout.title}</Text>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </View>
          <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.footerBtn, styles.footerBookBtn]}
          >
            <Text style={styles.footerBtnTxt}>Start workout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.footerBtn}>
            <Text style={styles.footerBtnTxt}>Details</Text>
          </TouchableOpacity>
        </Animated.View>
    </>
  );
};

export default WorkoutDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 20,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.gray,
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
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
});
