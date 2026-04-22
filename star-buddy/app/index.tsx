import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Star Buddy</Text>
        <Text style={styles.subtitle}>Explore the Universe</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
